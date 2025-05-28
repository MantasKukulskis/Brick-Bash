export class Ball {
  constructor(canvas, speed = 4, radius = 10) {
    this.canvas = canvas;
    this.radius = radius;
    this.reset(speed);
  }

  reset(speed) {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 60;
    this.speed = speed;
    this.dx = speed;
    this.dy = -speed;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
  }

  bounce() {
    this.dy = -this.dy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  }
}