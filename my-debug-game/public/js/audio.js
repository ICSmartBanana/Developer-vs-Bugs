class AudioManager {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {};
        this.memeAudio = null;
    }

    playSound(type) {
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        switch(type) {
            case 'explosion':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(100, this.context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(20, this.context.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.5, this.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);
                break;

            case 'powerup':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, this.context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, this.context.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);
                break;

            case 'shoot':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(440, this.context.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(110, this.context.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
                break;
        }

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        oscillator.start();
        oscillator.stop(this.context.currentTime + (type === 'explosion' ? 0.5 : 0.2));
    }

    playGameOverSound() {
        // Load and play meme sound
        if (!this.memeAudio) {
            this.memeAudio = new Audio('public/audio/meme-sound.mp3');
        }
        this.memeAudio.play();
    }
}

const audioManager = new AudioManager();