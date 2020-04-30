// Setup canvas 
const canvas = document.getElementById('coolsquare');
const ctx = canvas.getContext('2d');

const testDiv = document.getElementById('test-div');
testDiv.style.width = '300px';
testDiv.style.height = '100px';

// General Constants and Values
const H = 400;
const W = 400;
const TONE_LIM = 40;
const INTERVAL = 5000;
const FADE_TIME = 2000;
const FPS = 10;
let COLOR = getColor(255, 0, 0);

canvas.width = W;
canvas.height = H;

ctx.fillStyle = 'rgb(0,0,0)';
ctx.fillRect(0, 0, 100, 100);

const squares = [
  { x: 0, y: 0, w: 400, h: 200 },
  { x: 0, y: 200, w: 200, h: 200 },
  { x: 200, y: 200, w: 100, h: 100 },
  { x: 300, y: 200, w: 100, h: 100 },
  { x: 200, y: 300, w: 100, h: 100 },
  { x: 300, y: 300, w: 100, h: 100 },
];

// Component functions
function initialize(){
  for(const sq of squares){
    sq.color = getTone(COLOR);
    sq.dColor = getColor(0, 0, 0);
  }

  setTestDiv(COLOR);
}

function render(){
  for(const sq of squares){
    ctx.fillStyle = `rgb(${sq.color.r},${sq.color.g},${sq.color.b})`;
    ctx.fillRect(sq.x, sq.y, sq.w, sq.h);
  }
}

function divideRecursive(square){
}

function changeColor(color){
  setTestDiv(color);

  const deltaTime = 1000 / FPS;
  const frames = FADE_TIME / deltaTime;

  for(const sq of squares){
    const tone = getTone(color);
    sq.dColor.r = (tone.r -sq.color.r) / frames;
    sq.dColor.g = (tone.g -sq.color.g) / frames;
    sq.dColor.b = (tone.b -sq.color.b) / frames;
  }

  let count = 0;

  const si = setInterval(() => {
    if(count >= frames) {
      clearInterval(si);
      return;
    }

    for(const sq of squares){
      sq.color.r += sq.dColor.r;
      sq.color.g += sq.dColor.g;
      sq.color.b += sq.dColor.b;
    }

    count++;
    render();
  }, deltaTime);

  COLOR = color;
}

// Utility functions
function sameColors(color1, color2){
  if(Math.round(color1.r) === Math.round(color2.r) &&
     Math.round(color1.g) === Math.round(color2.g) &&
     Math.round(color1.b) === Math.round(color2.b))
    return true;
  return false;
}

function getColor(r, g, b){
  return { r: r, g: g, b: b };
}

function getRandomColor(){
  return {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255)
  };
}

function getToneComponent(color){
  newColor = color + (Math.floor(Math.random() * TONE_LIM * 2) - TONE_LIM)
  if(newColor < 0) newColor = 0;
  if(newColor > 255) newColor = 255;
  return newColor;
}

function getTone(color){
  return { 
    r: getToneComponent(color.r),
    g: getToneComponent(color.g),
    b: getToneComponent(color.b)
  };
}

function setTestDiv(color){
  testDiv.style.background = 
    `rgb(${color.r}, ${color.g}, ${color.b})`;
}

// Executing
initialize();
for(const square of squares) divideRecursive(square);
render();
//setTimeout(() => changeColor(getColor(0, 0, 255)), INTERVAL);
setInterval(() => changeColor(getRandomColor()), INTERVAL);
