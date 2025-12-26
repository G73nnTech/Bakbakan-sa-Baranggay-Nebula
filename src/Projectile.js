export class Projectile {
    constructor(game, x, y, speed = 8, color = '#ff0') {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 15;
        this.speed = speed;
        this.color = color;
        this.markedForDeletion = false;
    }

    update() {
        this.y -= this.speed;
        if (this.y < 0 - this.height || this.y > this.game.height) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
    }
}
