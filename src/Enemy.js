import { Projectile } from './Projectile.js';

export class Enemy {
    constructor(game, x, y, image) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.image = image;
        this.width = 50; // Set a fixed size or base it on image
        this.height = 50;
        this.speedX = 2; // Horizontal movement speed
        this.markedForDeletion = false;

        // Shooting
        this.shootTimer = 0;
        this.shootInterval = Math.random() * 2000 + 1000; // Shoot between 1s and 3s
    }

    update(deltaTime) {
        this.x += this.speedX;
        // Basic movement logic: bounce off walls
        // (In a real Space Invaders, they move down, but for now simple bouncing is good for testing)
        if (this.x + this.width > this.game.width || this.x < 0) {
            this.speedX *= -1;
            this.y += this.height; // Move down when hitting edge
        }

        // Shooting logic
        if (this.shootTimer > this.shootInterval) {
            this.shoot();
            this.shootTimer = 0;
        } else {
            this.shootTimer += deltaTime;
        }
    }

    shoot() {
        // -8 speed means up, so 8 means down (if Projectile defaults to up, we need to pass negative speed or modify Projectile logic). 
        // Wait, Projectile: this.y -= this.speed;
        // So positive speed goes UP. Negative speed goes DOWN.
        // I want it to go down, so speed = -6.
        this.game.projectiles.push(new Projectile(this.game, this.x + this.width / 2, this.y + this.height, -6, '#f00'));
    }

    draw(ctx) {
        if (this.image && this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Fallback if image not loaded yet
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
