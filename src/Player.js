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

        this.speedY = 0;
        this.maxSpeed = 5;

        // Health / Visuals
        this.markedForDeletion = false;
        this.lives = 3;

        this.shootTimer = 0;
        this.shootInterval = 200; // ms
    }

    update(deltaTime) {
        // Movement Logic
        if (this.game.input.keys.includes('ArrowLeft')) this.speedX = -this.maxSpeed;
        else if (this.game.input.keys.includes('ArrowRight')) this.speedX = this.maxSpeed;
        else this.speedX = 0;

        this.x += this.speedX;

        // Boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // Shooting
        if (this.shootTimer > 0) this.shootTimer -= deltaTime;

        // Touch or Keyboard Shooting
        if ((this.game.input.keys.includes(' ') || this.game.input.isTouching) && this.shootTimer <= 0) {
            this.game.projectiles.push(new Projectile(this.game, this.x + this.width / 2, this.y));
            this.game.sound.shoot();
            this.shootTimer = this.shootInterval;
        }

        // Touch Movement Override
        if (this.game.input.isTouching) {
            // "Follow Finger" logic
            // We want the CENTER of the player to align with touchX
            const targetX = this.game.input.touchX - this.width / 2;
            const dx = targetX - this.x;

            // Move towards target
            if (Math.abs(dx) > 5) { // Deadzone to stop jitter
                if (dx > 0) this.speedX = this.maxSpeed;
                else this.speedX = -this.maxSpeed;
            } else {
                this.speedX = 0;
                this.x = targetX; // Snap if close enough
            }
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
