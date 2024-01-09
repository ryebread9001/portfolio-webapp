import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const Moment = require('moment')
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// TODO figure out dynamoDB sdk


module.exports.postScore = async (req, res, next) => {
    try {
        const command = new PutCommand({
            TableName: "HappyAnimals",
            Item: {
                CommonName: "Shiba Inu",
            },
        });
    
        const response = await docClient.send(command);
        console.log(response);
        return response;
        // let data = (await req.session.TD.getTicket(42, 6489630))
        // const username = req.session.user.FullName
        // let patch = []
        // patch.push(makePatch(data['Description'], username, req.body['score']))
        // patch.push(makeWeekPatch(data.Attributes.find((attr)=>attr.ID==14481).Value, username, req.body['score']))
        // console.log(patch)
        // await req.session.TD.patchTicket(42, 6489630, patch)
        // res.send(`score-posted: ${req.body['score'] + "-" + username}`)
    } catch (err) {
        next(err)
    };
}

/*
function makePatch(data, username, score) {
    if (data.length < 1) data = "{}";
    data = JSON.parse(data)
    
    if (data[username]) {
        if (score > parseInt(data[username])) data[username] = score
    } else {
        data[username] = score;
    }
    data = JSON.stringify(data);

    patchDoc = {"op": "add", "path": "/Description", "value": data};
    return patchDoc
}

function makeWeekPatch(data, username, score) {
    data = JSON.parse(data)
    console.log(data);
    if (data[username]) {
        if (!(new Moment(data[username.date]).isSame(new Date(), 'week'))) {
            data[username].score = score;
            data[username].date = new Moment();
        } else if (score > parseInt(data[username].score)) {
            data[username].score = score;
            data[username].date = new Moment();
        }
    } else {
        console.log("HERE");
        data[username] = {};
        data[username].score = score;
        data[username].date = new Moment();
    }
    data = JSON.stringify(data);
    
    patchDoc = {"op": "add", "path": "/attributes/14481", "value": data};
    return patchDoc
}

function getThisWeek(week) {
    week = JSON.parse(week)
    var filtered = Object.keys(week).reduce((p, c) => {
        if (Moment(week[c].date).isSame(new Date(), 'week')) {
            p[c] = week[c];
        }
        return p
    }, {})
    return JSON.stringify(filtered)
}
*/

module.exports.getScore = async (req, res, next) => {
    try {
        // let data = (await req.session.TD.getTicket(42, 6489630))
        // high = data['Description']
        // week = data.Attributes.find((attr)=>attr.ID==14481).Value
        // week = getThisWeek(week)
        // res.send(high+"&"+week)
        res.send('getScore Response')
    } catch (err) {
        next(err)
    };
}