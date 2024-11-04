class ThemeManager {
    constructor() {
        this.currentTheme = 'retro';
        this.init();
    }

    init() {
        const themeToggle = document.getElementById('themeToggle');
        const themeLabel = document.getElementById('themeLabel');
        
        themeToggle.addEventListener('change', (e) => {
            this.currentTheme = e.target.checked ? 'modern' : 'retro';
            this.applyTheme();
            themeLabel.textContent = this.currentTheme.charAt(0).toUpperCase() + 
                                   this.currentTheme.slice(1);
        });

        // Initial theme application
        this.applyTheme();
    }

    applyTheme() {
        document.body.classList.remove('theme-retro', 'theme-modern');
        document.body.classList.add(`theme-${this.currentTheme}`);
        
        // Update game elements based on theme
        if (this.currentTheme === 'modern') {
            this.applyModernTheme();
        } else {
            this.applyRetroTheme();
        }
    }

    applyModernTheme() {
        // Modern theme specific settings
        CONFIG.BULLET_COLOR = '#2196F3';
        CONFIG.PLAYER_COLOR = '#2196F3';
        CONFIG.ENEMY_COLORS = {
            BASIC: '#ff4444',
            PATROL: '#ffbb33',
            ZIGZAG: '#aa66cc'
        };
    }

    applyRetroTheme() {
        // Retro theme specific settings
        CONFIG.BULLET_COLOR = '#0f0';
        CONFIG.PLAYER_COLOR = '#0f0';
        CONFIG.ENEMY_COLORS = {
            BASIC: '#f00',
            PATROL: '#ff0',
            ZIGZAG: '#f0f'
        };
    }
}