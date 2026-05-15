class SoundSystem {
  private ctx: AudioContext | null = null;
  private volume: number = 0.5;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number) {
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Multiply individual sound volume by master volume
    const finalVolume = volume * this.volume;
    
    gain.gain.setValueAtTime(finalVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playCorrect() {
    this.playTone(880, 'sine', 0.1, 0.1);
  }

  playIncorrect() {
    this.playTone(110, 'sawtooth', 0.1, 0.05);
  }

  playComplete() {
    this.playTone(440, 'sine', 0.2, 0.1);
    setTimeout(() => this.playTone(880, 'sine', 0.3, 0.1), 100);
  }

  playFinish() {
    this.playTone(523, 'sine', 0.2, 0.1);
    setTimeout(() => this.playTone(659, 'sine', 0.2, 0.1), 150);
    setTimeout(() => this.playTone(783, 'sine', 0.4, 0.1), 300);
  }

  playNotification() {
    this.playTone(1320, 'sine', 0.1, 0.05);
    setTimeout(() => this.playTone(1580, 'sine', 0.15, 0.05), 50);
  }
}

export const sounds = new SoundSystem();
