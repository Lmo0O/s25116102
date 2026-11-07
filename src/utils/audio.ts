/**
 * Web Audio API based 16-bit retro chiptune sound generator
 * Crisp, authentic, instant response, and 100% offline-friendly.
 */

class RetroAudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check saved audio preference
    const saved = localStorage.getItem('pixel_fishing_sound');
    if (saved !== null) {
      this.isMuted = saved === 'muted';
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('pixel_fishing_sound', this.isMuted ? 'muted' : 'enabled');
    if (!this.isMuted) {
      this.playCoin();
    }
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playCast() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Whoosh timing synced with forward rod swing (~200ms)
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    }, 180);

    // Water plop as bobber lands in the lake (~580ms)
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const plopNow = this.ctx.currentTime;
      const plopOsc = this.ctx.createOscillator();
      const plopGain = this.ctx.createGain();

      plopOsc.type = 'sine';
      plopOsc.frequency.setValueAtTime(480, plopNow);
      plopOsc.frequency.exponentialRampToValueAtTime(160, plopNow + 0.16);

      plopGain.gain.setValueAtTime(0.22, plopNow);
      plopGain.gain.exponentialRampToValueAtTime(0.001, plopNow + 0.16);

      plopOsc.connect(plopGain);
      plopGain.connect(this.ctx.destination);

      plopOsc.start(plopNow);
      plopOsc.stop(plopNow + 0.16);
    }, 580);
  }

  public playBite() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 8-bit double exclamation chime: High, crisp and exciting!
    [0, 0.12].forEach((offset, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      const freq = idx === 0 ? 880 : 1174.66; // A5 then D6
      osc.frequency.setValueAtTime(freq, now + offset);

      gain.gain.setValueAtTime(0.16, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.1);
    });
  }

  public playReel() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const offset = i * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400 + i * 80, now + offset);

      gain.gain.setValueAtTime(0.1, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.04);
    }
  }

  public playCatch(rarity: 'common' | 'rare' | 'super_rare') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (rarity === 'super_rare') {
      // Golden Fish Fanfare!
      const notes = [523.25, 659.25, 783.99, 1046.5, 987.77, 1046.5, 1318.51];
      const durations = [0.1, 0.1, 0.1, 0.15, 0.1, 0.12, 0.45];

      let elapsed = 0;
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const noteStart = now + elapsed;
        const dur = durations[i];
        elapsed += dur * 0.9;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.22, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + dur);
      });
    } else if (rarity === 'rare') {
      // Rare Fanfare (4 notes)
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const noteStart = now + i * 0.11;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.15, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.2);
      });
    } else {
      // Common catch (3 pleasant chimes)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const noteStart = now + i * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.18, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.18);
      });
    }
  }

  public playAchievementFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Celebratory triumph: C5 -> E5 -> G5 -> C6 high sustain!
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const delays = [0, 0.12, 0.24, 0.38];
    const durations = [0.12, 0.12, 0.14, 0.5];

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const start = now + delays[idx];
      const dur = durations[idx];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === 3 ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + dur);
    });
  }

  public playAchievement() {
    this.playAchievementFanfare();
  }

  public playCoin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playEscape() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.35);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }
}

export const soundManager = new RetroAudioManager();
