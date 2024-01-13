const Moment = require('moment')
var axios = require('axios');

const dbUrl = 'https://us-west-2.aws.data.mongodb-api.com/app/data-wcvum/endpoint/data/v1/'
const db = 'portfolio_data'
const dataSource = 'Ryebread0'
const collection = 'jumper'



async function callDB(endpoint, data) {
                
    var config = {
        method: 'post',
        url: 'https://us-west-2.aws.data.mongodb-api.com/app/data-wcvum/endpoint/data/v1/action/' + endpoint,
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
            if (endpoint == 'updateOne') console.dir(response.data)
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

module.exports.postScore = async (req, res, next) => {
    try {
        let name = req.body.name
        //console.log('req.session:')
        //console.log(req.session)
        if (!Object.keys(req.session).includes('name')) {
            console.log("here1")
            req.session.name = name 
        }
        //console.log(req.body.score < 50);
        //console.log(isNumeric(req.body.score));
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
            //console.log(data)
            let prev = (await callDB('findOne', JSON.stringify(data))).document
            console.log('prev: ', prev)
            if (prev) {
                console.log('prev is true')
                console.log(prev.score < req.body.score)
                if (prev.score < req.body.score) {
                    console.log("here")
                    // edit existing document
                    data["update"] = { 
                        "$set": {
                            "score": req.body.score,
                            "createdAt": new Moment().format('LLLL')
                        }
                    }
                    console.log(data["update"])
                    result = (await callDB('updateOne', JSON.stringify(data)))
                    console.log(result)
                    dbPosted = true;
                }
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
                        "createdAt": new Moment().format('LLLL')
                    }
                });
                result = (await callDB('insertOne', dataInsert))
                console.log(result)
                dbPosted = true
            }
                        
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