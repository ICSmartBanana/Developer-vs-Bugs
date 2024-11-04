class EffectManager {
    constructor(ctx) {
        this.ctx = ctx;
        this.effects = [];
        this.screenShake = 0;
    }

    update() {
        // Update screen shake
        if (this.screenShake > 0) {
            this.screenShake *= 0.9;
            if (this.screenShake < 0.1) this.screenShake = 0;
        }

        // Update effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            
            effect.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += particle.gravity || 0;
                particle.life -= 1/effect.duration;
            });
            
            effect.duration--;
            
            if (effect.duration <= 0) {
                this.effects.splice(i, 1);
            }
        }
    }

    draw() {
        // Apply screen shake
        if (this.screenShake > 0) {
            this.ctx.save();
            const shakeX = (Math.random() - 0.5) * this.screenShake;
            const shakeY = (Math.random() - 0.5) * this.screenShake;
            this.ctx.translate(shakeX, shakeY);
        }

        // Draw effects
        this.effects.forEach(effect => {
            effect.particles.forEach(particle => {
                if (particle.life > 0) {
                    this.ctx.save();
                    this.ctx.globalAlpha = particle.life;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                }
            });
        });

        if (this.screenShake > 0) {
            this.ctx.restore();
        }
    }

    createExplosion(x, y, color = '#f00', size = 1) {
        const particles = [];
        const particleCount = 30;
        const duration = 45;
        
        // Add screen shake
        this.screenShake = 10;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = (3 + Math.random() * 3) * size;
            const particleSize = (2 + Math.random() * 2) * size;
            
            particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: particleSize,
                life: 1,
                color: color,
                gravity: 0.1
            });
        }

        this.effects.push({
            type: 'explosion',
            particles,
            duration: duration
        });
    }

    createPowerupEffect(x, y) {
        const particles = [];
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 2 + Math.random() * 2;
            
            particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2,
                life: 1,
                color: '#ff0',
                gravity: -0.1
            });
        }

        this.effects.push({
            type: 'powerup',
            particles,
            duration: 30
        });
    }
}