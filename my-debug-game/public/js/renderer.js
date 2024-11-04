class Renderer {
    constructor(ctx, effectManager) {
        this.ctx = ctx;
        this.effectManager = effectManager;
        this.setupLevelUpElement();
        this.createBackground();
        this.sprites = new SpriteManager().sprites;
    }

    createBackground() {
        const patternCanvas = document.createElement('canvas');
        const patternCtx = patternCanvas.getContext('2d');
        patternCanvas.width = CONFIG.CANVAS_WIDTH;
        patternCanvas.height = CONFIG.CANVAS_HEIGHT;

        // Fill background
        patternCtx.fillStyle = '#1e1e1e';
        patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

        // Add code-like lines
        patternCtx.font = '12px monospace';
        const lines = [
            'function debug() {',
            '  try {',
            '    const bug = findBug();',
            '    if (bug) fixBug(bug);',
            '  } catch (error) {',
            '    console.error(error);',
            '  }',
            '}',
            'while (bugs.length > 0) {',
            '  debugger;',
            '  fixNextBug();',
            '}'
        ];

        patternCtx.fillStyle = 'rgba(86, 156, 214, 0.2)';
        for (let i = 0; i < Math.ceil(patternCanvas.height / 20); i++) {
            const line = lines[i % lines.length];
            patternCtx.fillText(line, 10, 20 + i * 20);
        }

        this.backgroundPattern = patternCtx.createPattern(patternCanvas, 'repeat');
    }

    draw(player, enemyManager, powerUpManager) {
        // Draw background
        this.ctx.fillStyle = this.backgroundPattern;
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

        // Draw game objects
        this.drawPlayer(player);
        this.drawBullets(player.bullets);
        this.drawEnemies(enemyManager.enemies);
        this.drawPowerups(powerUpManager.powerups);
        
        // Draw effects
        this.effectManager.draw();
    }

    drawPlayer(player) {
        if (this.sprites.player) {
            this.ctx.drawImage(
                this.sprites.player,
                player.x,
                player.y,
                player.width,
                player.height
            );
        }
    }

    setupLevelUpElement() {
        // Create level up message container if it doesn't exist
        let levelUpContainer = document.getElementById('levelUpContainer');
        if (!levelUpContainer) {
            levelUpContainer = document.createElement('div');
            levelUpContainer.id = 'levelUpContainer';
            levelUpContainer.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000;
                pointer-events: none;
                text-align: center;
            `;
            document.querySelector('.game-container').appendChild(levelUpContainer);
        }
    }

    showLevelUpMessage(level) {
        const message = document.createElement('div');
        message.className = 'level-up-message';
        message.innerHTML = `
            LEVEL ${level}<br>
            <span style="font-size: 16px">Speed Increased!</span>
        `;
        
        document.getElementById('levelUpContainer').appendChild(message);
        
        // Add visible class after a short delay for animation
        requestAnimationFrame(() => message.classList.add('visible'));
        
        // Remove the message after animation
        setTimeout(() => {
            message.remove();
        }, 2000);
    }

    drawEnemies(enemies) {
        enemies.forEach(enemy => {
            let sprite;
            switch(enemy.type) {
                case 'BASIC':
                    sprite = this.sprites.basicEnemy;
                    break;
                case 'PATROL':
                    sprite = this.sprites.patrolEnemy;
                    break;
                case 'ZIGZAG':
                    sprite = this.sprites.zigzagEnemy;
                    break;
                default:
                    sprite = this.sprites.basicEnemy;
            }
            
            if (sprite) {
                this.ctx.drawImage(
                    sprite,
                    enemy.x,
                    enemy.y,
                    enemy.width,
                    enemy.height
                );
            }
        });
    }

    drawPowerups(powerups) {
        powerups.forEach(powerup => {
            let sprite;
            switch(powerup.type) {
                case 'TRIPLE_SHOT':
                    sprite = this.sprites.tripleShot;
                    break;
                case 'RAPID_FIRE':
                    sprite = this.sprites.rapidFire;
                    break;
                case 'SPREAD_SHOT':
                    sprite = this.sprites.spreadShot;
                    break;
                case 'AMMO_BOOST':
                    sprite = this.sprites.ammoBoost;
                    break;
                default:
                    sprite = this.sprites.tripleShot;
            }
            
            if (sprite) {
                this.ctx.drawImage(
                    sprite,
                    powerup.x,
                    powerup.y,
                    powerup.width,
                    powerup.height
                );
            }
        });
    }

    drawBullets(bullets) {
        if (this.sprites.bullet) {
            bullets.forEach(bullet => {
                this.ctx.drawImage(
                    this.sprites.bullet,
                    bullet.x,
                    bullet.y,
                    bullet.width,
                    bullet.height
                );
            });
        }
    }

    drawGameOver() {
        this.ctx.fillStyle = '#0f0';
        this.ctx.shadowColor = '#0f0';
        this.ctx.shadowBlur = 10;
        this.ctx.font = '48px "Press Start 2P"';
        this.ctx.fillText('GAME OVER', CONFIG.CANVAS_WIDTH/2 - 180, CONFIG.CANVAS_HEIGHT/2);
        this.ctx.font = '24px "Press Start 2P"';
        this.ctx.fillText(
            'Press SPACE to restart',
            CONFIG.CANVAS_WIDTH/2 - 200,
            CONFIG.CANVAS_HEIGHT/2 + 40
        );
        this.ctx.shadowBlur = 0;
    }
}