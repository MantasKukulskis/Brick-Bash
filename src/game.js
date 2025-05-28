import { Paddle } from './paddle.js';
import { Ball } from './ball.js';
import { Brick } from './brick.js';
import { detectCollision } from './utils.js';
import { levels } from './levels.js';

let canvas, ctx;
export let paddle, ball;
let bricks;
let gameState = 'start';
let currentLevel;

const brickPadding = 10;
const offsetTop = 30;
const offsetLeft = 35;

let isDragging = false;
let dragOffsetX = 0;

export function initGame(container, levelId = 1) {
  canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  container.innerHTML = '';
  container.appendChild(canvas);
  ctx = canvas.getContext('2d');

  currentLevel = levels.find(l => l.id === levelId) || levels[0];

  // Nustatome paddle width pagal level arba default 100
  const paddleWidth = currentLevel.paddleWidth || 100;

  paddle = new Paddle(canvas, paddleWidth);
  ball = new Ball(canvas, currentLevel.ballSpeed, currentLevel.ballRadius);
  bricks = createBricks(currentLevel);
  gameState = 'start';

  // Paddle drag start
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

  // Paddle drag move or follow mouse
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;

    if (isDragging && gameState === 'start') {
      let newX = mouseX - dragOffsetX;
      newX = Math.max(0, Math.min(newX, canvas.width - paddle.width));
      paddle.x = newX;
      ball.x = paddle.x + paddle.width / 2;
      ball.y = paddle.y - ball.radius;
      drawStartScreen();
    } else if ((gameState === 'start' || gameState === 'running') && !isDragging) {
      if (mouseX < paddle.width / 2) mouseX = paddle.width / 2;
      if (mouseX > canvas.width - paddle.width / 2) mouseX = canvas.width - paddle.width / 2;
      paddle.x = mouseX - paddle.width / 2;

      if (gameState === 'start') {
        ball.x = paddle.x + paddle.width / 2;
        ball.y = paddle.y - ball.radius;
      }
    }
  });

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

function createBricks(level) {
  const bricks = [];
  // Pirmiausia apskaičiuojame bendrą padding tarp plytų (columns - 1) * brickPadding
  const totalPadding = (level.columns - 1) * brickPadding;
  // Plytų plotis bus:
  const brickWidth = (canvas.width - offsetLeft * 2 - totalPadding) / level.columns;
  const brickHeight = level.brickHeight; // Galima palikti fiksuotą arba pagal level

  for (let row = 0; row < level.rows; row++) {
    for (let col = 0; col < level.columns; col++) {
      const x = offsetLeft + col * (brickWidth + brickPadding);
      const y = offsetTop + row * (brickHeight + brickPadding);
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
  ctx.fillText('Click anywhere to start the game', canvas.width / 2, 300);
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
    window.showMessage('🎉 You Win!');
    setGameState('ended');
    return;
  }

  if (ball.y - ball.radius > canvas.height) {
    window.showMessage('💀 Game Over');
    setGameState('ended');
    return;
  }

  requestAnimationFrame(gameLoop);
}