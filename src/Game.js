import { Player } from './Player.js';
import { InputHandler } from './InputHandler.js';
import { Enemy } from './Enemy.js';
import { KamikazeEnemy } from './KamikazeEnemy.js';
import { TitanEnemy } from './TitanEnemy.js';
import { SwarmerEnemy } from './SwarmerEnemy.js';
import { PowerUp } from './PowerUp.js';
import { Particle } from './Particle.js';

import { Background } from './Background.js';
import { SoundController } from './SoundController.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.input = new InputHandler();
        this.sound = new SoundController();
        this.player = new Player(this);

        this.background = new Background(this);
        this.projectiles = [];
        this.enemies = [];
        this.projectiles = [];
        this.enemies = [];
        this.particles = [];
        this.powerUps = [];

        this.gameState = 'START'; // START, PLAYING, GAMEOVER, PAUSED
        this.openingImage = new Image();
        this.openingImage.src = 'assets/opening_bg.jpg';

        this.level = 3;
        this.score = 0;
        this.lives = 3;

        this.levelTime = 120000; // 2 minutes
        this.levelTimer = this.levelTime;

        this.enemyTimer = 0;
        this.enemyInterval = 1000;
        this.enemyTimer = 0;
        this.enemyInterval = 1000;

        this.powerUpTimer = 0;
        this.powerUpInterval = 30000; // Spawn power up every 30 seconds (approx)

        this.gameOverTimer = 0;

        // UI Elements
        this.levelDisplay = document.getElementById('levelDisplay');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.livesDisplay = document.getElementById('livesDisplay');
        this.timerDisplay = document.getElementById('timerDisplay');

        this.enemyImages = [];
        for (let i = 1; i <= 5; i++) {
            const img = new Image();
            img.src = `assets/enemy${i}.png`;
            this.enemyImages.push(img);
        }
        this.hud = document.getElementById('hud');
        this.hud.style.display = 'none'; // Hide HUD initially
        this.uiLayer = document.getElementById('ui-layer'); // Get UI Layer
        this.topMargin = 0; // Height of the HUD to avoid overlap
    }

    start(level = 1) {
        this.level = level;
        this.gameState = 'PLAYING';
        this.hud.style.display = 'flex'; // Show HUD
        this.restart();
        this.updateHUD();
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
        this.hud.style.display = 'none'; // Hide HUD
        this.restart();
    }

    updateHUD() {
        this.levelDisplay.innerText = `LEVEL: ${this.level}`;
        this.scoreDisplay.innerText = `SCORE: ${this.score}`;
        this.livesDisplay.innerText = `LIVES: ${'❤'.repeat(Math.max(0, this.lives))}`;
        const totalSeconds = Math.ceil(this.levelTimer / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        this.timerDisplay.innerText = `TIME: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    addScore(points) {
        this.score += points;
        this.updateHUD();
    }

    update(deltaTime) {
        this.background.update(deltaTime);
        if (this.gameState === 'START') {
            return;
        }

        if (this.gameState === 'LEVEL_COMPLETE') {
            if (this.input.keys.includes('Enter')) {
                this.level++;
                this.restart();
                this.gameState = 'PLAYING';
            }
            return;
        }

        if (this.gameState === 'PAUSED') {
            return;
        }

        if (this.gameState === 'GAMEOVER') {
            // Handled by UI overlay in main.js
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
                e.update(deltaTime);
                // Check collision with player
                if (this.checkCollision(this.player, e)) {
                    e.markedForDeletion = true;
                    this.createExplosion(e.x + e.width / 2, e.y + e.height / 2);
                    this.lives--;
                    this.sound.loseLife();
                    this.updateHUD();
                    if (this.lives <= 0) {
                        this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 20);
                        this.gameState = 'GAMEOVER';
                        this.sound.gameOver();
                        this.gameOverTimer = 0;
                    }
                }
            });

            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }

            // PowerUps
            if (this.level >= 2) {
                if (this.powerUpTimer > this.powerUpInterval) {
                    this.addPowerUp();
                    this.powerUpTimer = 0;
                } else {
                    this.powerUpTimer += deltaTime;
                }
            }
        }

        this.powerUps = this.powerUps.filter(p => !p.markedForDeletion);
        this.powerUps.forEach(p => {
            p.update();
            // Collision with player
            if (this.checkCollision(this.player, p)) {
                p.markedForDeletion = true;
                this.sound.powerUp();
                this.lives++;
                this.updateHUD();
            }
        });

        // Particles
        this.particles = this.particles.filter(p => !p.markedForDeletion);
        this.particles.forEach(p => p.update());

        // Collisions
        this.projectiles.forEach(projectile => {
            if (projectile.markedForDeletion) return;

            // Player Projectiles (Speed > 0, moving UP)
            if (projectile.speed > 0) {
                this.enemies.forEach(enemy => {
                    if (!enemy.markedForDeletion && this.checkCollision(projectile, enemy)) {
                        enemy.hit(1);
                        projectile.markedForDeletion = true;
                        if (enemy.markedForDeletion) {
                            if (enemy instanceof TitanEnemy) {
                                this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 100, false);
                                this.sound.titanExplosion();
                            } else {
                                this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                            }
                            this.addScore(enemy.scoreValue || 100);
                        } else {
                            // Small spark for hit but not dead
                            this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 3);
                        }
                    }
                });
            }
            // Enemy Projectiles (Speed < 0, moving DOWN)
            else {
                if (this.checkCollision(projectile, this.player)) {
                    projectile.markedForDeletion = true;
                    this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 5);
                    this.lives--;
                    this.sound.loseLife();
                    this.updateHUD();
                    if (this.lives <= 0) {
                        this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 20);
                        this.gameState = 'GAMEOVER';
                        this.sound.gameOver();
                        this.gameOverTimer = 0;
                    }
                }
            }
        });

        // Level Timer
        this.levelTimer -= deltaTime;
        this.updateHUD(); // Update timer every frame
        if (this.levelTimer <= 0) {
            this.gameState = 'LEVEL_COMPLETE';
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
        } else if (this.gameState === 'PLAYING' || this.gameState === 'GAMEOVER' || this.gameState === 'PAUSED' || this.gameState === 'LEVEL_COMPLETE') {
            this.player.draw(this.ctx);
            this.projectiles.forEach(p => p.draw(this.ctx));
            this.enemies.forEach(e => e.draw(this.ctx));
            this.particles.forEach(p => p.draw(this.ctx));
            this.powerUps.forEach(p => p.draw(this.ctx));

            if (this.gameState === 'GAMEOVER') {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(0, 0, this.width, this.height);
                // Text handled by UI overlay
            }

            if (this.gameState === 'LEVEL_COMPLETE') {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(0, 0, this.width, this.height);
                this.ctx.fillStyle = 'yellow';
                this.ctx.font = '50px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('LEVEL COMPLETE', this.width / 2, this.height / 2);
                this.ctx.fillStyle = 'white';
                this.ctx.font = '20px Arial';
                this.ctx.fillText('Press Enter to Continue', this.width / 2, this.height / 2 + 50);
            }
        }
    }

    addEnemy() {
        const width = 50;
        let x = Math.random() * (this.width - width);
        let attempts = 0;
        let overlap = false;

        // Try to find a non-overlapping position
        do {
            overlap = false;
            x = Math.random() * (this.width - width);
            // Simple check against all existing enemies
            for (const enemy of this.enemies) {
                if (x < enemy.x + enemy.width && x + width > enemy.x &&
                    this.topMargin < enemy.y + enemy.height && this.topMargin + 50 > enemy.y) {
                    overlap = true;
                    break;
                }
            }
            attempts++;
        } while (overlap && attempts < 10);

        if (!overlap) {
            const image = this.enemyImages[Math.floor(Math.random() * this.enemyImages.length)];

            if (this.level >= 3) {
                const rand = Math.random();
                if (rand < 0.2) {
                    this.enemies.push(new TitanEnemy(this, x, this.topMargin, image));
                    this.sound.titanSpawn();
                } else if (rand < 0.5) {
                    this.enemies.push(new SwarmerEnemy(this, x, this.topMargin, image));
                } else if (rand < 0.8) {
                    this.enemies.push(new KamikazeEnemy(this, x, this.topMargin, image));
                } else {
                    this.enemies.push(new Enemy(this, x, this.topMargin, image));
                }
            }
            // Level 2: Chance to spawn Kamikaze
            else if (this.level >= 2 && Math.random() < 0.6) {
                this.enemies.push(new KamikazeEnemy(this, x, this.topMargin, image));
            } else {
                this.enemies.push(new Enemy(this, x, this.topMargin, image));
            }
        }
    }

    addPowerUp() {
        const x = Math.random() * (this.width - 30);
        this.powerUps.push(new PowerUp(this, x, -30));
    }

    checkCollision(rect1, rect2) {
        return (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y);
    }

    createExplosion(x, y, count = 10, playSound = true) {
        if (playSound) {
            this.sound.explosion();
        }
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
        this.powerUps = [];
        this.enemyTimer = 0;
        this.score = 0;
        // this.level is preserved
        this.lives = 3;
        this.levelTimer = this.levelTime;

        // Level Configuration
        if (this.level >= 2) {
            this.player.shootInterval = 240; // 20% slower (200 * 1.2)
        } else {
            this.player.shootInterval = 200; // Reset for Level 1 (if restarting game)
        }

        this.updateHUD();
    }
}
