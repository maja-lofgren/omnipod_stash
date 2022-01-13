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
var lastId = '';

function validateCall(type, val, op, id) {

    var isValid = true;
    if (id && lastId === id) { //frontend sets id on calls
        console.log("Api received multiple calls...");
        isValid = false;
        
    } else if (!id //gmail doesn't
        && type === lastType
        && val === lastVal
        && op === lastOp
        && lastCall > (new Date()).setSeconds((new Date()).getSeconds() - delaytime)
    ) {
        console.log("too early, at least " + delaytime + "s between api-calls (prevent douplicates)");
        isValid = false;
    }else{
        lastCall = new Date();
    }
    lastType = type;
    lastVal = val;
    lastOp = op;
    if (id) {
        lastId = id;
    }
    return isValid;
}

app.get('/addtocount', async function (req, res) {

    let typ = req.query.typ;
    let nr = req.query.nr
    let id = req.query.id;
    console.log(req.query);
    console.log(typ + ":" + nr);

    res.set('Content-Type', 'application/json');

    if (!validateCall(typ, nr, "add", id)) {
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
    let id = req.query.id;
    
    console.log(req.query);
    console.log(typ + ":" + nr);
    
    res.set('Content-Type', 'application/json');

    if (!validateCall(typ, nrToAdd, "set", id)) {
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


// //reset:
// app.get('/resetcount/:typ', async function (req, res) {

//     await dbhelper.resetCount(req.params.typ);

//     res.set('Content-Type', 'application/json');
//     res.send('{"' + req.params.typ + '-Count":0"}');
// });
// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`);
});