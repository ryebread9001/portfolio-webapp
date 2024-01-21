const canvas = document.createElement("canvas");
canvas.style.border = 'none';
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';

canvas.style.position = 'absolute';
canvas.style.zIndex = '2';
canvas.style.pointerEvents = 'none';
canvas.id = "imgCanvas";
document.body.appendChild(canvas);
var context = canvas.getContext("2d");
var mouseX;
var mouseY;
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
canvas.width = document.body.clientWidth; // window.innerWidth;
canvas.height = document.body.clientHeight; // window.innerHeight;
window.onresize = () => {
    canvas.width = document.body.clientWidth; // window.innerWidth;
    canvas.height = document.body.clientHeight; // window.innerHeight;
}
const yOffSet = 0;

class Vector{
  /**
   * Initializes a new vector.
   * @param {Number|vector} x Initial value of x (can be number or vector).
   * @param {Number|null} y Initial value of y.
   */
  constructor(x, y){
      if(x instanceof Vector){
          this.x = x.x;
          this.y = x.y
      }else{
          this.x = x;
          this.y = y;
      }
  }

  /**
   * Adds to vector by given vector.
   * @param {vector} vector Vector values to add to original.
   * @returns The vector.
   */
  AddVector(vector){this.x+=vector.x;this.y+=vector.y;return this;}
  
  /**
   * Adds to vector by given amount.
   * @param {Number} amount Amount to add to original.
   * @returns The vector.
   */
  Add(amount){this.x+=amount;this.y+=amount;return this;}
  
  /**
   * Subtracts vector by given vector.
   * @param {vector} vector Vector to subtract to original.
   * @returns The vector.
   */
  SubtractVector(vector){this.x-=vector.x;this.y-=vector.y;return this;}
  
  /**
   * Subtracts vector by given amount.
   * @param {Number} amount amount to subtracts from original.
   * @returns The vector.
   */
  Subtract(amount){this.x-=amount;this.y-=amount;return this;}
  
  /**
   * Multiplies vector by given vector.
   * @param {vector} vector Vector to Multiply vector by.
   * @returns The vector.
   */
  MultiplyVector(vector){this.x*=vector.x;this.y*=vector.y;return this;}
  
  /**
   * Multiplies vector by given scalar.
   * @param {Number} scalar Scalar to Multiply vector by.
   * @returns The vector.
   */
  Multiply(scalar){this.x*=scalar;this.y*=scalar;return this;}
  
  /**
   * Divides vector by given vector.
   * @param {vector} vector Vector to divide vector by.
   * @returns The vector.
   */
  DivideVector(vector){this.x/=vector.x;this.y/=vector.y;return this;}
  
  /**
   * Divides vector by given scalar.
   * @param {Number} scalar Scalar to divide vector by.
   * @returns The vector.
   */
  Divide(scalar){this.x/=scalar;this.y/=scalar;return this;}
}

function bubble(x, y, xSpeed, ySpeed, size, color) {
	this.x = x;
  this.y = y;
  this.xSpeed = xSpeed;
  this.ySpeed = ySpeed;
  this.size = size;
  this.color = color;

  this.update = function() {
  	if (this.y < 0+this.size/2) {
      this.ySpeed *= -1;
    }
    if (this.y > window.innerHeight-this.size/2) {
      this.ySpeed *= -1;
    }
    if (this.x < 0+this.size/2) {
      this.xSpeed *= -1;
    }
    if (this.x > window.innerWidth-this.size/2) {
      this.xSpeed *= -1;
    }
  	this.x+=this.xSpeed;
    this.y+=this.ySpeed;


    context.strokeStyle = this.color;
    context.globalAlpha = 1;
    drawCircle(context, this.x, this.y, this.size);
    context.globalAlpha = 0.6;
    drawCircle(context, this.x, this.y, this.size*0.9);
    context.globalAlpha = 0.3;
    drawCircle(context, this.x, this.y, this.size*0.8);
    context.globalAlpha = 0.1;
    drawCircle(context, this.x, this.y, this.size*0.7);
    context.globalAlpha = 1;
  }
}


function createImageOnCanvas(imageId) {
  //canvas.style.display = "block";
  //document.getElementById("images").style.overflowY = "hidden";
  //var img = new Image(300, 300);
  //img.src = document.getElementById(imageId).src;
  //context.drawImage(img, (0), (0)); //onload....
}

const bubbleCount = 10;
bubbles = [];
for (var i = 0; i < bubbleCount; i++) {
  let random = Math.floor(Math.random() * colors.length);
	let bub = new bubble(getRandomInt(70,window.innerWidth-70),getRandomInt(70,window.innerHeight-70), getRandomNegPos(1), getRandomNegPos(1), getRandomInt(25,40), colors[random]);
  bubbles.push(bub);
  // if (i > 0) {
  //   if (circleCollision(bubbles[i-1].x, bubbles[i-1].y, bubbles[i-1].size, bubbles[i].x, bubbles[i].y, bubbles[i].size)) {
  //     bubbles.pop();
  //   }
  // }
}


function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  mouseX = evt.clientX;
  mouseY = evt.clientY;
}

function click(evt) {
	for (var i = 0; i < bubbles.length; i++) {
		if (circleCollision(mouseX, mouseY+yOffSet, 1, bubbles[i].x, bubbles[i].y, bubbles[i].size) && bubbles[i].size > 1) {
      let x = bubbles[i].x+(getRandomNegPos(1)*bubbles[i].size/3);
      let y = bubbles[i].y+(getRandomNegPos(1)*bubbles[i].size/3);
      let xSpeed = bubbles[i].xSpeed;
      let ySpeed = bubbles[i].ySpeed;
      let size = bubbles[i].size/2;
      let color = bubbles[i].color;
      bubbles.splice(i, 1); 
      let xOffSet = (getRandomInt((size/3)+1,size+1) * xSpeed);
      let yOffSet = (getRandomInt((size/3)+1,size+1) * ySpeed);
      let bub1 = new bubble(x + xOffSet, y + yOffSet, getRandomNegPos(2), getRandomNegPos(2), size, color);
      let bub2 = new bubble(x - xOffSet, y - yOffSet, getRandomNegPos(2), getRandomNegPos(2), size, color);
      
      bubbles.push(bub1);
      bubbles.push(bub2);
			
		}
	}
}

function draw(e) {
	context.clearRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < bubbles.length; i++) {
    
  	for (var j = 0; j < bubbles.length; j++) {
    	if (j != i) {
      	if (circleCollision(bubbles[j].x, bubbles[j].y, bubbles[j].size, bubbles[i].x, bubbles[i].y, bubbles[i].size)) {

          let firstBall = bubbles[j];
          let secondBall = bubbles[i];
          
          newVelX1 = (firstBall.xSpeed * (firstBall.size - secondBall.size) + (2 * secondBall.size * secondBall.xSpeed)) / (firstBall.size + secondBall.size);
          newVelY1 = (firstBall.ySpeed * (firstBall.size - secondBall.size) + (2 * secondBall.size * secondBall.ySpeed)) / (firstBall.size + secondBall.size);
          newVelX2 = (secondBall.xSpeed * (secondBall.size - firstBall.size) + (2 * firstBall.size * firstBall.xSpeed)) / (firstBall.size + secondBall.size);
          newVelY2 = (secondBall.ySpeed * (secondBall.size - firstBall.size) + (2 * firstBall.size * firstBall.ySpeed)) / (firstBall.size + secondBall.size);

          bubbles[j].xSpeed = newVelX1;
          bubbles[j].ySpeed = newVelY1;
          bubbles[i].xSpeed = newVelX2;
          bubbles[i].ySpeed = newVelY2;

        }
      }
    }

		bubbles[i].update();
    if (bubbles[i].size < 1) bubbles.splice(i, 1);
    // if (bubbles.length < 10) {
    //   for (var i = 0; i < 10; i++) {
    //     let random = Math.floor(Math.random() * colors.length);
    //     let bub = new bubble(getRandomInt(70,window.innerWidth-70),getRandomInt(70,window.innerHeight-70), getRandomNegPos(1), getRandomNegPos(1), getRandomInt(15,30), colors[random]);
    //     bubbles.push(bub);
    //     // if (i > 0) {
    //     //   if (circleCollision(bubbles[i-1].x, bubbles[i-1].y, bubbles[i-1].size, bubbles[i].x, bubbles[i].y, bubbles[i].size)) {
    //     //     bubbles.pop();
    //     //   }
    //     // }
    //   }
    // } 
	}

  context.fillStyle = "#000000";
  context.fillRect(mouseX, mouseY+yOffSet, 1, 1);
}

document.body.onload = function() {
    let bubblesCheck = document.getElementById("bubbles-check");

    bubblesCheck.addEventListener('click', ()=>{
        localStorage.setItem('bubbles', bubblesCheck.checked); 
        gameLoop()
    });
    if (!bubblesCheck.checked && localStorage.getItem('bubbles') == 'true') {
        bubblesCheck.checked = true;
    }
    if (bubblesCheck.checked && localStorage.getItem('bubbles') == 'false') {
        bubblesCheck.checked = false;
    }

    let frames = 0;
    let msPrev = window.performance.now();
    const fps = 60;
    const msPerFrame = 1000 / fps;	
    function gameLoop() {
        window.addEventListener('mousemove', getMousePos, false);
            window.addEventListener('click', click, false);
        if (bubblesCheck.checked) {
            draw();
            window.requestAnimationFrame(gameLoop);
            frames++;
            const msNow = window.performance.now();
            const msPassed = msNow - msPrev;
            if (msPassed < msPerFrame) return;
            const excessTime = msPassed % msPerFrame;
            msPrev = msNow - excessTime;
        } else {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    window.requestAnimationFrame(gameLoop);
};



function getRandomInt(min,max) {
    return Math.floor((Math.random()*max)+min);
}

function getRandomNegPos(max) {
	var num = Math.random()*max + 1; // this will get a number between 1 and max;
	num *= Math.round(Math.random()) ? 1 : -1;
	return num;

}

function drawCircle(ctx, cx, cy, rad) {
	ctx.beginPath();
  //ctx.fillRect(cx,cy,2,2);
  ctx.arc(cx, cy, rad, 0, 2 * Math.PI);
  ctx.stroke();

}



function circleCollision(p1x, p1y, r1, p2x, p2y, r2) {
  var a;
  var x;
  var y;

  a = r1 + r2;
  x = p1x - p2x;
  y = p1y - p2y;

  if ((Math.sqrt((x * x) + (y * y))) < a) {
    return true;
  } else {
    return false;
  }
}

function circleDistance(p1x, p1y, r1, p2x, p2y, r2) {
  var x;
  var y;
  x = p1x - p2x;
  y = p1y - p2y;
  return Math.sqrt((x * x) + (y * y))
}