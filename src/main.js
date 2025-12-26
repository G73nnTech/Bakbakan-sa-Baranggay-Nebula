import { Game } from './Game.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = 800;
    canvas.height = 600;

    const game = new Game(canvas);
    window.game = game;

    // UI Elements
    const startBtn = document.getElementById('startBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const exitBtn = document.getElementById('exitBtn');
    const uiLayer = document.getElementById('ui-layer');
    const pauseMenu = document.getElementById('pause-menu');

    // Start Game
    startBtn.addEventListener('click', () => {
        game.start();
        uiLayer.style.display = 'none';
    });

    // Center Tap (Pause) functionality
    // We attach listener to the canvas container or window to capture taps
    window.addEventListener('click', (e) => {
        // Prevent pausing when clicking buttons
        if (e.target.tagName === 'BUTTON') return;

        if (game.gameState === 'PLAYING') {
            game.pause();
            pauseMenu.style.display = 'flex';
        }
    });

    // Resume Game
    resumeBtn.addEventListener('click', () => {
        if (game.gameState === 'PAUSED') {
            game.pause(); // Toggles back to PLAYING
            pauseMenu.style.display = 'none';
        }
    });

    // Exit Game
    exitBtn.addEventListener('click', () => {
        game.exit();
        pauseMenu.style.display = 'none';
        uiLayer.style.display = 'flex';
    });

    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        game.update(deltaTime);
        game.draw();

        if (game.gameState === 'GAMEOVER') {
            // Optional: Show UI or restart handling here if needed, 
            // but current Game.js handles restart with Enter on GameOver screen.
            // We can keep it simple for now or add a restart button later.
        }

        requestAnimationFrame(animate);
    }
    animate(0);
});
