class PowerUp {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 2;
        this.config = POWERUP_TYPES[type];
    }

    update() {
        this.y += this.speed;
    }

    isOffScreen() {
        return this.y > CONFIG.CANVAS_HEIGHT;
    }
}

class PowerUpManager {
    constructor() {
        this.powerups = [];
        this.activeEffects = new Set();
        this.powerupTimers = new Map();
        this.updateDisplay = true; // Flag to ensure display updates
    }

    update() {
        if (Math.random() < CONFIG.POWERUP_SPAWN_RATE) {
            const types = Object.keys(POWERUP_TYPES);
            const type = types[Math.floor(Math.random() * types.length)];
            const x = Math.random() * (CONFIG.CANVAS_WIDTH - 30);
            this.powerups.push(new PowerUp(type, x, 0));
        }

        // Update powerups
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            powerup.update();
            if (powerup.y > CONFIG.CANVAS_HEIGHT) {
                this.powerups.splice(i, 1);
            }
        }
    }

    spawnPowerUp() {
        if (Math.random() < CONFIG.POWERUP_SPAWN_RATE) {
            const types = Object.keys(POWERUP_TYPES);
            const type = types[Math.floor(Math.random() * types.length)];
            const x = Math.random() * (CONFIG.CANVAS_WIDTH - 30);
            this.powerups.push(new PowerUp(type, x, 0));
        }
    }

    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    checkCollisions(player) {
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            if (this.isColliding(player, powerup)) {
                this.activatePowerUp(powerup.type);
                this.powerups.splice(i, 1);
                
                // Visual and sound feedback
                gameState.effectManager.createPowerupEffect(powerup.x, powerup.y);
                this.playPowerupSound();
            }
        }
    }

    isColliding(player, powerup) {
        return player.x < powerup.x + powerup.width &&
               player.x + player.width > powerup.x &&
               player.y < powerup.y + powerup.height &&
               player.y + player.height > powerup.y;
    }


    activatePowerUp(type) {
        const powerupConfig = POWERUP_TYPES[type];
        
        if (type === 'AMMO_BOOST') {
            gameState.ammo = Math.min(gameState.ammo + 15, CONFIG.AMMO_CAPACITY);
            this.updateAmmoDisplay();
            return;
        }

        // Clear existing timer if present
        if (this.powerupTimers.has(type)) {
            clearTimeout(this.powerupTimers.get(type));
        }

        // Activate the power-up
        this.activeEffects.add(type);
        this.updatePowerupDisplay();

        // Create visual feedback
        gameState.effectManager.createPowerupEffect(
            gameState.player.x + gameState.player.width/2,
            gameState.player.y + gameState.player.height/2
        );

        console.log('Active effects:', Array.from(this.activeEffects)); // Debug log

        // Set timer for power-up expiration
        const timer = setTimeout(() => {
            this.activeEffects.delete(type);
            this.powerupTimers.delete(type);
            this.updatePowerupDisplay();
            console.log('Power-up expired:', type); // Debug log
        }, powerupConfig.duration);

        this.powerupTimers.set(type, timer);
    }

    playPowerupSound() {
        const oscillator = audioManager.context.createOscillator();
        const gainNode = audioManager.context.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioManager.context.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioManager.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioManager.context.currentTime + 0.2);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioManager.context.destination);
        
        oscillator.start();
        oscillator.stop(audioManager.context.currentTime + 0.2);
    }

    clearAllPowerups() {
        this.activeEffects.clear();
        this.powerupTimers.forEach(timer => clearTimeout(timer));
        this.powerupTimers.clear();
        this.updatePowerupDisplay();
    }


    updatePowerupDisplay() {
        const container = document.getElementById('powerupList');
        container.innerHTML = '';
        
        this.activeEffects.forEach(type => {
            const powerupConfig = POWERUP_TYPES[type];
            const icon = document.createElement('div');
            icon.className = 'powerup-icon';
            icon.textContent = powerupConfig.symbol;
            icon.style.backgroundColor = powerupConfig.color;
            container.appendChild(icon);
        });
    }

    updateAmmoDisplay() {
        document.getElementById('ammoCount').textContent = gameState.ammo;
        document.getElementById('ammoFill').style.width = 
            `${(gameState.ammo / CONFIG.AMMO_CAPACITY) * 100}%`;
    }
}

const powerUpManager = new PowerUpManager();
