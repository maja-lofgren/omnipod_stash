const express = require('express');

const path = require('path');

const dbhelper = require("./updatedb.js")

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

// Answer API requests with param ("/addtopodcount/10") 
// For multiple params ("/addtopodcount?nr=23&type=omnipod") see: https://stackoverflow.com/a/17008027
app.get('/addtopodcount/:nrOfPodsToAdd', async function (req, res) {
    console.log(req.params.nrOfPodsToAdd);

    await dbhelper.updatedb(req.params.nrOfPodsToAdd, "pod");

    res.set('Content-Type', 'application/json');
    res.send('{"message":"' + req.params.nrOfPodsToAdd + ' pods added to stash!"}');
});

app.get('/setpodcount/:nrOfPods', async function (req, res) {
    console.log(req.params.nrOfPods);

    await dbhelper.updatedb(req.params.nrOfPods, "pod", true);

    res.set('Content-Type', 'application/json');
    res.send('{"message":"Stash is reset to: ' + req.params.nrOfPods + ' pods!"}');
});


// Answer API requests with param ("/addtopodcount/10") 
// For multiple params ("/addtopodcount?nr=23&type=omnipod") see: https://stackoverflow.com/a/17008027
app.get('/getpodcount', async function (req, res) {
    
    let count = await dbhelper.getCount("pod");

    res.set('Content-Type', 'application/json');
    res.send('{"podCount":"' + count + '"}');
});

app.get('/getsensorcount', async function (req, res) {
    
    let count = await dbhelper.getCount("sensor");

    res.set('Content-Type', 'application/json');
    res.send('{"sensorCount":"' + count + '"}');
});

app.get('/addtosensorcount/:nrOfSensorsToAdd', async function (req, res) {
    console.log(req.params.nrOfSensorsToAdd);

    await dbhelper.updatedb(req.params.nrOfSensorsToAdd, "sensor");

    res.set('Content-Type', 'application/json');
    res.send('{"message":"' + req.params.nrOfSensorsToAdd + ' sensors added to stash!"}');
});

app.get('/setsensorcount/:nrOfSensors', async function (req, res) {
    console.log(req.params.nrOfSensors);

    await dbhelper.updatedb(req.params.nrOfSensors, "sensor", true);

    res.set('Content-Type', 'application/json');
    res.send('{"message":"Stash is reset to: ' + req.params.nrOfSensors + ' sensors!"}');
});




app.get('/resetcount', async function (req, res) {
    
    await dbhelper.resetCount();

    res.set('Content-Type', 'application/json');
    res.send('{"podCount":0"}');
});
// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`);
});