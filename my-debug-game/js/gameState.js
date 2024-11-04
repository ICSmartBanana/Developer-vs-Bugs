class GameState {
    constructor() {
        this.reset();
        this.loadHighScore();
        this.loadHistory();
        this.effectManager = null;
        this.gameOverHandler = new GameOverHandler();
        this.theme = 'retro'; // default theme
    }

    gameOver() {
        this.isGameRunning = false;
        this.saveGameHistory();
        this.gameOverHandler.showGameOver(this.score);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
            document.getElementById('highScoreValue').textContent = this.highScore;
        }
        powerUpManager.clearAllPowerups();
    }

    setEffectManager(effectManager) {
        this.effectManager = effectManager;
    }

    reset() {
        this.ammo = CONFIG.AMMO_CAPACITY;
        this.isReloading = false;
        this.activeWeapons = new Set();
        this.score = 0;
        this.powerupsCollected = 0;
        this.isGameRunning = false;
        this.updateAmmoDisplay(); // Update display on reset
        this.updateScore(0);
        this.hideGameOver();
    }

    hideGameOver() {
        const gameOverScreen = document.querySelector('div[name="game-over-screen"]');
        if (gameOverScreen) {
            gameOverScreen.style.display = 'none';
        } else {
            console.log('Game over screen element not found.');
        }
    }

    reload() {
        if (!this.isReloading) {
            this.isReloading = true;
            document.getElementById('reloadIndicator').classList.add('reload-active');
            
            setTimeout(() => {
                this.ammo = CONFIG.AMMO_CAPACITY;
                this.isReloading = false;
                document.getElementById('reloadIndicator').classList.remove('reload-active');
                this.updateAmmoDisplay();
            }, CONFIG.RELOAD_TIME);
        }
    }

    updateAmmoDisplay() {
        const ammoCount = document.getElementById('ammoCount');
        const ammoFill = document.getElementById('ammoFill');
        
        if (ammoCount && ammoFill) {
            ammoCount.textContent = this.ammo;
            ammoFill.style.width = `${(this.ammo / CONFIG.AMMO_CAPACITY) * 100}%`;
        }
    }

    decrementAmmo() {
        if (this.ammo > 0) {
            this.ammo--;
            this.updateAmmoDisplay();
        }
        return this.ammo > 0;
    }

    setPlayer(player) {
        this.player = player;
    }

    loadHighScore() {
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
        document.getElementById('highScoreValue').textContent = this.highScore;
    }

    loadHistory() {
        this.history = JSON.parse(localStorage.getItem('gameHistory')) || [];
    }

    updateScore(points) {
        this.score += points;
        document.getElementById('scoreValue').textContent = this.score;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            document.getElementById('highScoreValue').textContent = this.highScore;
            localStorage.setItem('highScore', this.highScore);
        }
    }

    showHistory() {
        const historyPanel = document.getElementById('historyPanel');
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        this.history.forEach((game, index) => {
            const entry = document.createElement('div');
            entry.className = 'history-entry';
            entry.innerHTML = `
                <p>${index + 1}. Score: ${game.score} - ${game.date}</p>
            `;
            historyList.appendChild(entry);
        });
        
        historyPanel.classList.add('visible');

        // Add click event listener to close history when clicking outside
        const closeHistoryHandler = (e) => {
            if (e.target === historyPanel) {
                this.hideHistory();
                document.removeEventListener('click', closeHistoryHandler);
            }
        };
        document.addEventListener('click', closeHistoryHandler);
    }

    hideHistory() {
        const historyPanel = document.getElementById('historyPanel');
        historyPanel.classList.remove('visible');
    }

    saveGameHistory() {
        const date = new Date().toLocaleString();
        this.history.unshift({
            score: this.score,
            date: date,
            powerupsCollected: this.powerupsCollected
        });
        
        if (this.history.length > CONFIG.MAX_HISTORY) {
            this.history.pop();
        }
        
        localStorage.setItem('gameHistory', JSON.stringify(this.history));
    }
}

const gameState = new GameState();