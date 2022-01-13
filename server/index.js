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

const delaytime = 5;
var lastCall = new Date();
var lastType = '';
var lastVal = '';
var lastOp = '';
var lastUst = '';
var lastUsg = '';

function validateCall(type, val, op, ust, usg) {
    lastCall.setSeconds(lastCall.getSeconds() + delaytime);
    var isValid = true;
    if ((ust && ust)
        && lastUst === ust
        && lastUsg === usg) {
        console.log("Api received multiple calls...");
        console.log("type: " + type + " val: " + val + " op: " + op + " dT: " + lastCall - new Date());
        isValid = false;
    } else if (type === lastType
        && val === lastVal
        && op === lastOp
        && lastCall > new Date()
    ) {
        console.log("too early, at least " + delaytime + "s between api-calls (prevent douplicates)");
        console.log("type: " + type + " val: " + val + " op: " + op + " dT: " + lastCall - new Date());
        isValid = false;
    }
    lastType = type;
    lastVal = val;
    lastOp = op;
    lastCall = new Date();
    if (ust && ust) {
        lastUst = ust;
        lastUsg = usg;
    }
    return isValid;
}

app.get('/addtocount', async function (req, res) {

    let typ = req.query.typ;
    let nr = req.query.nr
    let ust = req.query.ust;
    let usg = req.query.usg;
    console.log(req.query);
    console.log(typ + ":" + nr);

    res.set('Content-Type', 'application/json');

    if (!validateCall(typ, nr, "add", ust, usg)) {
        console.log("Too soon!");
        res.send('{"message":"Too soon!"}');
        return;
    }

    if (isNaN(+nr)) {
        console.log("Not a number!");
        res.send('{"message":"not a number!"}');
    } else {
        await dbhelper.updatedb(nr, typ);
        let count = await dbhelper.getCount(typ);
        res.send('{"message":"' + nr + ' ' + typ + 's added to ' + typ + '-stash. New count: ' + count + '"}');

    }
});

app.get('/setcount', async function (req, res) {
    let typ = req.query.typ;
    let nr = req.query.nr
    let ust = req.query.ust;
    let usg = req.query.usg;
    
    console.log(req.query);
    console.log(typ + ":" + nr);
    
    res.set('Content-Type', 'application/json');

    if (!validateCall(typ, nrToAdd, "set", ust, usg)) {
        console.log("Too soon!");
        res.send('{"message":"Too soon!"}');
        return;
    }

    if (isNaN(+nr)) {
        console.log("Not a number!");
        res.send('{"message":"not a number!"}');
    } else {
        await dbhelper.updatedb(nr, typ, true);
        res.send('{"message":"Stash is reset to: ' + nr + ' ' + typ + 's!"}');
    }
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