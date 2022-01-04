function getLastKnownPodChange() {

}

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
                    console.log("collection already exists!")
                }
                else {
                    throw err;
                }
            }
            else {
                console.log("Collection is created!");
            }
            /** TOdo
             * kör en find likt nedan för att se om det har använts fler poddar sen sist
             * spara undan datum för sista podden som slängdes (alt id?) för att inte leta längre än till den
             * 
            */
            //var query = { address: "Park Lane 38" };
            db.collection("omnipodstash")
                .find({}, { projection: { _id: 0 } })
                .sort({ $natural: -1 }) //last
                .limit(1)
                .next() //hittar första...
                .then(
                    function (doc) {
                        var count = 0;
                        var lastKnownPodChange = null;
                        if (doc != null && doc.hasOwnProperty('OmnipodCount')) {
                            count = doc.OmnipodCount;
                            lastKnownPodChange = doc.LastKnownPodChange;
                        }
                        console.log('count: ' + count);
                        console.log('lastKnownPodChange: ' + lastKnownPodChange);
                        if (lastKnownPodChange != null) {
                            //find nr of new pod-changes: 
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
                                    console.log(doc.count);
                                    let newUsedPods = doc.count;
                                    

                                    var myobj = {
                                        date: new Date().toISOString(),
                                        diff: -newUsedPods,
                                        OmnipodCount: count-newUsedPods,
                                        LastKnownPodChange: "2021-10-11T16:18:08Z"
                                    };
                                    db.collection("omnipodstash").insertOne(myobj, function (err, res) {
                                        if (err) throw err;
                                        console.log("1 document inserted");
                                        // close the connection to db when you are done with it
                                        dbClient.close();
                                    });
                                },
                                    function (err) {
                                        console.log('Error:', err);
                                    }
                                );

                        } else {
                            //todo gör ingenting!
                            var nya = 5;
                            var myobj = {
                                date: new Date().toISOString(),
                                diff: nya,
                                OmnipodCount: nya + count,
                                LastKnownPodChange: "2021-10-11T16:18:08Z"
                            };
                            db.collection("omnipodstash").insertOne(myobj, function (err, res) {
                                if (err) throw err;
                                console.log("1 document inserted");
                                // close the connection to db when you are done with it
                                dbClient.close();
                            });
                        }

                    },
                    function (err) {
                        console.log('Error:', err);
                    }
                );

            //insert
            // db.collection("omnipodstash")
            //     .find({}, { projection: { _id: 0 } })
            //     .sort({ $natural: -1 })
            //     .limit(1)
            //     .next()
            //     .then(
            //         function (doc) {
            //             var count = 0;
            //             if (doc != null && doc.hasOwnProperty('OmnipodCount')) count = doc.OmnipodCount;
            //             console.log(count);
            //             var nya = 5;
            //             var myobj = {
            //                 date: new Date().toISOString(),
            //                 diff: nya,
            //                 OmnipodCount: nya + count,
            //                 LastChangedPod: "2021-12-12T20:23:28.802Z"
            //             };
            //             db.collection("omnipodstash").insertOne(myobj, function (err, res) {
            //                 if (err) throw err;
            //                 console.log("1 document inserted");
            //                 // close the connection to db when you are done with it
            //                 dbClient.close();
            //             });
            //         },
            //         function (err) {
            //             console.log('Error:', err);
            //         }
            //     );



        });



    });

    // var MongoClient = require('mongodb').MongoClient, format = require('util').format;

    // MongoClient.connect('mongodb://127.0.0.1:27017/nightscout', function(err, a) {
    //     const db = a.db('nightscout');
    //     if(err) throw err;   
    //     db.collectionNames(function(err, collections){
    //         console.log(collections);   
    //     }); 
    // });
}
checkOmnipodState()



//// db.collection("treatments")
                                    //     .find({
                                    //         "created_at": {
                                    //             "$gt": lastKnownPodChange
                                    //         },
                                    //         "eventType": "Insulin Change"
                                    //     },
                                    //         {
                                    //             projection: {
                                    //                 "created_at": 1,
                                    //                 "eventType": 1
                                    //             }
                                    //         })
                                    //     .sort({ "created_at":-1 })
                                    //     .toArray(function (err, doc) {
                                    // var count = 0;
                                    // if (doc != null && doc.hasOwnProperty('OmnipodCount')) count = doc.OmnipodCount;
                                    // console.log(count);
                                    // var nya = 5;
                                    // var myobj = {
                                    //     date: new Date().toISOString(),
                                    //     diff: nya,
                                    //     OmnipodCount: nya + count,
                                    //     LastChangedPod: "2021-12-12T20:23:28.802Z"
                                    // };
                                    // db.collection("omnipodstash").insertOne(myobj, function (err, res) {
                                    //     if (err) throw err;
                                    //     console.log("1 document inserted");
                                    // });