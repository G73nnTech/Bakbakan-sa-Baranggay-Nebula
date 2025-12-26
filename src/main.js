import { Game } from './Game.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = 800;
    canvas.height = 600;

    const game = new Game(canvas);
    window.game = game;

    // UI Elements
    const level1Btn = document.getElementById('level1Btn');
    const level2Btn = document.getElementById('level2Btn');
    const level3Btn = document.getElementById('level3Btn');
    const resumeBtn = document.getElementById('resumeBtn');
    const exitBtn = document.getElementById('exitBtn');
    const goResumeBtn = document.getElementById('goResumeBtn');
    const goExitBtn = document.getElementById('goExitBtn');
    const uiLayer = document.getElementById('ui-layer');
    const pauseMenu = document.getElementById('pause-menu');
    const gameOverMenu = document.getElementById('game-over-menu');

    // Start Game - Level Selection
    function startGame(level) {
        game.start(level);
        uiLayer.style.display = 'none';
        gameOverMenu.style.display = 'none';
    }

    level1Btn.addEventListener('click', () => startGame(1));
    level2Btn.addEventListener('click', () => startGame(2));
    level3Btn.addEventListener('click', () => startGame(3));

    // Center Tap (Pause) functionality
    window.addEventListener('click', (e) => {
        // Prevent pausing when clicking buttons
        // Prevent pausing when clicking buttons or inside mobile controls
        if (e.target.tagName === 'BUTTON' || e.target.closest('#mobile-controls')) return;

        if (game.gameState === 'PLAYING') {
            game.pause();
            pauseMenu.style.display = 'flex';
        }
    });

    // Pause Menu - Resume
    resumeBtn.addEventListener('click', () => {
        if (game.gameState === 'PAUSED') {
            game.pause(); // Toggles back to PLAYING
            pauseMenu.style.display = 'none';
        }
    });

    // Pause Menu - Exit
    exitBtn.addEventListener('click', () => {
        game.exit();
        pauseMenu.style.display = 'none';
        uiLayer.style.display = 'flex';
    });

    // Game Over - Resume (Restart Level)
    goResumeBtn.addEventListener('click', () => {
        game.restart();
        game.gameState = 'PLAYING';
        gameOverMenu.style.display = 'none';
    });

    // Game Over - Exit
    goExitBtn.addEventListener('click', () => {
        game.exit();
        gameOverMenu.style.display = 'none';
        uiLayer.style.display = 'flex';
    });

    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        game.update(deltaTime);
        game.draw();

        if (game.gameState === 'GAMEOVER') {
            // Show Game Over UI if not already shown
            if (gameOverMenu.style.display === 'none') {
                gameOverMenu.style.display = 'flex';
            }
        }

        requestAnimationFrame(animate);
    }
    animate(0);
});
