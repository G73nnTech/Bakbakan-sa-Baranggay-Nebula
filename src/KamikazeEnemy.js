import { Enemy } from './Enemy.js';

export class KamikazeEnemy extends Enemy {
    constructor(game, x, y, image) {
        super(game, x, y, image);
        this.speedY = 0;
        this.angle = 0;
        this.diveSpeed = 6; // Fast dive speed
        this.isDiving = false;

        // Randomly decide when to dive
        this.diveTimer = 0;
        this.diveInterval = Math.random() * 3000 + 1000;

        // Visual distinction (optional, handled by Game.js passing a specific image or can tint here)
    }

    update(deltaTime) {
        if (!this.isDiving) {
            super.update(deltaTime);

            // Check if it's time to dive
            if (this.diveTimer > this.diveInterval) {
                this.startDive();
            } else {
                this.diveTimer += deltaTime;
            }
        } else {
            // Diving logic
            this.y += this.diveSpeed;
            this.x += this.speedX; // Continue horizontal momentum or lock it? Let's keep a bit.

            // Check if off screen
            if (this.y > this.game.height) {
                this.resetPosition();
            }
        }
    }

    startDive() {
        this.isDiving = true;
        this.speedX = (Math.random() - 0.5) * 4; // Add some random horizontal drift while diving

        // Aim broadly towards player (optional, for now just dive down)
    }

    resetPosition() {
        this.isDiving = false;
        this.y = -this.height; // Reset to top
        this.x = Math.random() * (this.game.width - this.width);
        this.speedX = Math.random() > 0.5 ? 2 : -2; // Reset horizontal speed
        this.diveTimer = 0;
        this.diveInterval = Math.random() * 3000 + 2000;
    }
}
