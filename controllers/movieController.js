var axios = require('axios');
const baseUrl = 'https://api.themoviedb.org/3/'; //trending/movie/day?language=en-US';


async function makeReq(endpoint) {
    var config = {
        method: 'get',
        url: baseUrl + endpoint,
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Y2QxYzk0ZTJjYzNkYTM5MWM3YzczYzkyZWNiNGY2NCIsInN1YiI6IjY1ZDY2NzgwNjA5NzUwMDE4NTIzZjY3OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MwN4hse7hGCQQ9s6Oy_dNYdsspKeiPQSWKwCXvIUV08'
        }
    };
    
    let obj;
    await axios(config)
        .then(function (response) {
            //console.dir(response.data)
            obj = response.data
        })
        .catch(function (error) {
            console.log(error)
            obj = error
        });
    return obj
}

function getRandomInt(min,max) {
    return Math.floor((Math.random()*max)+min);
}

// module.exports.postMovieData = async (req, res, next) => {
//     try {
//         res.send(`nice try...`)
//     } catch (err) {
//         next(err)
//     };
// }

async function randomActorMovies() {
    let randPage = getRandomInt(1,500);
    let randPerson = getRandomInt(0,19);
    let movies = (await makeReq('/person/popular?language=en-US&page='+randPage)).results;
    let actor = movies[randPerson]
    let maxI = 19;
    let i = 0;
    while (actor.known_for.find((movie)=>{return isBlacklist(movie)})) {
        console.log("not happening");
        actor = movies[getRandomInt(0,19)];
        i++;
        if (i >= maxI) {
            return undefined;
        }
    }
    //console.dir(movies);
    console.log("GOT ACTOR");
    return actor;
}

let badWords = ["sex", "virgin", "porn", "mature"];

function isBlacklist(movie) {

    if (movie.adult || movie.media_type == 'tv' || movie.original_language != 'en') return true;
    let bad = false;
    if (!movie.title || !movie.overview) return true;
    badWords.forEach((word) => {
        if (movie.title.includes(word)) { 
            bad = true;
        }
        if (movie.overview.includes(word)) { 
            bad = true;
        }
    })
    return bad;
}

module.exports.getMovieData = async (req, res, next) => {
    try {
        let people = [];
        for (let j = 0; j < 3; j++) {
            let actor = await randomActorMovies();
            //console.log(actor);
            if (!actor) actor = await randomActorMovies();
            
            for (let i = 0; i < 3; i++) {
                actor.known_for[i]["name"] = actor.name;
                actor.known_for[i]["profile_path"] = actor.profile_path;
                actor.known_for[i]["actor_id"] = actor.id;
                if (actor.known_for[i]) people.push(actor.known_for[i]);
            }
        }
        //console.log(people);
        res.send(people);
    } catch (err) {
        console.log(err);
        next(err)
    };
}

module.exports.getActorData = async (req, res, next) => {
    try {
        let person = await(makeReq('person/'+req.query["id"]+'?language=en-US'));
        //console.log(people);
        res.send(person);
    } catch (err) {
        console.log(err);
        next(err)
    };
}