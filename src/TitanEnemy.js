import { Enemy } from './Enemy.js';
import { Projectile } from './Projectile.js';

export class TitanEnemy extends Enemy {
    constructor(game, x, y, image) {
        super(game, x, y, image);
        this.width = 100;
        this.height = 100;
        this.lives = 5;
        this.speedX = 1; // Slower than normal
        this.scoreValue = 500;
    }

    shoot() {
        // Single Plasma Shot
        const startX = this.x + this.width / 2;
        const startY = this.y + this.height;
        const type = 'plasma';
        const color = '#ffaa00'; // Hot Orange
        const speed = -4.5; // 75% of standard speed (-6)

        // Middle shot
        this.game.projectiles.push(new Projectile(this.game, startX, startY, speed, color, type, 0));
    }
}
