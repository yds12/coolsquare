const canvas = document.getElementById('coolsquare');
const ctx = canvas.getContext('2d');

const H = 400;
const W = 400;
const TONE_LIM = 40;
const COLOR = {
  r: Math.floor(Math.random() * 255),
  g: Math.floor(Math.random() * 255),
  b: Math.floor(Math.random() * 255)
};

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

function divideRecursive(square){
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

function render(){
  for(sq of squares){
    const color = getTone(COLOR);

    ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    ctx.fillRect(sq.x, sq.y, sq.w, sq.h);
  }
}

for(const square of squares) divideRecursive(square);

render();
