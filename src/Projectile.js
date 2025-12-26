export class Projectile {
    constructor(game, x, y, speed = 8, color = '#ff0', type = 'rect', speedX = 0) {
        this.game = game;
        this.type = type;
        this.speed = speed;
        this.speedX = speedX;
        this.color = color;
        this.markedForDeletion = false;

        if (this.type === 'plasma') {
            this.width = 20;
            this.height = 20;
        } else {
            this.width = 4;
            this.height = 15;
        }

        // x passed is Center. Convert to Top-Left for hitbox consistency
        this.x = x - this.width / 2;
        this.y = y;
    }

    update() {
        this.y -= this.speed;
        this.x += this.speedX;
        if (this.y < 0 - this.height || this.y > this.game.height) this.markedForDeletion = true;
    }

    draw(ctx) {
        if (this.type === 'plasma') {
            ctx.save();
            const cx = this.x + this.width / 2;
            const cy = this.y + this.height / 2;
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, this.width / 2);
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(0.4, this.color);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(cx, cy, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
