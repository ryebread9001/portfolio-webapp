/* TODO:
	--Today's high scores table-- (we need to post date of score)
	--Invincible mode on token collect--
	--Enemy art--
	--Move curr score?--
*/

var x;
var y;
var xSpeed;
var ySpeed;
var mass;
var accel;
var finalScore = [];
var scrollSpeed = 1;
const wid = 600;
const hei = 350;
const jetSpeed = 0.6;
const maxSizeEnemy = 27;
const ponySize = 32;
const cloverSize = 23;
const trailSize = 25;
const enemyStartNum = 3;
const tokenStartNum = 2;
const highScores = document.getElementById("high-scores");
const weeklyHighScores = document.getElementById("week-scores");
var keyPressed = false;
let baseURL = window.location.href == "https://ryanryanryan.net/breakroom" ? "https://ryanryanryan.net/" : "http://localhost:3000/";



function sendScore(score) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', baseURL + 'jumper-score', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		// do something to response
		console.log(this.responseText);
	};
	xhr.send(`score=${score}`);
}

function getScore() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', baseURL + 'jumper-score', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		let spl = this.responseText.split("&");
		createTable(spl[0]);
		createWeeklyTable(spl[1]);
	};
	xhr.send();
}

function createTable(scores) {
	if (document.getElementById("high") != null) document.getElementById("high").remove();
	let table = document.createElement("table");
	let thead = document.createElement("thead");
    let tr = document.createElement("tr");
	let nameh = document.createElement("th");
    nameh.innerText = "Name";
    tr.appendChild(nameh);
	let scoreh = document.createElement("th");
    scoreh.innerText = "Score";
    tr.appendChild(scoreh);
	table.append(tr);
	let data = JSON.parse(scores);
	data = Object.entries(data).sort((a,b)=>b[1]-a[1]); // descending
	let count = 0;
	for (const item of data) {
		if (count > 15) break;
		let tr = document.createElement("tr");
		let td1 = document.createElement("td");
		td1.innerText = item[0];
		let td2 = document.createElement("td");
		td2.innerText = item[1];
		tr.appendChild(td1);
		tr.appendChild(td2);
		if (count < 3) {
			tr.classList.add(`place${count+1}`);
		}

		table.appendChild(tr); // Append the table row to the table
		count++;
	}
	table.id = "high";
	highScores.appendChild(table);
}

function createWeeklyTable(scores) {
	if (document.getElementById("week") != null) document.getElementById("week").remove();
	let table = document.createElement("table");
	let thead = document.createElement("thead");
    let tr = document.createElement("tr");
	let nameh = document.createElement("th");
    nameh.innerText = "Name";
    tr.appendChild(nameh);
	let scoreh = document.createElement("th");
    scoreh.innerText = "Score";
    tr.appendChild(scoreh);
	table.append(tr);
	let data = JSON.parse(scores);
	data = Object.entries(data).sort((a,b)=>b[1].score-a[1].score); // descending
	let count = 0;
	for (const item of data) {
		if (count > 15) break;
		let tr = document.createElement("tr");
		let td1 = document.createElement("td");
		td1.innerText = item[0];
		let td2 = document.createElement("td");
		td2.innerText = item[1].score;
		tr.appendChild(td1);
		tr.appendChild(td2);
		if (count < 3) {
			tr.classList.add(`week-high${count+1}`);
		}

		table.appendChild(tr); // Append the table row to the table
		count++;
	}
	table.id = "week";
	weeklyHighScores.appendChild(table);
}

// getScore();

const startText = document.getElementById("menu1");
const scoreText = document.getElementById("score-text");


const canvas = document.createElement('canvas');

canvas.id = "canvas1";
const score = document.createElement('p');
canvas.width = 600;
canvas.height = 350;

var img = document.getElementById("backg");

const pony = document.getElementById("pony");
pony.width = ponySize;
pony.height = ponySize;

const clover = document.getElementById("token");
clover.width = cloverSize;
clover.height = cloverSize;

const trail = document.getElementById("trail");
trail.width = trailSize;
trail.height = trailSize;


document.body.appendChild(canvas);

const context = canvas.getContext('2d');
context.fillStyle = 'white';
context.fillRect(0, 0, canvas.width, canvas.height);
context.strokeStyle = 'rgb(255, 204, 0)';
context.lineWidth = 3;

let checkX;
let checkY;
let wallheight = 0;

var particle = function(x,y,color,xSpeed,ySpeed) {
	this.x = x;
	this.y = y;
	this.color = color;
	this.xSpeed = xSpeed;
	this.ySpeed = ySpeed;
	this.alpha = 1;

	this.update = function() {

		if (this.y > hei - 2) {
            this.ySpeed = 0
            this.y = hei + 2;
	    }
		if (this.y < 0) {
            this.ySpeed = 0;
            this.y = hei + 2;
	    }
		this.alpha -= 0.01;
		

		this.y += this.ySpeed;
		this.x += this.xSpeed;
		context.save();
		context.beginPath();
		context.arc(this.x, this.y, 2, 0, 2 * Math.PI);
		context.globalAlpha = this.alpha;
		context.fillStyle = this.color || "white";
		context.fill();
		context.restore();
	}

	this.spawn = function(x,y) {
		this.y = y;
		this.x = x;
	}
}

var rainbow = function(x,y,size,xSpeed,ySpeed) {
	this.x = x;
	this.y = y;
	this.size = trailSize;
	this.xSpeed = xSpeed;
	this.ySpeed = ySpeed;
	this.alpha = 1;

	this.update = function() {

		if (this.y > hei - 2) {
            this.ySpeed = 0
            this.y = hei + 2;
	    }
		if (this.y < 0) {
            this.ySpeed = 0;
            this.y = hei + 2;
	    }
		this.alpha -= 0.025;
		this.size -= 0.5;
		this.x -= scrollSpeed;

		this.y += this.ySpeed + getRandomNegPos(0.25);
		this.x += this.xSpeed + getRandomNegPos(0.25);
		context.save();
		context.globalAlpha = this.alpha;
		context.drawImage(trail, this.x, this.y, this.size, this.size);
		context.restore();
	}

	this.spawn = function(x,y) {
		this.y = y;
		this.x = x;
	}
}

var player = function(x,y,mass,ySpeed,isFlipped,accel) {
	this.x = x;
	this.y = y;
	this.mass = mass;
	this.ySpeed = ySpeed;
	this.isFlipped = isFlipped;
	this.accel = accel;
	this.health = 0;
	this.score = 0;
  
	this.update = function() {
		this.ySpeed += this.accel;
		this.y += this.ySpeed;
    
		if (this.y > hei - this.mass) {
            this.ySpeed *= -0.5;
            this.y = hei - this.mass;
	    }
		if (this.y < 0) {
            this.ySpeed *= -0.1;
            this.y = 0;
	    }
		context.fillStyle = 'black';
		//context.fillRect(this.x, this.y, this.mass, this.mass);
		context.drawImage(pony, this.x, this.y, this.mass, this.mass);

		if (keyPressed) {
			
			//context.drawImage(trail, this.x-this.mass/2, this.y+this.mass*2/3, trailSize, trailSize);
		} 
	}
	this.reset = function() {
		this.score = 0;
		this.y = hei/2;
		this.ySpeed = 0;
	}
}

function getRandomInt(min,max) {
    return Math.floor((Math.random()*max)+min);
}

function getRandomNegPos(max) {
	var num = Math.random()*max + 1; // this will get a number between 1 and max;
	num *= Math.round(Math.random()) ? 1 : -1;
	return num;

}

var token = function(x,y,speed,angle) {
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.angle = angle;
    this.size = cloverSize;

	this.update = function() {
		this.x -= this.speed;
		this.y += this.angle;
		
        context.fillStyle = 'black';
        
        context.fillStyle = 'gold';
		//context.fillRect(this.x, this.y, this.size, this.size);
		context.drawImage(clover, this.x, this.y, this.size, this.size);
		if (this.y < 0 || this.y > hei - this.size) {
			this.angle *= -1;
		}
	}
  
	this.reset = function() {
		this.x += 1500;
	}
}

var enemy = function(x,y,speed,size,angle) {
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.size = size;
	this.angle = angle;
	this.alpha = 1;
	this.offset = 2;
	this.update = function() {
		this.x -= this.speed;
		this.y += this.angle;
		context.fillStyle = 'red';
		context.fillRect(this.x,this.y,this.size,this.size);

        context.fillStyle = 'red';
		context.save();
		context.globalAlpha = this.alpha - 0.4;
		context.fillRect(this.x,this.y-this.angle*this.offset,this.size9,this.size);
		context.globalAlpha = this.alpha - 0.6;
		context.fillRect(this.x,this.y-this.angle*this.offset*2,this.size,this.size);
		context.globalAlpha = this.alpha - 0.8;
		context.fillRect(this.x,this.y-this.angle*this.offset*4,this.size,this.size);
		context.globalAlpha = this.alpha - 0.95;
		context.fillRect(this.x,this.y-this.angle*this.offset*8,this.size,this.size);
		context.restore();
        
		if (this.y < 0 || this.y > hei-this.size) {
			this.angle *= -1;
		}
	}
	this.reset = function() {
		this.x += 1500;
	}
}

var tokens = [];
for (var w = 0; w <	tokenStartNum; w++) {
	tokens[w] = new token(getRandomInt(1000,2000),getRandomInt(50,hei-50), getRandomInt(4,5), getRandomInt(2,3));
}

var enemies = [];
for (var i = 0; i <	enemyStartNum; i++) {
    enemies[i] = new enemy(getRandomInt(1000,2000),getRandomInt(50,hei-50), getRandomInt(2,4), getRandomInt(20,maxSizeEnemy), getRandomInt(1,2));
}

var particles = [];
var rainbows = [];


let player1 = new player(wid/4,hei/2,ponySize,0,false,0.26);
let imgx1 = 0;
let imgx2 = imgx1+600;

document.body.onload = function() {
    function gameLoop() {
        drawGame();
        window.requestAnimationFrame(gameLoop);
    }
    window.requestAnimationFrame(gameLoop);
};

function drawGame() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	

    if (keyPressed) {
    	player1.ySpeed -= jetSpeed;
		if(Math.random() > 0.5) rainbows.push(new rainbow(player1.x-player1.mass/2,player1.y+player1.mass*2/3, trailSize, Math.random()/10-1, Math.random()/4));
    }
    if (player1.health > 0) {
		if (player1.score == 0) scoreText.innerText = "0";
		//console.log(player1.health);
		context.fillStyle = 'grey';
        context.fillRect(0, 0, canvas.width, canvas.height);
		context.drawImage(img, imgx1, 0, 600, 350);
		context.drawImage(img, imgx2, 0, 600, 350);
		if (imgx1 <= -600) imgx1 += 1200;
		if (imgx2 <= -600) imgx2 += 1200;
		imgx1-=scrollSpeed;
		imgx2-=scrollSpeed;
        context.fillStyle = 'white';
		for (var t = 0; t < enemies.length; t++) {
			if (enemies[t].x < -maxSizeEnemy) {
				enemies[t].reset();
			}
		}


		for (var j = 0; j < tokens.length; j++) {
			if (tokens[j].x < -maxSizeEnemy) {
				tokens[j].reset();
			}
		}
		
		player1.update();
		checkX = player1.x-6;
		checkY = player1.y-7;
		
		for (var q = 0; q < particles.length; q++) {
			particles[q].update();
			if (particles[q].alpha <= 0.05) particles.splice(q, 1);
		}
		for (var q = 0; q < rainbows.length; q++) {
			rainbows[q].update();
			if (rainbows[q].alpha <= 0.05) rainbows.splice(q, 1);
		}
		for (var i = 0; i < enemies.length; i++) {
			enemies[i].update();

			if (enemies[i].x > ((wid/4)-enemies[i].size)
				&& enemies[i].x < ((wid/4)+player1.mass)
				&& enemies[i].y > (player1.y-enemies[i].size)
				&& enemies[i].y < (player1.y+player1.mass)) {
					scoreText.innerText = player1.score;
					// sendScore(player1.score);
					// getScore();
					player1.health -= 1;
                    enemies[i].reset();
					reset();
                    console.log(`Collision HEALTH: ${player1.health}`);
			}
		}
		for (var t = 0; t < tokens.length; t++) {
			tokens[t].update();
			if (tokens[t].x > ((wid/4)-tokens[t].size)
                && tokens[t].x < ((wid/4)+player1.mass)
                && tokens[t].y > (player1.y-tokens[t].size)
                && tokens[t].y < (player1.y+player1.mass)) {
					scrollSpeed += 0.25;
					player1.score += 1;
					if (player1.score > 0) scoreText.innerText = player1.score;
					if (player1.score % 4 == 0) enemies.push(new enemy(getRandomInt(1000,2000),getRandomInt(50,hei-50), getRandomInt(2+scrollSpeed,3+scrollSpeed), getRandomInt(15,maxSizeEnemy), getRandomInt(1,2)));
                    
					for (var q = 0; q <	12; q++) {
						
						particles[q] = new particle(tokens[t].x,tokens[t].y, 'white', getRandomNegPos(1), getRandomNegPos(1));
						
					}
					tokens[t].reset();
                    console.log(`Collision SCORE: ${player1.score}`);
                    console.log(`NUMBER OF ENEMIES: ${enemies.length}`);
			}
		}
	} else {
		renderMenu();
	}
}

function renderMenu() {
	context.fillStyle = 'grey';
    context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(img, 0, 0, 600, 350);
}

function reset() {
	scrollSpeed = 1;
	startText.style = "display:";
	//scoreText.innerText = "0";
	imgx1 = 0;
	imgx2 = imgx1+600;
	tokens = tokens.slice(tokens.length - tokenStartNum);
	enemies = enemies.slice(enemies.length - enemyStartNum);
	for (var t = 0; t < tokens.length; t++) {
		tokens[t].reset();
	}
	for (var i = 0; i < enemies.length; i++) {
		enemies[i].speed = getRandomInt(2,4);
		enemies[i].reset();
	}
	player1.reset();

}



function setScore() {
	console.log("setscore");
					/* finalScore.push(player1.score);
					finalScores = JSON.stringify(finalScore);
					localStorage.setItem("scoreList", finalScores);
					var scoreListParsed = JSON.parse(localStorage.getItem("scoreList"));
					document.getElementById("scoreListGrabbed").innerHTML = scoreListParsed; */          
};

document.addEventListener('keydown', function(event) {

/*
left = 37
up = 38
right = 39
down = 40
*/
  //keyPressed = true;
  let keyCode = event.keyCode;
  if (player1.health < 1) {
	player1.health++;
	startText.style = "display:none";
  }
  if ((keyCode === 49 || keyCode === 38)) {
  	keyPressed = true;
  }
});

window.onkeyup = function(e) { 
	keyPressed = false;
}
