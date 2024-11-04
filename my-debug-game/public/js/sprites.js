class SpriteManager {
    constructor() {
        this.sprites = {};
        this.loadSprites();
    }

    loadSprites() {
        // Define the path to the images folder
        const imagePath = '/images/';
    
        // Player sprite (IDE/Code Editor)
        this.sprites.player = new Image();
        this.sprites.player.src = `${imagePath}player.png`;
    
        // Basic Bug Enemy
        this.sprites.basicEnemy = new Image();
        this.sprites.basicEnemy.src = `${imagePath}bugs.png`;
    
        // Zigzag Enemy (Syntax Error)
        this.sprites.zigzagEnemy = new Image();
        this.sprites.zigzagEnemy.src = `${imagePath}loading.png`;
    
        // Patrol Enemy (Runtime Error)
        this.sprites.patrolEnemy = new Image();
        this.sprites.patrolEnemy.src = `${imagePath}404.png`;
    
        // Power-ups
        this.sprites.tripleShot = new Image();
        this.sprites.tripleShot.src = `${imagePath}fix.png`;
    
        this.sprites.rapidFire = new Image();
        this.sprites.rapidFire.src = `${imagePath}chatgpt.png`;
    
        this.sprites.spreadShot = new Image();
        this.sprites.spreadShot.src = `${imagePath}chatgpt.png`;
    
        this.sprites.ammoBoost = new Image();
        this.sprites.ammoBoost.src = `${imagePath}code.png`;
    
        // Bullet sprite (debugger)
        this.sprites.bullet = new Image();
        this.sprites.bullet.src = `${imagePath}code.png`;
    }
}