export class Paddle {
  constructor(canvas) {
    this.width = 100;
    this.height = 20;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 10;
    this.speed = 7;
    this.dx = 0;
    this.canvas = canvas;
  }

  moveLeft() {
    this.dx = -this.speed;
  }

  moveRight() {
    this.dx = this.speed;
  }

  stop() {
    this.dx = 0;
  }

  update() {
    this.x += this.dx;

    // Ribos
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > this.canvas.width) {
      this.x = this.canvas.width - this.width;
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#0ff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}