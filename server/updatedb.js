//read env-files (not used by heroku task!)
const dotenv = require('dotenv');
dotenv.config();

async function updatedb(nrOfPodsToAdd, resetdb = false) {
    var url = process.env.CONNSTR_mongo;
    console.log("adding: " + nrOfPodsToAdd + " to db!");

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

    } catch (err) {
        dbClient.close();
        console.log(err);
        return;
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
        if (doc != null) {
            if (!resetdb) {
                count = doc.OmnipodCount;
            }
            lastKnownPodChange = doc.LastKnownPodChange;
            console.log('count: ' + count);
            console.log('lastKnownPodChange: ' + lastKnownPodChange);
        }

        var type = "Manual Add";
        if (resetdb) {
            type = "Manual SetCount";
        }
        //create new db-object
        var dbEntity = {
            date: new Date().toISOString(),
            diff: nrOfPodsToAdd,
            OmnipodCount: parseInt(count) + parseInt(nrOfPodsToAdd),
            LastKnownPodChange: lastKnownPodChange,
            type: type
        };

        //update omnipodstash with latest: 
        await db.collection("omnipodstash").insertOne(dbEntity);

        console.log("1 document inserted:");
        console.log(dbEntity);

    } catch (err) {
        console.log(err);
    } finally {
        // close the connection to db when you are done with it
        dbClient.close();
    }
};

async function getPodCount() {
    var url = process.env.CONNSTR_mongo;
    console.log("getPodCount");

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

    } catch (err) {
        dbClient.close();
        console.log(err);
        return;
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

        count = doc.OmnipodCount;
        lastKnownPodChange = doc.LastKnownPodChange;
        console.log('count: ' + count);
        console.log('lastKnownPodChange: ' + lastKnownPodChange);

    } catch (err) {
        console.log(err);
    } finally {
        // close the connection to db when you are done with it
        dbClient.close();
    }

    return count;
};

async function resetCount() {
    var url = process.env.CONNSTR_mongo;
    console.log("resetting db counter to 0");

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

    } catch (err) {
        dbClient.close();
        console.log(err);
        return;
    }
    try {

        //create new db-object
        var dbEntity = {
            date: new Date().toISOString(),
            diff: 0,
            OmnipodCount: 0,
            LastKnownPodChange: new Date().toISOString(),
            type: "Api Reset"
        };

        //update omnipodstash with latest: 
        await db.collection("omnipodstash").insertOne(dbEntity);

        console.log("1 document inserted:");
        console.log(dbEntity);

    } catch (err) {
        console.log(err);
    } finally {
        // close the connection to db when you are done with it
        dbClient.close();
    }
};
module.exports = { updatedb, getPodCount, resetCount }