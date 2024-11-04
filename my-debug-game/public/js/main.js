document.addEventListener('click', function initAudio() {
    if (audioManager && audioManager.context && audioManager.context.state === 'suspended') {
        audioManager.context.resume();
    }
    document.removeEventListener('click', initAudio);
});

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.effectManager = new EffectManager(this.ctx);
        this.renderer = new Renderer(this.ctx, this.effectManager);
        this.player = new Player();
        this.gameState = gameState;
        this.gameState.setEffectManager(this.effectManager);
        this.gameState.setPlayer(this.player);
        this.keys = {};
        this.themeManager = new ThemeManager();
        this.difficultyLevel = 1;
        this.lastDifficultyIncrease = Date.now();
        this.difficultyIncreaseInterval = 30000;
        
        this.enemyManager = new EnemyManager();
        this.powerUpManager = new PowerUpManager();
        
        this.bindEvents();
        this.setupGame();

        // Initialize audio context on first interaction
        document.addEventListener('click', () => {
            if (audioManager && audioManager.context) {
                audioManager.context.resume();
            }
        }, { once: true });
    }

    setupGame() {
        // Initial render
        this.renderer.draw(this.player, this.enemyManager, this.powerUpManager);
    }

    bindEvents() {
        // Key events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Button events
        const newGameBtn = document.querySelector('#newGameBtn');
        const historyBtn = document.querySelector('#historyBtn');
        const historyCloseArea = document.querySelector('#historyPanel');

        if (newGameBtn) newGameBtn.addEventListener('click', () => this.start());
        if (historyBtn) historyBtn.addEventListener('click', () => this.showHistory());
        if (historyCloseArea) historyCloseArea.addEventListener('click', (e) => {
            if (e.target === historyCloseArea) {
                this.hideHistory();
            }
        });
    }

    setupDifficultyProgression() {
        setInterval(() => {
            const currentTime = Date.now();
            if (this.gameState.isGameRunning && 
                currentTime - this.lastDifficultyIncrease >= this.difficultyIncreaseInterval) {
                this.increaseDifficulty();
                this.lastDifficultyIncrease = currentTime;
            }
        }, 1000); // Check every second
    }

    increaseDifficulty() {
        this.difficultyLevel++;
        const speedMultiplier = 1 + (this.difficultyLevel - 1) * 0.1; // 10% increase per level

        // Update base speeds in ENEMY_TYPES configuration
        Object.keys(ENEMY_TYPES).forEach(type => {
            ENEMY_TYPES[type].speed = ENEMY_TYPES[type].baseSpeed * speedMultiplier;
        });

        // Update player speed
        this.player.speed = CONFIG.BASE_PLAYER_SPEED * speedMultiplier;
        CONFIG.BULLET_SPEED = CONFIG.BASE_BULLET_SPEED * speedMultiplier;

        // Show level up message
        this.renderer.showLevelUpMessage(this.difficultyLevel);
    }

    handleKeyDown(e) {
        this.keys[e.key] = true;
        if (e.key === ' ') {
            if (!this.gameState.isGameRunning) {
                this.start();
            } else if (!this.gameState.isReloading) {
                this.player.shoot();
            }
            e.preventDefault();
        }
        if (e.key === 'r') {
            this.player.startReload();
        }
    }

    handleKeyUp(e) {
        this.keys[e.key] = false;
    }

    start() {
        if (!this.gameState.isGameRunning) {
            this.gameState.reset();
            this.gameState.isGameRunning = true;
            this.player.reset();
            this.enemyManager = new EnemyManager();
            this.powerUpManager = new PowerUpManager();
            this.difficultyLevel = 1;
            this.lastDifficultyIncrease = Date.now();
            
            // Reset enemy speeds
            Object.keys(ENEMY_TYPES).forEach(type => {
                ENEMY_TYPES[type].speed = ENEMY_TYPES[type].baseSpeed;
            });

            // Start the game loop
            this.gameLoop();
        }
    }

    gameLoop = () => {
        if (this.gameState.isGameRunning) {
            this.update();
            this.renderer.draw(this.player, this.enemyManager, this.powerUpManager);
            requestAnimationFrame(this.gameLoop);
        }
    }

    update() {
        if (!this.gameState.isGameRunning) return;

        // Update all game objects
        this.player.update(this.keys);
        this.enemyManager.update();
        this.enemyManager.checkCollisions(this.player.bullets, this.player);
        this.powerUpManager.update();
        this.powerUpManager.checkCollisions(this.player);
        this.effectManager.update();

        // Check for difficulty increase
        const currentTime = Date.now();
        if (currentTime - this.lastDifficultyIncrease >= this.difficultyIncreaseInterval) {
            this.increaseDifficulty();
            this.lastDifficultyIncrease = currentTime;
        }
    }

    showHistory() {
        const historyPanel = document.getElementById('historyPanel');
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        this.gameState.history.forEach((game, index) => {
            const entry = document.createElement('div');
            entry.innerHTML = `
                <p>${index + 1}. Score: ${game.score} - ${game.date}</p>
            `;
            historyList.appendChild(entry);
        });
        
        historyPanel.classList.add('visible');
    }

    hideHistory() {
        document.getElementById('historyPanel').classList.remove('visible');
    }
}

// Start the game when the window loads
window.addEventListener('load', () => {
    const game = new Game();
});