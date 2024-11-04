const CONFIG = {
    AMMO_CAPACITY: 30,
    RELOAD_TIME: 2000,
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    BASE_PLAYER_SPEED: 5,
    BASE_BULLET_SPEED: 7,
    BULLET_SPEED: 7,
    ENEMY_SPAWN_RATE: 0.05,
    POWERUP_SPAWN_RATE: 0.005,
    MAX_HISTORY: 10,
    INITIAL_AMMO: 30
};

const ENEMY_TYPES = {
    BASIC: {
        baseSpeed: 2,
        speed: 2,
        points: 10,
        color: '#f00',
        size: 40
    },
    PATROL: {
        baseSpeed: 3,
        speed: 3,
        verticalSpeed: 1,
        points: 20,
        color: '#ff0',
        size: 40,
        amplitude: 100,
        frequency: 0.02
    },
    ZIGZAG: {
        baseSpeed: 2.5,
        speed: 2.5,
        points: 15,
        color: '#f0f',
        size: 40,
        amplitude: 100,
        frequency: 0.02
    }
};

const POWERUP_TYPES = {
    TRIPLE_SHOT: {
        name: 'Triple Shot',
        duration: 10000,
        symbol: 'T',
        color: '#0ff'
    },
    RAPID_FIRE: {
        name: 'Rapid Fire',
        duration: 8000,
        symbol: 'R',
        color: '#ff0'
    },
    SPREAD_SHOT: {
        name: 'Spread Shot',
        duration: 12000,
        symbol: 'S',
        color: '#f0f'
    },
    AMMO_BOOST: {
        name: 'Ammo Boost',
        duration: 0,
        symbol: 'A',
        color: '#0f0'
    }
};