const Moment = require('moment')
var axios = require('axios');
var sanitizer = require('sanitize')();

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
            // console.dir(response.data)
            obj = response.data
        })
        .catch(function (error) {
            console.log(error)
            obj = error
        });

    return obj
}


module.exports.postScore = async (req, res, next) => {
    try {
        console.log('req.session:')
        console.log(req.session)
        if (!req.session.name) {
            var name = sanitizer.value(req.body.name, 'string');
            req.session.name = name;
        }
        if (req.body.score < 50 && !isNaN(req.body.score)) {
            let result;
            var dbPosted = false;
            var data = {
                "collection": collection,
                "database": db,
                "dataSource": dataSource,
                "filter": {"name": req.body.name}
            };
            console.log(data)
            let prev = (await callDB('findOne', JSON.stringify(data))).document
            console.log(prev)
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
                        "name": req.body.name,
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