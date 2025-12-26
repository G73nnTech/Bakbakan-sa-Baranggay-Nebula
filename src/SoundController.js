export class SoundController {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterVolume = 0.3;
        this.initialized = false;

        // Ensure we try to resume on first click if needed
        window.addEventListener('click', () => {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().then(() => {
                    this.initialized = true;
                });
            }
        }, { once: true });
    }

    playFrequencyRamp(startFreq, endFreq, duration, type = 'square', vol = 1) {
        if (this.ctx.state === 'suspended') return; // Can't play if suspended

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(vol * this.masterVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    shoot() {
        // Pew sound: High to Low
        this.playFrequencyRamp(880, 110, 0.15, 'square', 0.24);
    }

    enemyShoot() {
        // Lower tech sound
        this.playFrequencyRamp(400, 100, 0.2, 'sawtooth', 0.2);
    }

    titanShoot() {
        // Big heavy sound
        this.playFrequencyRamp(200, 50, 0.4, 'square', 0.5);
    }

    powerUp() {
        // Coin/Powerup sound (arpeggio)
        if (this.ctx.state === 'suspended') return;
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.3 * this.masterVolume, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.1);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.1);
        });
    }

    loseLife() {
        // Distinct "Uh oh" / glitch sound
        if (this.ctx.state === 'suspended') return;

        // 1. Fast descending slide (The "Zip" down)
        this.playFrequencyRamp(300, 50, 0.3, 'sawtooth', 0.5);

        // 2. Discordant bits
        setTimeout(() => {
            this.playFrequencyRamp(100, 20, 0.2, 'square', 0.5);
        }, 100);
    }

    kamikazeDive() {
        // Shorter Low drone (1.5s) - "Diving Plane"
        if (this.ctx.state === 'suspended') return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        // Start high, go low fast
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 1.5);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5 * this.masterVolume, this.ctx.currentTime + 0.2);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.5);
    }

    titanSpawn() {
        // Arcade "Power Up" Sequence
        if (this.ctx.state === 'suspended') return;
        const now = this.ctx.currentTime;

        // Rapid rising arpeggio
        // C3, E3, G3, C4, E4, G4, C5...
        const freqs = [130.81, 164.81, 196.00, 261.63, 329.63, 392.00, 523.25];

        freqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square'; // 8-bit feel
            osc.frequency.setValueAtTime(freq, now + i * 0.1);

            gain.gain.setValueAtTime(0.3 * this.masterVolume, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.1);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.1);
        });
    }

    explosion() {
        // Standard explosion
        this.createNoiseBuffer(0.5, 1000, 0.8);
    }

    titanExplosion() {
        // Massive explosion with Sub-Bass Shockwave
        if (this.ctx.state === 'suspended') return;

        // 1. The Rumble/Noise (Longer duration)
        this.createNoiseBuffer(2.5, 300, 1.0);

        // 2. The Sub-Bass Shockwave
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 2.0); // Drop to felt-only freq

        gain.gain.setValueAtTime(1.0 * this.masterVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2.0);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 2.0);
    }

    gameOver() {
        // Sad melody
        if (this.ctx.state === 'suspended') return;
        const now = this.ctx.currentTime;
        // G3, F#3, F3, E3 - classic losing motif
        [196.00, 185.00, 174.61, 164.81].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.4 * this.masterVolume, now + i * 0.4);
            gain.gain.linearRampToValueAtTime(0, now + i * 0.4 + 0.35);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.4);
            osc.stop(now + i * 0.4 + 0.4);
        });
    }

    createNoiseBuffer(duration, filterFreq, volumeMultiplier) {
        if (this.ctx.state === 'suspended') return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volumeMultiplier * this.masterVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = filterFreq;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    }
}
