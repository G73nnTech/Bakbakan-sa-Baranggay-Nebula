import { Projectile } from './Projectile.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 64;
        this.height = 64;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height - this.height - 20;
        this.speed = 5;
        this.image = new Image();
        this.image.src = 'assets/player.png';

        this.shootTimer = 0;
        this.shootInterval = 200; // ms
    }

    update(deltaTime) {
        // Movement
        if (this.game.input.keys.includes('ArrowLeft')) this.x -= this.speed;
        if (this.game.input.keys.includes('ArrowRight')) this.x += this.speed;

        // Boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // Shooting
        if (this.shootTimer > 0) this.shootTimer -= deltaTime;
        if (this.game.input.keys.includes(' ') && this.shootTimer <= 0) {
            this.game.projectiles.push(new Projectile(this.game, this.x + this.width / 2, this.y));
            this.shootTimer = this.shootInterval;
        }
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Fallback
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
