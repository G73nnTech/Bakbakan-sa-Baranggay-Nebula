export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];

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

        // Mobile Button Listeners
        const btnLeft = document.getElementById('btnLeft');
        const btnRight = document.getElementById('btnRight');

        const addKey = (key) => {
            if (this.keys.indexOf(key) === -1) this.keys.push(key);
        };
        const removeKey = (key) => {
            const index = this.keys.indexOf(key);
            if (index > -1) this.keys.splice(index, 1);
        };

        const handleMobilePress = (direction) => {
            // Add direction key
            addKey(direction);
            // Add shoot key (Auto-shoot)
            addKey(' ');
        };

        const handleMobileRelease = (direction) => {
            removeKey(direction);
            // Only stop shooting if NO move keys are pressed
            if (this.keys.indexOf('ArrowLeft') === -1 && this.keys.indexOf('ArrowRight') === -1) {
                removeKey(' ');
            }
        };

        if (btnLeft && btnRight) {
            // Touch Events (prevent default to stop scrolling/selection)
            btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); handleMobilePress('ArrowLeft'); });
            btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); handleMobileRelease('ArrowLeft'); });

            btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); handleMobilePress('ArrowRight'); });
            btnRight.addEventListener('touchend', (e) => { e.preventDefault(); handleMobileRelease('ArrowRight'); });

            // Mouse Events (for testing on desktop if needed)
            btnLeft.addEventListener('mousedown', (e) => { handleMobilePress('ArrowLeft'); });
            btnLeft.addEventListener('mouseup', (e) => { handleMobileRelease('ArrowLeft'); });

            btnRight.addEventListener('mousedown', (e) => { handleMobilePress('ArrowRight'); });
            btnRight.addEventListener('mouseup', (e) => { handleMobileRelease('ArrowRight'); });
        }
    }
}
