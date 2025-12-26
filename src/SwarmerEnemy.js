import { Enemy } from './Enemy.js';

export class SwarmerEnemy extends Enemy {
    constructor(game, x, y, image) {
        super(game, x, y, image);
        this.width = 30;
        this.height = 30;
        this.lives = 1;
        this.speedX = 4; // Faster than normal
        this.scoreValue = 200;
        this.shootInterval = Math.random() * 1000 + 500; // Shoots faster too
    }
}
