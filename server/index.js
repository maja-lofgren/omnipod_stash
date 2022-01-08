const express = require('express');
const path = require('path');

const dbhelper = require("./updatedb.js")

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

// Answer API requests with param ("/addpods/10") 
// For multiple params ("/addpods?nr=23&type=omnipod") see: https://stackoverflow.com/a/17008027
app.get('/addpods/:nrOfPods', function (req, res) {
    console.log(req.params.nrOfPods);
    dbhelper.updatedb(req.params.nrOfPods);
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Server adding ' + req.params.nrOfPods + ' pods!"}');
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`);
});