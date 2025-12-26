export class InputHandler {
    constructor(game) {
        this.game = game; // Store reference to game
        this.keys = [];
        this.touchX = 0;
        this.touchY = 0;
        this.touchTapped = false; // For menu interactions
        this.isTouching = false;

        window.addEventListener('keydown', e => {
            if ((e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === ' ' || // Space
                e.key === 'Enter')
                && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
        });
        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === ' ' ||
                e.key === 'Enter') {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });

        // Touch Events
        this.game.canvas.addEventListener('touchstart', e => {
            this.isTouching = true;
            this.touchTapped = true; // Register a tap
            const rect = this.game.canvas.getBoundingClientRect();
            const scaleX = this.game.width / rect.width;
            this.touchX = (e.changedTouches[0].clientX - rect.left) * scaleX;
            // Reset tap quickly so it acts like a click for menus if needed
            setTimeout(() => this.touchTapped = false, 200);
        }, { passive: false });

        this.game.canvas.addEventListener('touchmove', e => {
            e.preventDefault(); // Prevent scrolling
            this.isTouching = true;
            const rect = this.game.canvas.getBoundingClientRect();
            const scaleX = this.game.width / rect.width;
            this.touchX = (e.changedTouches[0].clientX - rect.left) * scaleX;
        }, { passive: false });

        this.game.canvas.addEventListener('touchend', e => {
            this.isTouching = false;
        });
    }
}
