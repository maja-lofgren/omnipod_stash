//read env-files (not used by heroku task!)
const dotenv = require('dotenv');
dotenv.config();

async function updatedb(nrToAdd, Typ, resetdb = false) {
    var url = process.env.CONNSTR_mongo;
    console.log("adding: " + nrToAdd + " to " + Typ + " in db!");

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
    var lastKnownChange = new Date().toISOString();
    try {
        
        //fetch last entry in omnipodstash
        let doc = await db.collection("omnipodstash")
            .find({ Type: Typ }, { projection: { _id: 0 } })
            .sort({ $natural: -1 }) //bottomsup
            .limit(1)
            .next();
        if (doc != null) {
            if (!resetdb) {
                count = doc.Count;
                lastKnownChange = doc.LastKnownChange;
            }
            console.log('count: ' + count);
            console.log('lastKnownChange: ' + lastKnownChange);
        }

        var operation = "Manual Add";
        if (resetdb) {
            operation = "Manual SetCount";
        }

        //create new db-object
        var dbEntity = {
            date: new Date().toISOString(),
            diff: nrToAdd,
            Count: parseInt(count) + parseInt(nrToAdd),
            LastKnownChange: lastKnownChange,
            Operation: operation,
            Type: Typ
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

async function getCount(Typ) {
    var url = process.env.CONNSTR_mongo;
    console.log("get" + Typ + "Count");

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
    var count = "-";
    try {
        //fetch last entry in omnipodstash
        let doc = await db.collection("omnipodstash")
            .find({ Type: Typ }, { projection: { _id: 0 } })
            .sort({ $natural: -1 }) //bottomsup
            .limit(1)
            .next();

        count = doc.Count;
        console.log('count: ' + count);

    } catch (err) {
        console.log(err);
    } finally {
        // close the connection to db when you are done with it
        dbClient.close();
    }

    return count;
};

async function resetCount(Typ) {
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
            Count: 0,
            LastKnownChange: new Date().toISOString(),
            Operation: "Api Reset",
            Type: Typ
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
module.exports = { updatedb, getCount, resetCount }