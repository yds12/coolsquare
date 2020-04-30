// Setup canvas and DOM elements
const canvas = document.getElementById('coolsquare');
const ctx = canvas.getContext('2d');

const testDiv = document.getElementById('test-div');
testDiv.style.width = '300px';
testDiv.style.height = '10px';

// General Constants and Values
const W = 25*16;
const H = 25*16;
const MAX_TILE = 25*8;
const MIN_TILE = 25;
const DIVISION_PROB = 0.3;
const PREFER_INSIDE = false;
const MAIN_IMAGE_RECT = {
  x: 0,
  y: 0,
  w: MAX_TILE,
  h: MAX_TILE
};
const MAIN_IMAGE_ALPHA = 0.8;
let CUR_ALPHA = MAIN_IMAGE_ALPHA;

const TONE_LIM = 40;
const INTERVAL = 4000;
const FADE_TIME = 1000;
const FPS = 8;

canvas.width = W;
canvas.height = H;

const imagesSrc = ['img/0ad.png', 'img/bombas.png'];
const images = [];
const colors = [getRandomColor(), getRandomColor()]; 
let CURRENT;
let PREV;
let squares;

// Component functions
function initialize(){
  loadImages();
}

function loadImages(){
  const loaded = [];

  for(let i = 0; i < imagesSrc.length; i++){
    const image = new Image();
    image.src = imagesSrc[i];
    images.push(image);
    loaded.push(false);
    image.onload = ()=>{
      loaded[i] = true;
      if(loaded.findIndex(el => (!el)) === -1) setupComponent();
    };
  }
}

function setupComponent(){
  if(W % MIN_TILE !== 0 || H % MIN_TILE !== 0 || MAX_TILE % MIN_TILE !== 0){
    throw Error('Component width and height and maximum tile size \
      have to be a multiple of the minimum tile size!');
  }
  if(MAIN_IMAGE_RECT.w % MIN_TILE !== 0 || MAIN_IMAGE_RECT.w % MIN_TILE !== 0){
    throw Error('Main image width and height have to be a multiple of \
      the minimum tile size!');
  }

  CURRENT = 0;
  squares = [{ x: 0, y: 0, w: W, h: H}];
  divideRecursive(squares[0]);
  squares = squares.filter(sq => !sq.remove);
  placeMainImage();

  for(const sq of squares){
    sq.color = getTone(colors[CURRENT]);
    sq.dColor = getColor(0, 0, 0);
  }
  render();

  setTestDiv(colors[CURRENT]);
  setInterval(() => next(), INTERVAL);
  //setTimeout(() => changeColor(getColor(0, 0, 255)), INTERVAL);
  //setInterval(() => changeColor(getRandomColor()), INTERVAL);
}

function placeMainImage(){
  let suitable = [];

  if(PREFER_INSIDE){
    suitable = squares.filter(sq => 
      sq.w === MAIN_IMAGE_RECT.w && sq.h === MAIN_IMAGE_RECT.h &&
      sq.x > 0 && sq.y > 0 && sq.x + sq.w < W && sq.y + sq.h < H);
  }

  if(suitable.length === 0){
    suitable = squares.filter(
      sq => sq.w === MAIN_IMAGE_RECT.w && sq.h === MAIN_IMAGE_RECT.h);
  }

  if(suitable.length > 0){
    sq = suitable[Math.floor(Math.random() * suitable.length)];
    MAIN_IMAGE_RECT.x = sq.x;
    MAIN_IMAGE_RECT.y = sq.y;
  }
}

function render(){
  ctx.clearRect(0, 0, W, H);
  for(const sq of squares){
    ctx.fillStyle = `rgb(${sq.color.r},${sq.color.g},${sq.color.b})`;
    ctx.fillRect(sq.x, sq.y, sq.w, sq.h);
  }

  if(PREV >= 0){ // transition happening
    // fading the previous image
    ctx.globalAlpha = MAIN_IMAGE_ALPHA - CUR_ALPHA;
    ctx.drawImage(images[PREV], MAIN_IMAGE_RECT.x, MAIN_IMAGE_RECT.y,
      MAIN_IMAGE_RECT.w, MAIN_IMAGE_RECT.h);
  }

  ctx.globalAlpha = CUR_ALPHA;
  ctx.drawImage(images[CURRENT], MAIN_IMAGE_RECT.x, MAIN_IMAGE_RECT.y,
    MAIN_IMAGE_RECT.w, MAIN_IMAGE_RECT.h);

  ctx.globalAlpha = 1;
}

function divideRecursive(square){
  if(square.w <= MIN_TILE || square.h <= MIN_TILE) return;
  if(square.w <= MAX_TILE && Math.random() > DIVISION_PROB) return;

  const side = square.w / 2;
  const sq1 = { x: square.x, y: square.y, w: side, h: side };
  const sq2 = { x: square.x + side, y: square.y, w: side, h: side };
  const sq3 = { x: square.x, y: square.y + side, w: side, h: side };
  const sq4 = { x: square.x + side, y: square.y + side, w: side, h: side };
  squares.push(sq1);
  squares.push(sq2);
  squares.push(sq3);
  squares.push(sq4);
  divideRecursive(sq1);
  divideRecursive(sq2);
  divideRecursive(sq3);
  divideRecursive(sq4);
  square.remove = true;
}

function next(){
  PREV = CURRENT;
  CURRENT = (CURRENT + 1) % colors.length;
  changeColor(colors[CURRENT]);
  changeImage(CURRENT);
}

function changeImage(){
  const deltaTime = 1000 / FPS;
  const frames = FADE_TIME / deltaTime;
  const deltaAlpha = MAIN_IMAGE_ALPHA / frames;
  CUR_ALPHA = 0;

  let count = 0;
  const si = setInterval(() => {
    if(count >= frames) {
      clearInterval(si);
      CUR_ALPHA = MAIN_IMAGE_ALPHA;
      PREV = -1;
      return;
    }

    CUR_ALPHA += deltaAlpha;

    count++;
    render();
  }, deltaTime);
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
