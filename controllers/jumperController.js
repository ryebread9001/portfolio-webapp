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
            console.log(JSON.stringify(response.data))
            console.dir(response.data)
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
        var dbPosted = false;
        var data = {
            "collection": collection,
            "database": db,
            "dataSource": dataSource,
            "filter": {"name": req.body.name}
        };
        let prev = await callDB('findOne', JSON.stringify(data)).document
        if (prev) {
            if (prev.document.score < req.body.score) {
                // edit existing document
                data["update"] = { 
                    "$set": {
                        "score": req.body.score,
                        "createdAt": { "$date": { "$numberLong": new moment().unix() }}
                    }
                }
                await callDB('updateOne', JSON.stringify(data))
                dbPosted = true;
            }
        } else {
            // create new document for user
            var dataInsert = JSON.stringify({
                "collection": collection,
                "database": db,
                "dataSource": dataSource,
                "document": {
                    "name": req.body.name,
                    "score": req.body.score,
                    "createdAt": { "$date": { "$numberLong": new moment().unix() }}
                }
            });
            await callDB('insertOne', dataInsert)
            dbPosted = true
        }
                    
        res.send(`score of ${req.body.score} posted: ${dbPosted}`)
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
        console.log(result)
        console.log("??????")
        res.send(result)
    } catch (err) {
        next(err)
    };
}