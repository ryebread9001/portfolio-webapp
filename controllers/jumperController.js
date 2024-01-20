const Moment = require('moment')
var axios = require('axios');
const { set } = require('../app');

const dbUrl = 'https://us-west-2.aws.data.mongodb-api.com/app/data-wcvum/endpoint/data/v1/action/'
const db = 'portfolio_data'
const dataSource = 'Ryebread0'
const collection = 'jumper'



async function callDB(endpoint, data) {
                
    var config = {
        method: 'post',
        url: dbUrl + endpoint,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'api-key': process.env.API_KEY,
          'Accept': 'application/json'
        },
        data: data
    };
    
    let obj;

    await axios(config)
        .then(function (response) {
            if (endpoint == 'updateOne' || endpoint == 'findOne') console.dir(response.data)
            obj = response.data
        })
        .catch(function (error) {
            console.log(error)
            obj = error
        });
    return obj
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function handleWeek(req, prev, set) {
    let newData = {
        "score": req.body.score,
        "createdAt": new Moment().format('LLLL')
    }
    console.log(true == prev.week)
    if (prev.week) {
        if (new Moment(prev.week.createdAt, "LLLL").isSame(new Moment(), "week")) { // check if we have a valid score this week
            if (prev.week.score < req.body.score) { // if true, check if req.body.score is higher than it
                set["week"] = newData
            }
        } else { // else add new weeks score
            set["week"] = newData
        }
    } else {
        set["week"] = newData
    }
}

module.exports.postScore = async (req, res, next) => {
    try {
        let name = req.body.name

        if (req.body.score < 50 && isNumeric(req.body.score)) {
            console.log("here2");
            let result;
            var dbPosted = false;
            var data = {
                "collection": collection,
                "database": db,
                "dataSource": dataSource,
                "filter": {"name": name}
            };
            console.log(data)
            let prev = (await callDB('findOne', JSON.stringify(data))).document
            console.log('prev: ', prev)
            
            if (prev) {
                let set = {
                    "score": prev.score < req.body.score ? req.body.score : prev.score,
                    "createdAt": new Moment().format('LLLL')
                }
                handleWeek(req, prev, set)
                console.log(set);
                console.log('prev is true')
                // edit existing document
                data["update"] = { 
                    "$set": set
                }
                console.log(data["update"])
                result = (await callDB('updateOne', JSON.stringify(data)))
                console.log(result)
                dbPosted = true;
            } else {
                console.log('prev is false')
                // create new document for user
                var dataInsert = JSON.stringify({
                    "collection": collection,
                    "database": db,
                    "dataSource": dataSource,
                    "document": {
                        "name": name,
                        "score": req.body.score,
                        "createdAt": new Moment().format('LLLL'),
                        "week": {
                            "score": req.body.score,
                            "createdAt": new Moment().format('LLLL')
                        }
                    }
                });
                result = (await callDB('insertOne', dataInsert))
                console.log(result)
                dbPosted = true
            }
            console.log("sending res");     
            res.send(`score of ${req.body.score} posted: ${dbPosted}`)
        } else {
            res.send(`nice try...`)
        }
        
    } catch (err) {
        next(err)
    };
}

module.exports.getScore = async (req, res, next) => {
    try {
        var data = JSON.stringify({
            "collection": collection,
            "database": db,
            "dataSource": dataSource,
            "filter": {}
        });
        let result = (await callDB('find', data))
        res.send(result)
    } catch (err) {
        next(err)
    };
}