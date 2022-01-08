function updatedb(nrOfNewPods) {
    var url = process.env.CONNSTR_mongo;
    console.log("adding: " + nrOfNewPods + " to db!");

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

        //create new db-object
        var dbEntity = {
            date: new Date().toISOString(),
            diff: nrOfNewPods,
            OmnipodCount: count + nrOfNewPods,
            LastKnownPodChange: lastKnownPodChange//"2021-10-11T16:18:08Z"
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
module.exports = { updatedb }