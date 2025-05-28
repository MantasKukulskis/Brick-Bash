import { Paddle } from './paddle.js';
import { Ball } from './ball.js';
import { Brick } from './brick.js';
import { detectCollision } from './utils.js';
import { showMessage } from './main.js';

let canvas, ctx;
export let paddle, ball;
let bricks;
let gameState = 'start';

const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const offsetTop = 30;
const offsetLeft = 35;

let isDragging = false;
let dragOffsetX = 0;

export function initGame(container) {
  canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  container.innerHTML = '';
  container.appendChild(canvas);
  ctx = canvas.getContext('2d');

  paddle = new Paddle(canvas);
  ball = new Ball(canvas);
  bricks = createBricks();
  gameState = 'start';

  // Drag start
  canvas.addEventListener('mousedown', (e) => {
    if (gameState !== 'start') return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (
      mouseX >= paddle.x &&
      mouseX <= paddle.x + paddle.width &&
      mouseY >= paddle.y &&
      mouseY <= paddle.y + paddle.height
    ) {
      isDragging = true;
      dragOffsetX = mouseX - paddle.x;
    }
  });

  // Drag move
  canvas.addEventListener('mousemove', (e) => {
    if (gameState === 'start' && isDragging) {
      const rect = canvas.getBoundingClientRect();
      let mouseX = e.clientX - rect.left;
      let newX = mouseX - dragOffsetX;

      if (newX < 0) newX = 0;
      if (newX + paddle.width > canvas.width) newX = canvas.width - paddle.width;

      paddle.x = newX;

      // Kamuoliukas laikosi ant paddle
      ball.x = paddle.x + paddle.width / 2;
      ball.y = paddle.y - ball.radius;

      drawStartScreen();
    } else if (gameState === 'start' || gameState === 'running') {
      // Jei nedominuoja drag, paddle juda pagal pelės padėtį
      if (isDragging) return; // jeigu drag vyksta - ignoruojam šį bloką

      const rect = canvas.getBoundingClientRect();
      let mouseX = e.clientX - rect.left;
      if (mouseX < paddle.width / 2) mouseX = paddle.width / 2;
      if (mouseX > canvas.width - paddle.width / 2) mouseX = canvas.width - paddle.width / 2;
      paddle.x = mouseX - paddle.width / 2;

      if (gameState === 'start') {
        ball.x = paddle.x + paddle.width / 2;
        ball.y = paddle.y - ball.radius;
      }
    }
  });

  // Drag end
  canvas.addEventListener('mouseup', () => {
    if (gameState !== 'start') return;
    isDragging = false;
  });

  canvas.addEventListener('mouseleave', () => {
    if (gameState !== 'start') return;
    isDragging = false;
  });

  document.addEventListener('keydown', (e) => {
    if (gameState !== 'running') return;

    if (e.key === 'ArrowLeft') paddle.moveLeft();
    if (e.key === 'ArrowRight') paddle.moveRight();
  });

  document.addEventListener('keyup', (e) => {
    if (gameState !== 'running') return;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      paddle.stop();
    }
  });

  canvas.addEventListener('click', () => {
    if (gameState === 'start') {
      setGameState('running');
      gameLoop();
    }
  });

  drawStartScreen();
}

function createBricks() {
  const bricks = [];
  for (let row = 0; row < brickRowCount; row++) {
    for (let col = 0; col < brickColumnCount; col++) {
      const x = col * (brickWidth + brickPadding) + offsetLeft;
      const y = row * (brickHeight + brickPadding) + offsetTop;
      bricks.push(new Brick(x, y, brickWidth, brickHeight));
    }
  }
  return bricks;
}

function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paddle.draw(ctx);
  ball.draw(ctx);
  bricks.forEach((brick) => brick.draw(ctx));

  ctx.fillStyle = 'white';
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Drag paddle to desired start position', canvas.width / 2, 270);
  ctx.fillText('& release mouse button to star a game', canvas.width / 2, 300);
}

export function setGameState(state) {
  gameState = state;
}

export function gameLoop() {
  if (gameState !== 'running') {
    drawStartScreen();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  paddle.update();
  ball.update();

  if (detectCollision(ball, paddle)) {
    ball.bounce();
    ball.y = paddle.y - ball.radius;
  }

  bricks.forEach((brick) => {
    if (!brick.broken && detectCollision(ball, brick)) {
      ball.bounce();
      brick.broken = true;
    }
  });

  paddle.draw(ctx);
  ball.draw(ctx);
  bricks.forEach((brick) => brick.draw(ctx));

  if (bricks.every((brick) => brick.broken)) {
    showMessage('🎉 You Win!');
    setGameState('ended');
    return;
  }

  if (ball.y - ball.radius > canvas.height) {
    showMessage('💀 Game Over');
    setGameState('ended');
    return;
  }

  requestAnimationFrame(gameLoop);
}