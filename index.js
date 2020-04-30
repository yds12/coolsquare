const canvas = document.getElementById('coolsquare');
const ctx = canvas.getContext('2d');

const H = 400;
const W = 400;

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

function render(){
  for(sq of squares){
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    //ctx.fillRect(...square);
    ctx.fillRect(sq.x, sq.y, sq.w, sq.h);
  }
}

for(const square of squares) divideRecursive(square);

render();
