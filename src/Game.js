import { Player } from './Player.js';
import { InputHandler } from './InputHandler.js';
import { Enemy } from './Enemy.js';
import { Particle } from './Particle.js';

import { Background } from './Background.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.input = new InputHandler();
        this.player = new Player(this);

        this.background = new Background(this);
        this.projectiles = [];
        this.enemies = [];
        this.particles = [];

        this.gameState = 'START'; // START, PLAYING, GAMEOVER
        this.openingImage = new Image();
        this.openingImage.src = 'assets/opening_bg.jpg';

        this.enemyTimer = 0;
        this.enemyInterval = 1000;
        this.gameOverTimer = 0;

        this.enemyImages = [];
        for (let i = 1; i <= 5; i++) {
            const img = new Image();
            img.src = `assets/enemy${i}.png`;
            this.enemyImages.push(img);
        }
    }

    start() {
        this.gameState = 'PLAYING';
        this.restart();
    }

    pause() {
        if (this.gameState === 'PLAYING') {
            this.gameState = 'PAUSED';
        } else if (this.gameState === 'PAUSED') {
            this.gameState = 'PLAYING';
        }
    }

    exit() {
        this.gameState = 'START';
        this.restart();
    }

    update(deltaTime) {
        this.background.update(deltaTime);
        if (this.gameState === 'START') {
            return;
        }

        if (this.gameState === 'PAUSED') {
            return;
        }

        if (this.gameState === 'GAMEOVER') {
            if (this.input.keys.includes('Enter') && this.gameOverTimer > 1000) {
                this.gameState = 'START';
            }
            this.gameOverTimer += deltaTime;
            return;
        }

        if (this.gameState === 'PLAYING') {
            this.player.update(deltaTime);

            // Projectiles
            this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
            this.projectiles.forEach(p => p.update());

            // Enemies
            this.enemies = this.enemies.filter(e => !e.markedForDeletion);
            this.enemies.forEach(e => {
                e.update();
                // Check collision with player
                if (this.checkCollision(this.player, e)) {
                    // Game Over logic
                    this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 20);
                    this.gameState = 'GAMEOVER';
                    this.gameOverTimer = 0;
                }
            });

            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }

            // Particles
            this.particles = this.particles.filter(p => !p.markedForDeletion);
            this.particles.forEach(p => p.update());

            // Collisions Projectiles vs Enemies
            this.projectiles.forEach(projectile => {
                this.enemies.forEach(enemy => {
                    if (!projectile.markedForDeletion && !enemy.markedForDeletion &&
                        this.checkCollision(projectile, enemy)) {
                        enemy.markedForDeletion = true;
                        projectile.markedForDeletion = true;
                        this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                    }
                });
            });
        }
    }

    draw() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.background.draw(this.ctx);

        if (this.gameState === 'START') {
            if (this.openingImage.complete) {
                this.ctx.drawImage(this.openingImage, 0, 0, this.width, this.height);
            }
            // Removed text drawing, handled by UI
        } else if (this.gameState === 'PLAYING' || this.gameState === 'GAMEOVER' || this.gameState === 'PAUSED') {
            this.player.draw(this.ctx);
            this.projectiles.forEach(p => p.draw(this.ctx));
            this.enemies.forEach(e => e.draw(this.ctx));
            this.particles.forEach(p => p.draw(this.ctx));

            if (this.gameState === 'GAMEOVER') {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(0, 0, this.width, this.height);
                this.ctx.fillStyle = 'red';
                this.ctx.font = '50px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2);
                this.ctx.fillStyle = 'white';
                this.ctx.font = '20px Arial';
                this.ctx.fillText('Press Enter to Restart', this.width / 2, this.height / 2 + 50);
            }
        }
    }

    addEnemy() {
        // Spawn enemies in specific pattern or random for now
        const x = Math.random() * (this.width - 50);
        const image = this.enemyImages[Math.floor(Math.random() * this.enemyImages.length)];
        this.enemies.push(new Enemy(this, x, 0, image));
    }

    checkCollision(rect1, rect2) {
        return (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y);
    }

    createExplosion(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(this, x, y));
        }
    }

    restart() {
        this.player.x = this.width * 0.5 - this.player.width * 0.5;
        this.player.y = this.height - this.player.height - 20;
        this.projectiles = [];
        this.enemies = [];
        this.particles = [];
        this.enemyTimer = 0;
    }
}
