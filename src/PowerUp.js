export class PowerUp {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speedY = 2; // Falls slowly
        this.markedForDeletion = false;
        this.color = '#0f0'; // Green for health
    }

    update() {
        this.y += this.speedY;
        if (this.y > this.game.height) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;

        // Draw a simple cross/plus shape
        const w = this.width;
        const h = this.height;
        const x = this.x;
        const y = this.y;

        ctx.fillRect(x + w / 3, y, w / 3, h);       // Vertical bar
        ctx.fillRect(x, y + h / 3, w, h / 3);       // Horizontal bar

        // Optional glow
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
    }
}
