let baseURL = window.location.href.includes("https://ryanryanryan.net/") ? "https://ryanryanryan.net/" : "http://localhost:3000/";
const posterUrl = 'https://image.tmdb.org/t/p/w185/';
const moviesDiv = document.getElementById("movies-div");
const popup = document.getElementById("popup");
let results = document.getElementById('results-popup');
let finalScore = document.getElementById('final-score');
let scoreboard = document.getElementById("scoreboard");
let cardContainer = document.getElementById("card-container");
var spots = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{}, 8:{}, 9:{}};
var actors = {};
var meanPop = 0;
var attempts = 0;
const maxAttempts = 10;
var guesses = [];
var guess = (numCorrect) => {
    return "🟨".repeat(3-numCorrect) + "🟩".repeat(numCorrect);
}
let score = 0;

document.getElementById("share-button").addEventListener("click", ()=>{
    // var copyText = document.getElementById("share-text");

    // copyText.select();
    // copyText.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(guesses.join("\n"));//copyText.value);

    alert("Copied to clipboard");
})


function getMovies() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', baseURL + 'movies-data', true);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.onload = function () {
        fillMovieRows(JSON.parse(this.responseText))
	};
	xhr.send();
}

async function getActor(id) {
    try {
        let response = await fetch(baseURL + 'actor-data?id=' + id, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Accept": 'application/json',
        }})
        return await response.json();
    } catch(err) {
        console.log("Error fetching actor data: " + err);
        return -1;
    }
}

function fillActorPopup(container, data) {
    if (data.biography.length > 0) {
        container.innerText = data.biography;
    } else {
        container.innerText = "Could not load " + data.name + "'s " + "biography.";
    }
}
function fillResultPopup(card, cardImg, data) {
    var bodyDiv = document.createElement("div");
    bodyDiv.classList.add("card-body");
    card.appendChild(bodyDiv);
    card.appendChild(cardImg);
    var cardText = document.createElement("p");
    cardText.classList.add("card-text");
    bodyDiv.appendChild(cardText);
    let movieTitles = data.name;
    cardText.innerText = movieTitles;    
}

function getRandomInt(min,max) {
    return Math.floor((Math.random()*max)+min);
}

function createRandomOrder() {
    let numsAvailable = [1,2,3,4,5,6,7,8,9]
    let result = []
    while (result.length < 9) {
        let num = getRandomInt(1,9);
        if (!result.includes(num)) {
            result.push(num);
            numsAvailable.splice(numsAvailable.indexOf(num), 1);
        }
    }
    return result;
}

function checkForMatch(movieSpots) {
    let name = spots[movieSpots[0]].name
    let match = true;
    movieSpots.forEach((movieSpot)=> {
        if (spots[movieSpot].name != name) match = false; 
    })
    return match;
}

function numMatching(movieSpots) {
    let match1 = movieSpots.filter((movieSpot)=> {
        return spots[movieSpots[0]].name == spots[movieSpot].name;
    }).length;
    let match2 = movieSpots.filter((movieSpot)=> {
        return spots[movieSpots[1]].name == spots[movieSpot].name;
    }).length;
    return (match1 > match2) ? match1 : match2;
}

async function movieClickHandler(e) {
    let mov = this;
    if (mov.classList.contains('movie-selected')) {
        mov.classList.remove('movie-selected');
    } else {
        mov.classList.add('movie-selected');
    }

    let allClicked = document.querySelectorAll(".movie-selected");
    if (allClicked.length > 2) {
        
        let movieSpots = [];
        for (var i = 0; i < 3; i++) {
            let spotId = allClicked[i].id;
            movieSpots.push(spotId.substring(spotId.length-1));
        }
        let numMatched = numMatching(movieSpots);
        guesses.push(guess(numMatched));
        if (numMatched == 3) {
            score++;
            if (document.querySelector("#popup-image")) document.querySelector("#popup-image").remove();
            if (popup.querySelector("#actor-name").innerText != "") popup.querySelector("#actor-name").innerText == "";
            var popupImage = document.createElement("img");
            popupImage.src = posterUrl + spots[movieSpots[0]].profile_path;
            let popupImageClone = popupImage.cloneNode(false);
            popupImageClone.classList.add("card-img-top");
            popupImageClone.classList.add("card-img-small");
            popupImage.id = "popup-image";
            popup.querySelector("#image-container").appendChild(popupImage);
            popup.hidden = false;
            popup.querySelector("#actor-name").innerText = spots[movieSpots[0]].name;

            let data = actors[spots[movieSpots[0]].name];
            fillActorPopup(popup.querySelector("#actor-overview"), data);
            cardContainer.querySelector(`div[name=\"${data.name}\"]`)
            
            document.body.addEventListener("click", (e)=>{
                if (e.target == popup) {
                    popup.hidden = true;
                    if (document.querySelectorAll('.movie-card').length < 1) {
                        results.hidden = false;
                        finalScore.innerText = score + "/3";
                        //document.getElementById("share-text").value += guesses.join("\n");
                    }
                }
            })
            allClicked.forEach((clk)=>{
                clk.classList.remove("movie-selected");
                clk.classList.add("matched");
                clk.remove();
                clk.removeEventListener("click", movieClickHandler)
            })
        } else {
            attempts++;
            scoreboard.removeChild(scoreboard.lastChild);
            if (numMatched == 2) {
                let ht = document.getElementById("hintText");
                ht.hidden = false;
                ht.classList.add("flash-incorrect");
                setTimeout(function() {
                    ht.classList.remove("flash-incorrect");
                    ht.hidden = true;
                }, 1000);
            }
            if (attempts >= maxAttempts) {
                Array.from(document.getElementById("card-container").children).forEach((card)=>{
                    if (card.children.length == 0) {
                        card.remove();
                    }   
                })
                results.hidden = false;
                finalScore.innerText = score + "/3";
            }
            allClicked.forEach((clk)=>{
                clk.classList.remove("movie-selected");
                
                clk.classList.add("flash-incorrect");
                setTimeout(function() {
                    clk.classList.remove("flash-incorrect");
                }, 1000);
                
            })
        }
    }
}

function initScoreboard() {
    let heart = scoreboard.children[0];
    heart.fill = "red";
    heart.style = "margin:4px;"
    for (let i = 0; i < maxAttempts - 1; i++) {
        let newHeart = heart.cloneNode(true);
        scoreboard.appendChild(newHeart);
    }
}


async function fillMovieRows(data) {
    
    let order = createRandomOrder();
    let mostPop = 0;
    for (let i = 0; i < 9; i++) {
        spots[order[i]] = data[i];
        if (!actors[data[i].name]) {
            let actorData = await getActor(data[i].actor_id);
            actors[data[i].name] = actorData;
        }
        meanPop += data[i].popularity;
        if (data[i].popularity > mostPop) mostPop = data[i].popularity;
        var img = document.createElement("img");
        img.src = posterUrl + data[i].poster_path;
        let maxHeight = window.innerHeight/5;
        img.classList.add("card-img-top");
        img.style.height = `${maxHeight}px`;
        img.style.width = `${maxHeight*0.675}px`;
        let imgContainer = moviesDiv.querySelector("#spot-"+(order[i]));
        imgContainer.addEventListener("click", movieClickHandler);
        imgContainer.appendChild(img);
        var bodyDiv = document.createElement("div");
        bodyDiv.classList.add("card-body");
        imgContainer.appendChild(bodyDiv);
        var cardText = document.createElement("p");
        cardText.classList.add("card-text");
        let year = data[i].release_date ? data[i].release_date.substring(0,4) : "";
        let title = data[i].original_title ? data[i].original_title.substring(0,12) : "";
        cardText.innerText = title + "\n" + year;
        bodyDiv.appendChild(cardText);

        
        
    }

    for (const [name, data] of Object.entries(actors)) {
        let card = cardContainer.querySelector(".empty-card")
        card.name = name;
        var popupImage = document.createElement("img");
        popupImage.src = posterUrl + data.profile_path;
        fillResultPopup(card, popupImage, data);
        card.classList.remove("empty-card");
    }
    
    meanPop /= 9;

    
    
    //attempts = Math.floor((mostPop - Math.floor(meanPop))/10);
}

initScoreboard();
getMovies();