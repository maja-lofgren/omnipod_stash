const express = require('express');

const path = require('path');

const dbhelper = require("./updatedb.js")

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

// Answer API requests with param ("/addtocount/pod/10") 
// For params instead of /:sdgf/:dfsf ("/addtocount?nr=23&type=omnipod") see: https://stackoverflow.com/a/17008027

app.get('/getcount/:typ', async function (req, res) {
    
    let count = await dbhelper.getCount(req.params.typ);

    res.set('Content-Type', 'application/json');
    res.send('{"Count":"' + count + '"}');
});

app.get('/addtocount/:typ/:nrToAdd', async function (req, res) {
    let typ = req.params.typ;
    let nrToAdd = req.params.nrToAdd
    console.log(typ + ":" + nrToAdd);

    await dbhelper.updatedb(nrToAdd, typ);
    let count = await dbhelper.getCount(typ);

    res.set('Content-Type', 'application/json');
    res.send('{"message":"' + nrToAdd + ' ' + typ + 's added to '  + typ + '-stash. New count: ' + count + '"}');
});

app.get('/setcount/:typ/:nrToSet', async function (req, res) {
    console.log(req.params.typ + ":" + req.params.nrToSet);

    await dbhelper.updatedb(req.params.nrToSet, req.params.typ, true);

    res.set('Content-Type', 'application/json');
    res.send('{"message":"Stash is reset to: ' + req.params.nrToSet + ' ' + req.params.typ + 's!"}');
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