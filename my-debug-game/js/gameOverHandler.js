const GAME_OVER_MESSAGES = [
    {
        message: "Skill issue? Try again!",
        sound: "skill-issue.mp3"
    },
    {
        message: "Your gaming chair needs an upgrade!",
        sound: "gaming-chair.mp3"
    },
    {
        message: "Touch grass... after one more try!",
        sound: "touch-grass.mp3"
    },
    {
        message: "Not even close baby!",
        sound: "technoblade.mp3"
    },
    {
        message: "Git gud... or get rekt!",
        sound: "git-gud.mp3"
    },
    {
        message: "Rage quit loading...",
        sound: "rage-quit.mp3"
    }
];

class GameOverHandler {
    constructor() {
        this.messages = GAME_OVER_MESSAGES;
    }

    showGameOver(score) {
        const message = this.getRandomMessage();
        
        const gameOverScreen = document.createElement('div');
        gameOverScreen.className = 'game-over-screen';
        gameOverScreen.innerHTML = `
            <div class="game-over-content">
                <h1>GAME OVER</h1>
                <h2>Score: ${score}</h2>
                <p class="meme-text">${message.message}</p>
                <button class="retro-button" onclick="location.reload()">Try Again</button>
            </div>
        `;
        
        document.body.appendChild(gameOverScreen);
        audioManager.playGameOverSound();

        setTimeout(() => {
            gameOverScreen.classList.add('visible');
        }, 100);
    }

    getRandomMessage() {
        return this.messages[Math.floor(Math.random() * this.messages.length)];
    }

    hideGameOver() {
        const gameOverScreen = document.querySelector('.game-over-screen');
        if (gameOverScreen) {
            gameOverScreen.remove();
        }
    }
}