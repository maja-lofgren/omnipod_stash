//run with: node bin/test.js

//read env-files (not used by heroku task!)
const dotenv = require('dotenv');
dotenv.config();

function sendEmail(omnipodCount) {
    console.log("You are running low on pods!!! \n Notify owner to get more!");
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_FROM_PASS
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: 'Dags att beställa poddar!',
        text: 'Du har nu bara: ' + omnipodCount + " kvar..."
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

async function checkOmnipodState() {
    // we create 'users' collection in newdb database
    var url = process.env.CONNSTR_mongo;

    // create a client to mongodb
    var MongoClient = require('mongodb').MongoClient;

    // make client connect to mongo service
    const dbClient = await MongoClient.connect(url);
    if (!dbClient) {
        console.log("failed to connect to mongodb!\nCheck your connection string: " + process.env.CONNSTR_mongo)
        return;
    }
    var db = null;
    try {
        db = dbClient.db('nightscout');
        // db pointing to newdb
        console.log("Switched to " + db.databaseName + " database");
        // create 'users' collection in newdb database
        await db.createCollection("omnipodstash");

    } catch (err) {
        if (err.message == 'Collection already exists. NS: nightscout.omnipodstash') {
            console.log("omnipodstash exists!")
        }
        else {
            dbClient.close();
            process.exit();//for heroku
        }
    }
    var count = 0;
    var lastKnownPodChange = null;
    try {
        //fetch last entry in omnipodstash
        let doc = await db.collection("omnipodstash")
            .find({}, { projection: { _id: 0 } })
            .sort({ $natural: -1 }) //bottomsup
            .limit(1)
            .next();

        if (doc != null && doc.hasOwnProperty('OmnipodCount')) {
            count = doc.OmnipodCount;
            lastKnownPodChange = doc.LastKnownPodChange;
            console.log('count: ' + count);
            console.log('lastKnownPodChange: ' + lastKnownPodChange);
        }

        if (lastKnownPodChange != null) {
            //fetch nr of new pod-changes: 
            let docTreatments = await db.collection("treatments")
                .aggregate([
                    {
                        "$match": {
                            "created_at": {
                                "$gt": lastKnownPodChange
                            },
                            "eventType": "Insulin Change"
                        }
                    },
                    {
                        "$group": {
                            "_id": "$eventType",
                            "count": { "$sum": 1 }
                        }
                    }
                ])
                .next();
            if (docTreatments == null) {
                console.log("no new pod found");
                dbClient.close();
                process.exit();//for heroku
            }
            let newUsedPods = docTreatments.count;
            console.log("newUsedPods:" + newUsedPods);

            let omnipodCount = count - newUsedPods;
            if (omnipodCount < 3) {
                //TODO notify user (email, telegram...? )
                sendEmail(omnipodCount);
                //give it some time before exit...
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
            //fetch date of last used pod: 
            let docLastUsedPod = await db.collection("treatments")
                .find({eventType: "Insulin Change"}, { projection: { created_at: 1 } })
                .sort({ $natural: -1 })
                .limit(1)
                .next();

            let lastPodChange = docLastUsedPod.created_at;
            //create new db-object
            var dbEntity = {
                date: new Date().toISOString(),
                diff: -newUsedPods,
                OmnipodCount: omnipodCount,
                LastKnownPodChange: lastPodChange,
                type: "Scheduled Task"
            };

            //update omnipodstash with latest: 
            await db.collection("omnipodstash").insertOne(dbEntity);

            console.log("1 document inserted:");
            console.log(dbEntity);

        } else {
            //first time = omnipodstash is empty...
            //update with latest pod and zero stash:
            //fetch date of last used pod: 
            let doclastUsedPod = await db.collection("treatments")
                .find({eventType: "Insulin Change"}, { projection: { created_at: 1 } })
                .sort({ $natural: -1 })
                .limit(1)
                .next();

            let lastPodChange = doclastUsedPod.created_at;
            var dbEntity = {
                date: new Date().toISOString(),
                diff: 0,
                OmnipodCount: 7,
                LastKnownPodChange: lastPodChange,
                type: "Scheduled Task"
            };
            //update db: 
            await db.collection("omnipodstash").insertOne(dbEntity);
            console.log("1 document inserted:");
            console.log(dbEntity);
            sendEmail(0);
            //give it some time before exit...
            await new Promise(resolve => setTimeout(resolve, 5000));
            // close the connection to db when you are done with it
        }


    } catch (err) {
        console.log(err);
    } finally {
        // close the connection to db when you are done with it
        dbClient.close();
        process.exit();//for heroku
    }

}
checkOmnipodState()
