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
    }

    update() {
        this.x += this.speedX;
        // Basic movement logic: bounce off walls
        // (In a real Space Invaders, they move down, but for now simple bouncing is good for testing)
        if (this.x + this.width > this.game.width || this.x < 0) {
            this.speedX *= -1;
            this.y += this.height; // Move down when hitting edge
        }
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
