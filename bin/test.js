function checkOmnipodState() {
    // we create 'users' collection in newdb database
    var url = "mongodb://localhost:27017/nightscout";

    // create a client to mongodb
    var MongoClient = require('mongodb').MongoClient;

    // make client connect to mongo service
    MongoClient.connect(url, function (err, dbClient) {
        if (err) throw err;
        const db = dbClient.db('nightscout');
        // db pointing to newdb
        console.log("Switched to " + db.databaseName + " database");
        // create 'users' collection in newdb database
        db.createCollection("omnipodstash", function (err, result) {
            if (err) {
                if (err.message == 'Collection already exists. NS: nightscout.omnipodstash') {
                    console.log("omnipodstash exists!")
                }
                else {
                    throw err;
                }
            }
            else {
                console.log('Collection "omnipodstash" is created!');
            }

            //fetch last entry in omnipodstash
            db.collection("omnipodstash")
                .find({}, { projection: { _id: 0 } })
                .sort({ $natural: -1 }) //last
                .limit(1)
                .next() //open first return...
                .then(
                    function (doc) {
                        var count = 0;
                        var lastKnownPodChange = null;
                        if (doc != null && doc.hasOwnProperty('OmnipodCount')) {
                            count = doc.OmnipodCount;
                            lastKnownPodChange = doc.LastKnownPodChange;
                            console.log('count: ' + count);
                            console.log('lastKnownPodChange: ' + lastKnownPodChange);
                        }

                        if (lastKnownPodChange != null) {
                            //fetch nr of new pod-changes: 
                            db.collection("treatments")
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
                                .next()
                                .then(function (doc) {
                                    if (doc == null) {
                                        console.log("no new pod found");
                                        dbClient.close();
                                        return;
                                    }
                                    let newUsedPods = doc.count;
                                    console.log("newUsedPods:" + newUsedPods);

                                    //fetch date of last used pod: 
                                    db.collection("treatments")
                                        .find({}, { projection: { created_at: 1 } })
                                        .sort({ $natural: -1 })
                                        .limit(1)
                                        .next()
                                        .then(
                                            function (doc) {
                                                let lastPodChange = doc.created_at;
                                                //create new db-object
                                                var dbEntity = {
                                                    date: new Date().toISOString(),
                                                    diff: -newUsedPods,
                                                    OmnipodCount: count - newUsedPods,
                                                    LastKnownPodChange: lastPodChange//"2021-10-11T16:18:08Z"
                                                };
                                                //update omnipodstash with latest: 
                                                db.collection("omnipodstash").insertOne(dbEntity, function (err, res) {
                                                    if (err) throw err;
                                                    console.log("1 document inserted:");
                                                    console.log(dbEntity);
                                                    // close the connection to db when you are done with it
                                                    dbClient.close();
                                                });
                                            });


                                },
                                    function (err) {
                                        console.log('Error:', err);
                                    }
                                );

                        } else {
                            //first time = omnipodstash is empty...
                            //update with latest pod and zero stash:
                            //fetch date of last used pod: 
                            db.collection("treatments")
                                .find({}, { projection: { created_at: 1 } })
                                .sort({ $natural: -1 })
                                .limit(1)
                                .next()
                                .then(
                                    function (doc) {
                                        let lastPodChange = doc.created_at;
                                        var dbEntity = {
                                            date: new Date().toISOString(),
                                            diff: 0,
                                            OmnipodCount: 0,
                                            LastKnownPodChange: lastPodChange
                                        };
                                        //update db: 
                                        db.collection("omnipodstash").insertOne(dbEntity, function (err, res) {
                                            if (err) throw err;
                                            console.log("1 document inserted:");
                                            console.log(dbEntity);
                                            // close the connection to db when you are done with it
                                            dbClient.close();
                                        });
                                    });

                        }

                    },
                    function (err) {
                        console.log('Error:', err);
                    }
                );


        });



    });

}
checkOmnipodState()
