
export class Background {
    constructor(game) {
        this.game = game;
        this.width = this.game.width;
        this.height = this.game.height;
        this.stars = [];
        this.starCount = 100;

        for (let i = 0; i < this.starCount; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 2 + 0.5,
                color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`,
                velocity: Math.random() * 2 + 0.5
            });
        }
    }

    update(deltaTime) {
        this.stars.forEach(star => {
            star.y += star.velocity;
            if (star.y > this.height) {
                star.y = 0 - star.radius;
                star.x = Math.random() * this.width;
            }
        });
    }

    draw(ctx) {
        ctx.save();
        this.stars.forEach(star => {
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }
}
