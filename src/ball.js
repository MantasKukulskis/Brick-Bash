export class Ball {
  constructor(canvas) {
    this.radius = 8;
    this.x = canvas.width / 2;
    this.y = canvas.height - 60;
    this.speed = 4;
    this.dx = this.speed;
    this.dy = -this.speed;
    this.canvas = canvas;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    // Atšokimas nuo sienų
    if (this.x - this.radius < 0 || this.x + this.radius > this.canvas.width) {
      this.dx *= -1;
    }
    if (this.y - this.radius < 0) {
      this.dy *= -1;
    }
  }

  bounce() {
    this.dy *= -1;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#f00';
    ctx.fill();
    ctx.closePath();
  }

  reset() {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 60;
    this.dx = this.speed;
    this.dy = -this.speed;
  }
}