/**
 * Plays a Pattern with plain Web Audio: every sound is synthesised, so there's nothing to download.
 * A look-ahead scheduler queues sixteenth notes a little before they're due, which keeps time steady
 * even on a slow machine. The crossfader drives the master chain: clean at Engineer, driven and echoing at Artist.
 */
import type { Pattern, Sound, Step } from "./pattern";

const LOOKAHEAD = 0.12; // seconds of audio queued ahead
const TICK_MS = 25;

function driveCurve(amount: number) {
  const n = 1024;
  const curve = new Float32Array(n);
  const k = amount * 60;
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
  }
  return curve;
}

export class Engine {
  private ctx: AudioContext;
  private input: GainNode;
  private drive: WaveShaperNode;
  private tone: BiquadFilterNode;
  private echoSend: GainNode;
  private echoFeedback: GainNode;
  private delay: DelayNode;
  private master: GainNode;
  private noise: AudioBuffer;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextTime = 0;
  private step = 0;
  private lastDrive = -1;

  /** Called for each step as it's queued, with the audio time it will sound at. */
  onStep: (step: number, time: number) => void = () => {};

  constructor(private getPattern: () => Pattern) {
    this.ctx = new AudioContext();
    const ctx = this.ctx;

    this.input = ctx.createGain();
    this.input.gain.value = 0.8;
    this.drive = ctx.createWaveShaper();
    this.drive.oversample = "2x";
    this.tone = ctx.createBiquadFilter();
    this.tone.type = "lowpass";
    this.tone.frequency.value = 16000;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;

    const delay = ctx.createDelay(1);
    this.echoSend = ctx.createGain();
    this.echoSend.gain.value = 0;
    this.echoFeedback = ctx.createGain();
    this.echoFeedback.gain.value = 0.35;

    // The last gain before the speakers: Stop pulls it to zero so echoes and ringing notes go silent too
    this.master = ctx.createGain();
    this.master.connect(ctx.destination);
    this.input.connect(this.drive).connect(this.tone).connect(comp).connect(this.master);
    this.tone.connect(this.echoSend).connect(delay).connect(comp);
    delay.connect(this.echoFeedback).connect(delay);
    this.delay = delay;

    // One second of white noise, reused by every drum
    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  get now() {
    return this.ctx.currentTime;
  }

  get playing() {
    return this.timer !== null;
  }

  /** 0 = the engineer (clean), 1 = the artist (driven, darker, echoing). */
  setFade(fade: number) {
    const f = Math.max(0, Math.min(1, fade));
    const t = this.ctx.currentTime;
    const amount = Math.round(f * 20) / 20;
    if (amount !== this.lastDrive) {
      this.drive.curve = amount > 0 ? driveCurve(amount) : null;
      this.lastDrive = amount;
    }
    this.tone.frequency.setTargetAtTime(16000 - f * 12500, t, 0.1);
    this.echoSend.gain.setTargetAtTime(f * 0.45, t, 0.1);
    this.input.gain.setTargetAtTime(0.8 - f * 0.25, t, 0.1);
  }

  async start() {
    if (this.timer) return;
    await this.ctx.resume();
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(1, t);
    this.step = 0;
    this.nextTime = this.ctx.currentTime + 0.06;
    this.timer = setInterval(() => this.schedule(), TICK_MS);
    this.schedule();
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(0, t, 0.015);
  }

  close() {
    this.stop();
    void this.ctx.close();
  }

  private schedule() {
    const p = this.getPattern();
    const stepDur = 60 / p.bpm / 4;
    this.delay.delayTime.setTargetAtTime(stepDur * 3, this.ctx.currentTime, 0.05);
    while (this.nextTime < this.ctx.currentTime + LOOKAHEAD) {
      const swingOffset = this.step % 2 === 1 ? (p.swing / 100) * stepDur * 0.66 : 0;
      const at = this.nextTime + swingOffset;
      for (const track of p.tracks) {
        const s = track.steps[this.step % track.steps.length];
        if (s) this.hit(track.sound, s, at, stepDur);
      }
      this.onStep(this.step, at);
      this.step++;
      this.nextTime += stepDur;
    }
  }

  private hit(sound: Sound, s: NonNullable<Step>, t: number, stepDur: number) {
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.connect(this.input);

    const env = (g: GainNode, peak: number, attack: number, decay: number) => {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    };
    const noise = (filterType: BiquadFilterType, freq: number, peak: number, decay: number) => {
      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      const f = ctx.createBiquadFilter();
      f.type = filterType;
      f.frequency.value = freq;
      const g = ctx.createGain();
      env(g, peak, 0.002, decay);
      src.connect(f).connect(g).connect(out);
      src.start(t, Math.random() * 0.5);
      src.stop(t + decay + 0.05);
    };
    const osc = (type: OscillatorType, freq: number, peak: number, attack: number, decay: number, cutoff?: number) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      const g = ctx.createGain();
      env(g, peak, attack, decay);
      if (cutoff) {
        const f = ctx.createBiquadFilter();
        f.type = "lowpass";
        f.Q.value = 6;
        f.frequency.setValueAtTime(cutoff * 4, t);
        f.frequency.exponentialRampToValueAtTime(cutoff, t + decay * 0.6);
        o.connect(f).connect(g);
      } else {
        o.connect(g);
      }
      g.connect(out);
      o.start(t);
      o.stop(t + attack + decay + 0.05);
      return o;
    };

    const v = s.gain;
    switch (sound) {
      case "kick": {
        const o = osc("sine", 150, v * 1.1, 0.003, 0.42);
        o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
        break;
      }
      case "snare":
        noise("highpass", 1400, v * 0.55, 0.18);
        osc("triangle", 190, v * 0.35, 0.002, 0.09);
        break;
      case "hat":
        noise("highpass", 7500, v * 0.28, 0.045);
        break;
      case "clap":
        [0, 0.012, 0.024].forEach((d, i) => {
          const src = ctx.createBufferSource();
          src.buffer = this.noise;
          const f = ctx.createBiquadFilter();
          f.type = "bandpass";
          f.frequency.value = 1500;
          f.Q.value = 1.2;
          const g = ctx.createGain();
          const at = t + d;
          g.gain.setValueAtTime(0.0001, at);
          g.gain.exponentialRampToValueAtTime(v * (i === 2 ? 0.6 : 0.4), at + 0.002);
          g.gain.exponentialRampToValueAtTime(0.0001, at + (i === 2 ? 0.16 : 0.02));
          src.connect(f).connect(g).connect(out);
          src.start(at, Math.random() * 0.5);
          src.stop(at + 0.2);
        });
        break;
      case "bass":
        osc("sawtooth", s.freq!, v * 0.5, 0.005, Math.min(stepDur * 1.8, 0.4), s.freq! * 3);
        osc("sine", s.freq! / 2, v * 0.3, 0.005, Math.min(stepDur * 1.8, 0.4));
        break;
      case "lead":
        osc("square", s.freq!, v * 0.16, 0.01, stepDur * 2.2, 2600);
        osc("square", s.freq! * 1.006, v * 0.12, 0.01, stepDur * 2.2, 2600);
        break;
      case "pluck":
        osc("triangle", s.freq!, v * 0.35, 0.002, 0.3);
        osc("sawtooth", s.freq! * 2, v * 0.06, 0.002, 0.12, 3000);
        break;
    }
  }
}
