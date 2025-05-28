export function detectCollision(ball, obj) {
  return (
    ball.x + ball.radius > obj.x &&
    ball.x - ball.radius < obj.x + obj.width &&
    ball.y + ball.radius > obj.y &&
    ball.y - ball.radius < obj.y + obj.height
  );
}