/**
 * A calm keyboard sound. Not a click track — a soft, low "thock" with a fast
 * decay, pitched slightly differently every press so a fast run of keys never
 * sounds like a machine gun.
 *
 * The AudioContext is created on the first keypress, never on load, so the
 * browser never sees an autoplay attempt.
 */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!ctx) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return null;
        ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
}

function thock(freq: number, gain: number, decay: number) {
    const ac = audio();
    if (!ac) return;

    const osc = ac.createOscillator();
    const env = ac.createGain();
    const tone = ac.createBiquadFilter();

    tone.type = "lowpass";
    tone.frequency.value = 900;

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    // a quick downward slide is what gives it the wooden, un-beepy character
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, ac.currentTime + decay);

    env.gain.setValueAtTime(0.0001, ac.currentTime);
    env.gain.exponentialRampToValueAtTime(gain, ac.currentTime + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + decay);

    osc.connect(tone).connect(env).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + decay + 0.02);
}

export function playKey() {
    thock(185 + Math.random() * 30, 0.06, 0.07);
}

export function playMiss() {
    thock(110 + Math.random() * 12, 0.045, 0.11);
}
