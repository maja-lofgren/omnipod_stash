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
app.get('/addtopodcount/:nrToAdd', async function (req, res) {
    console.log(req.params.nrToAdd);

    await dbhelper.updatedb(req.params.nrToAdd, "pod");

    res.set('Content-Type', 'application/json');
    res.send('{"message":"' + req.params.nrToAdd + ' pods added to stash!"}');
});

app.get('/setpodcount/:nrToSet', async function (req, res) {
    console.log(req.params.nrToSet);

    await dbhelper.updatedb(req.params.nrToSet, "pod", true);

    res.set('Content-Type', 'application/json');
    res.send('{"message":"Stash is reset to: ' + req.params.nrToSet + ' pods!"}');
});


// Answer API requests with param ("/addtopodcount/10") 
// For multiple params ("/addtopodcount?nr=23&type=omnipod") see: https://stackoverflow.com/a/17008027
app.get('/getpodcount', async function (req, res) {
    
    let count = await dbhelper.getCount("pod");

    res.set('Content-Type', 'application/json');
    res.send('{"Count":"' + count + '"}');
});

//sensor:
app.get('/addtosensorcount/:nrToAdd', async function (req, res) {
    console.log(req.params.nrToAdd);

    await dbhelper.updatedb(req.params.nrToAdd, "sensor");

    res.set('Content-Type', 'application/json');
    res.send('{"message":"' + req.params.nrToAdd + ' sensors added to stash!"}');
});

app.get('/setsensorcount/:nrToSet', async function (req, res) {
    console.log(req.params.nrToSet);

    await dbhelper.updatedb(req.params.nrToSet, "sensor", true);

    res.set('Content-Type', 'application/json');
    res.send('{"message":"Stash is reset to: ' + req.params.nrToSet + ' sensors!"}');
});


app.get('/getsensorcount', async function (req, res) {
    
    let count = await dbhelper.getCount("sensor");

    res.set('Content-Type', 'application/json');
    res.send('{"Count":"' + count + '"}');
});

//insu:
app.get('/addtoinsulincount/:nrToAdd', async function (req, res) {
    console.log(req.params.nrToAdd);

    await dbhelper.updatedb(req.params.nrToAdd, "insulin");

    res.set('Content-Type', 'application/json');
    res.send('{"message":"' + req.params.nrToAdd + ' insulin added to stash!"}');
});

app.get('/setinsulincount/:nrToSet', async function (req, res) {
    console.log(req.params.nrToSet);

    await dbhelper.updatedb(req.params.nrToSet, "insulin", true);

    res.set('Content-Type', 'application/json');
    res.send('{"message":"Stash is reset to: ' + req.params.nrToSet + ' insulin!"}');
});


app.get('/getinsulincount', async function (req, res) {
    
    let count = await dbhelper.getCount("insulin");

    res.set('Content-Type', 'application/json');
    res.send('{"Count":"' + count + '"}');
});

//reset:
app.get('/resetcount/:typ', async function (req, res) {
    
    await dbhelper.resetCount(req.params.typ);

    res.set('Content-Type', 'application/json');
    res.send('{"' + req.params.typ + '-Count":0"}');
});
// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`);
});