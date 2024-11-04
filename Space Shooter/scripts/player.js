class Player {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = CONFIG.CANVAS_WIDTH / 2 - 25;
        this.y = CONFIG.CANVAS_HEIGHT - 60;
        this.width = 50;
        this.height = 50;
        this.speed = CONFIG.BASE_PLAYER_SPEED;
        this.bullets = [];
        this.lastShot = 0;
    }

    update(keys) {
        // Handle movement
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x < CONFIG.CANVAS_WIDTH - this.width) {
            this.x += this.speed;
        }
        if (keys['ArrowUp'] && this.y > 0) {
            this.y -= this.speed;
        }
        if (keys['ArrowDown'] && this.y < CONFIG.CANVAS_HEIGHT - this.height) {
            this.y += this.speed;
        }

        // Update bullets with angles for spread shot
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (bullet.angle) {
                bullet.x += Math.sin(bullet.angle) * CONFIG.BULLET_SPEED;
                bullet.y -= Math.cos(bullet.angle) * CONFIG.BULLET_SPEED;
            } else {
                bullet.y -= CONFIG.BULLET_SPEED;
            }
            if (bullet.y < 0) {
                this.bullets.splice(i, 1);
            }
        }
    }

    collision() {
        // Play explosion sound
        const oscillator = audioManager.context.createOscillator();
        const gainNode = audioManager.context.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, audioManager.context.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioManager.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioManager.context.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioManager.context.destination);
        
        oscillator.start();
        oscillator.stop(audioManager.context.currentTime + 0.3);

        // Create explosion effect
        gameState.effectManager.createExplosion(this.x + this.width/2, this.y + this.height/2);
    }

    shoot() {
        if (gameState.isReloading) return;
        
        const currentTime = Date.now();
        
        // Get fire delay based on powerup status
        const fireDelay = powerUpManager.activeEffects.has('RAPID_FIRE') ? 150 : 250;
        
        if (currentTime - this.lastShot < fireDelay) return;
        
        if (gameState.ammo <= 0) {
            gameState.reload();
            return;
        }

        if (!gameState.decrementAmmo()) return;

        this.lastShot = currentTime;
        
        // Play shoot sound
        audioManager.playSound('shoot');

        // Create bullets based on active powerups
        const baseX = this.x + this.width/2 - 1.5;
        const baseY = this.y;
        let bulletPatterns = [];

        // Debug logging
        console.log('Active effects during shoot:', Array.from(powerUpManager.activeEffects));

        // Create bullet patterns based on active effects
        if (powerUpManager.activeEffects.has('TRIPLE_SHOT') && powerUpManager.activeEffects.has('SPREAD_SHOT')) {
            // Combine triple and spread
            const angles = [-0.3, 0, 0.3];
            const offsets = [-15, 0, 15];
            offsets.forEach(xOffset => {
                angles.forEach(angle => {
                    bulletPatterns.push({
                        x: baseX + xOffset,
                        y: baseY,
                        angle: angle
                    });
                });
            });
        } else if (powerUpManager.activeEffects.has('TRIPLE_SHOT')) {
            bulletPatterns = [
                { x: baseX - 15, y: baseY },
                { x: baseX, y: baseY },
                { x: baseX + 15, y: baseY }
            ];
        } else if (powerUpManager.activeEffects.has('SPREAD_SHOT')) {
            bulletPatterns = [
                { x: baseX, y: baseY, angle: -0.3 },
                { x: baseX, y: baseY, angle: 0 },
                { x: baseX, y: baseY, angle: 0.3 }
            ];
        } else {
            // Default single bullet
            bulletPatterns = [{ x: baseX, y: baseY }];
        }

        // Create all bullets
        bulletPatterns.forEach(pattern => {
            this.bullets.push({
                x: pattern.x,
                y: pattern.y,
                angle: pattern.angle || 0,
                width: 3,
                height: 15
            });
        });
    }

    startReload() {
        if (!gameState.isReloading) {
            gameState.isReloading = true;
            document.getElementById('reloadIndicator').classList.add('reload-active');
            audioManager.createSound('reload');
            
            setTimeout(() => {
                gameState.ammo = CONFIG.AMMO_CAPACITY;
                gameState.isReloading = false;
                document.getElementById('reloadIndicator').classList.remove('reload-active');
                powerUpManager.updateAmmoDisplay();
            }, CONFIG.RELOAD_TIME);
        }
    }
}
