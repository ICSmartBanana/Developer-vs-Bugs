class Enemy {
    constructor(type, x) {
        this.type = type;
        this.config = ENEMY_TYPES[type] || ENEMY_TYPES.BASIC; // Fallback to BASIC if type not found
        this.x = x;
        this.initialX = x;
        this.y = 0;
        this.width = this.config.size || 40;
        this.height = this.config.size || 40;
        this.speed = this.config.baseSpeed;
        this.points = this.config.points;
        this.time = 0;
        this.direction = 1; // For PATROL type
        this.patrolDistance = 100;
    }


    update() {
        this.time += 1/60;
        
        switch(this.type) {
            case 'PATROL':
                // Move left and right while descending
                this.x += this.speed * this.direction;
                if (Math.abs(this.x - this.initialX) > this.patrolDistance) {
                    this.direction *= -1;
                }
                this.y += this.config.verticalSpeed || 1;
                break;
            case 'ZIGZAG':
                this.x = this.initialX + 
                    Math.sin(this.time * (this.config.frequency || 0.02)) * 
                    (this.config.amplitude || 100);
                this.y += this.speed;
                break;
            default:
                this.y += this.speed;
                break;
        }
    }

    collision() {
        if (gameState.effectManager) {
            gameState.effectManager.createExplosion(
                this.x + this.width/2,
                this.y + this.height/2,
                this.config.color
            );
            
            // Play explosion sound
            if (audioManager && audioManager.context) {
                const oscillator = audioManager.context.createOscillator();
                const gainNode = audioManager.context.createGain();
                
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(150, audioManager.context.currentTime);
                gainNode.gain.setValueAtTime(0.2, audioManager.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioManager.context.currentTime + 0.2);
                
                oscillator.connect(gainNode);
                gainNode.connect(audioManager.context.destination);
                
                oscillator.start();
                oscillator.stop(audioManager.context.currentTime + 0.2);
            }
        }
    }

    isOffScreen() {
        return this.y > CONFIG.CANVAS_HEIGHT;
    }
}

class EnemyManager {
    constructor() {
        this.enemies = [];
        this.lastSpawnTime = Date.now();
        this.spawnCooldown = 1000;
    }

    spawnEnemy() {
        const currentTime = Date.now();
        if (currentTime - this.lastSpawnTime < this.spawnCooldown) {
            return;
        }

        if (Math.random() < CONFIG.ENEMY_SPAWN_RATE) {
            const typeRoll = Math.random();
            let type;
            
            if (typeRoll < 0.4) {
                type = 'BASIC';
            } else if (typeRoll < 0.7) {
                type = 'PATROL';
            } else {
                type = 'ZIGZAG';
            }

            const x = Math.random() * (CONFIG.CANVAS_WIDTH - 40);
            this.enemies.push(new Enemy(type, x));
            this.lastSpawnTime = currentTime;
        }
    }

    update() {
        this.spawnEnemy();

        // Update existing enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            if (!this.enemies[i]) continue;
            
            this.enemies[i].update();
            
            // Remove enemies that are off screen
            if (this.enemies[i].isOffScreen()) {
                this.enemies.splice(i, 1);
            }
        }
    }

    checkCollisions(bullets, player) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Check bullet collisions
            for (let j = bullets.length - 1; j >= 0; j--) {
                const bullet = bullets[j];
                if (this.isColliding(bullet, enemy)) {
                    enemy.collision && enemy.collision();
                    gameState.updateScore(enemy.points);
                    this.enemies.splice(i, 1);
                    bullets.splice(j, 1);
                    break;
                }
            }

            // Check player collision
            if (this.enemies[i] && this.isColliding(player, enemy)) {
                enemy.collision && enemy.collision();
                player.collision && player.collision();
                gameState.gameOver();
                this.enemies = [];
                break;
            }
        }
    }

    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
}

const enemyManager = new EnemyManager();