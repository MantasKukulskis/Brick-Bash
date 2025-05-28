export class Brick {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.broken = false;
  }

  draw(ctx) {
    if (!this.broken) {
      ctx.fillStyle = '#ffa500';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}