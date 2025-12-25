export class Projectile {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 15;
        this.speed = 8;
        this.markedForDeletion = false;
    }

    update() {
        this.y -= this.speed;
        if (this.y < 0 - this.height) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.fillStyle = '#ff0';
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
    }
}
