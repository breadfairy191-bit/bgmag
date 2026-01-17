
// Constants for Music Theory
const NOTE_FREQS = {
    'C3': 130.81, 'Db3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'Gb3': 185.00, 'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'Db4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'Gb4': 369.99, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'G5': 783.99, 'B5': 987.77
};

function getNote(name) {
    if (NOTE_FREQS[name]) return NOTE_FREQS[name];
    return 440;
}

const GENRES = {
    chill: {
        tempo: 80,
        chords: [["C4", "E4", "G4"], ["A3", "C4", "E4"], ["F3", "A3", "C4"], ["G3", "B3", "D4"]]
    },
    dark: {
        tempo: 70,
        chords: [["A3", "C4", "E4"], ["F3", "Ab3", "C4"], ["D3", "F3", "A3"], ["E3", "G3", "B3"]]
    },
    hop: {
        tempo: 95,
        chords: [["D4", "F4", "A4"], ["G3", "Bb3", "D4"], ["A3", "C4", "E4"], ["G3", "Bb3", "D4"]]
    },
    ambient: {
        tempo: 60,
        chords: [["C4", "G4", "D5"], ["A3", "E4", "B4"]]
    },
    pop: {
        tempo: 120,
        chords: [["C4", "E4", "G4"], ["G3", "B3", "D4"], ["A3", "C4", "E4"], ["F3", "A3", "C4"]]
    }
};

const INSTRUMENTS = {
    melody: {
        sine: (ctx, dest, freq, time, dur) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = freq;
            osc.type = 'sine';

            // ADSR Envelope for Legato/Continuous feel
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.2, time + 0.1);
            gain.gain.setValueAtTime(0.2, time + dur - 0.1);
            gain.gain.linearRampToValueAtTime(0, time + dur + 0.2);

            osc.connect(gain);
            gain.connect(dest);
            osc.start(time);
            osc.stop(time + dur + 0.2);
            return gain;
        },
        pulse: (ctx, dest, freq, time, dur) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.frequency.value = freq;
            osc.type = 'square';
            filter.type = 'lowpass';
            filter.frequency.value = 1200;
            filter.Q.value = 1;

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.15, time + 0.05);
            gain.gain.setValueAtTime(0.15, time + dur - 0.1);
            gain.gain.linearRampToValueAtTime(0, time + dur + 0.2);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            osc.start(time);
            osc.stop(time + dur + 0.2);
            return gain;
        },
        bell: (ctx, dest, freq, time, dur) => {
            const carrier = ctx.createOscillator();
            const modulator = ctx.createOscillator();
            const modGain = ctx.createGain();
            const masterGain = ctx.createGain();

            const ratio = 2.0;
            carrier.frequency.value = freq;
            modulator.frequency.value = freq * ratio;
            modulator.type = 'sine';
            carrier.type = 'sine';

            modGain.gain.setValueAtTime(300, time);
            modGain.gain.exponentialRampToValueAtTime(0.1, time + dur);

            masterGain.gain.setValueAtTime(0, time);
            masterGain.gain.linearRampToValueAtTime(0.2, time + 0.02);
            masterGain.gain.exponentialRampToValueAtTime(0.001, time + dur + 2.0);

            modulator.connect(modGain);
            modGain.connect(carrier.frequency);
            carrier.connect(masterGain);
            masterGain.connect(dest);

            carrier.start(time);
            modulator.start(time);
            carrier.stop(time + dur + 2.0);
            modulator.stop(time + dur + 2.0);
            return masterGain;
        },
        retro: (ctx, dest, freq, time, dur) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = freq;
            osc.type = 'triangle';

            const vib = ctx.createOscillator();
            const vibGain = ctx.createGain();
            vib.frequency.value = 8;
            vibGain.gain.value = 5;
            vib.connect(vibGain);
            vibGain.connect(osc.frequency);
            vib.start(time);

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.15, time + 0.1);
            gain.gain.setValueAtTime(0.15, time + dur - 0.1);
            gain.gain.linearRampToValueAtTime(0, time + dur + 0.2);

            osc.connect(gain);
            gain.connect(dest);
            osc.start(time);
            osc.stop(time + dur + 0.2);
            vib.stop(time + dur + 0.2);
            return gain;
        }
    },
    bass: {
        sine: (ctx, dest, freq, time, dur) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = freq;
            osc.type = 'sine';

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.6, time + 0.05);
            gain.gain.linearRampToValueAtTime(0, time + dur);

            osc.connect(gain);
            gain.connect(dest);
            osc.start(time);
            osc.stop(time + dur + 0.1);
        },
        saw: (ctx, dest, freq, time, dur) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.frequency.value = freq;
            osc.type = 'sawtooth';
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(300, time);
            filter.frequency.exponentialRampToValueAtTime(100, time + dur);
            filter.Q.value = 5;

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.3, time + 0.05);
            gain.gain.linearRampToValueAtTime(0, time + dur);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            osc.start(time);
            osc.stop(time + dur + 0.1);
        },
        square: (ctx, dest, freq, time, dur) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.frequency.value = freq;
            osc.type = 'square';
            filter.type = 'lowpass';
            filter.frequency.value = 200;

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.4, time + 0.02);
            gain.gain.linearRampToValueAtTime(0, time + dur);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            osc.start(time);
            osc.stop(time + dur + 0.1);
        },
        fm: (ctx, dest, freq, time, dur) => {
            const carrier = ctx.createOscillator();
            const modulator = ctx.createOscillator();
            const modGain = ctx.createGain();
            const gain = ctx.createGain();

            carrier.frequency.value = freq;
            modulator.frequency.value = freq * 0.5;
            modGain.gain.value = 200;

            modulator.connect(modGain);
            modGain.connect(carrier.frequency);

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.5, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

            carrier.connect(gain);
            gain.connect(dest);
            carrier.start(time);
            modulator.start(time);
            carrier.stop(time + dur + 0.1);
            modulator.stop(time + dur + 0.1);
        }
    }
};

// HELPER: Convert AudioBuffer to WAV
function audioBufferToWav(buffer, opt) {
    opt = opt || {};
    var numChannels = buffer.numberOfChannels;
    var sampleRate = buffer.sampleRate;
    var format = opt.float32 ? 3 : 1;
    var bitDepth = format === 3 ? 32 : 16;
    var result;
    if (numChannels === 2) {
        result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
        result = buffer.getChannelData(0);
    }
    return encodeWAV(result, format, sampleRate, numChannels, bitDepth);
}
function interleave(inputL, inputR) {
    var length = inputL.length + inputR.length;
    var result = new Float32Array(length);
    var index = 0;
    var inputIndex = 0;
    while (index < length) {
        result[index++] = inputL[inputIndex];
        result[index++] = inputR[inputIndex];
        inputIndex++;
    }
    return result;
}
function encodeWAV(samples, format, sampleRate, numChannels, bitDepth) {
    var bytesPerSample = bitDepth / 8;
    var blockAlign = numChannels * bytesPerSample;
    var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
    var view = new DataView(buffer);
    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* RIFF chunk length */
    view.setUint32(4, 36 + samples.length * bytesPerSample, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, format, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * blockAlign, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, blockAlign, true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * bytesPerSample, true);
    if (format === 1) { // 16-bit
        floatTo16BitPCM(view, 44, samples);
    } else {
        writeFloat32(view, 44, samples);
    }
    return new Blob([view], { type: 'audio/wav' });
}
function floatTo16BitPCM(output, offset, input) {
    for (var i = 0; i < input.length; i++, offset += 2) {
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}
function writeFloat32(output, offset, input) {
    for (var i = 0; i < input.length; i++, offset += 4) {
        output.setFloat32(offset, input[i], true);
    }
}
function writeString(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

class Track {
    constructor(ctx, dest, baseVol = 0.5) {
        this.ctx = ctx;
        this.gainNode = ctx.createGain();
        this.gainNode.gain.value = baseVol;
        this.gainNode.connect(dest);
        this.volume = baseVol;
        this.instrument = null;
    }
    setVolume(val) {
        this.volume = val;
        this.gainNode.gain.setTargetAtTime(val, this.ctx.currentTime, 0.05);
    }
    setInstrument(id) {
        this.instrument = id;
    }
}

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.analyser = null;
        this.dest = null;
        this.recDest = null;
        this.mediaRecorder = null;
        this.chunks = [];

        this.melodyTrack = null;
        this.harmonyTrack = null;
        this.bassTrack = null;
        this.drumTrack = null;

        this.isPlaying = false;
        this.isRecording = false;

        // Music Data
        this.genre = 'pop';
        this.tempo = 120;
        this.chords = GENRES.pop.chords;
        this.currentChordIndex = 0;

        // Scheduler
        this.nextNoteTime = 0;
        this.lookahead = 25.0;
        this.scheduleAheadTime = 0.1;
        this.timerID = null;
        this.beatCount = 0;
    }

    init() {
        if (this.ctx) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.7;

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.masterGain.connect(this.analyser);

        this.masterGain.connect(this.ctx.destination);

        this.recDest = this.ctx.createMediaStreamDestination();
        this.masterGain.connect(this.recDest);

        this.melodyTrack = new Track(this.ctx, this.masterGain, 0.6);
        this.harmonyTrack = new Track(this.ctx, this.masterGain, 0.4);
        this.bassTrack = new Track(this.ctx, this.masterGain, 0.7);
        this.drumTrack = new Track(this.ctx, this.masterGain, 0.6);

        this.melodyTrack.setInstrument('sine');
        this.harmonyTrack.setInstrument('sine');
        this.bassTrack.setInstrument('sine');
        this.drumTrack.setInstrument('std');
    }

    // Generalized Trigger Function used by both Realtime and Offline
    triggerBeat(ctx, time, beatIndex, tracks, state) { // state = { genre, tempo, chords, currentChordIndex }
        const step = beatIndex % 8;
        const isBarStart = (step === 0);

        if (isBarStart) {
            // Update chord index in STATE object (passed by ref or handled)
            // Note: In offline mode, we need to manually track chord index progression.
            // But state.currentChordIndex passed here might be static if not careful.
            // Better to calculate chord index from beatCount or pass updated index.
            // ACTUALLY: Let's pass a mutable state object.
        }

        // We'll calculate chord index based on 'beatIndex' to be pure.
        // 1 Bar = 8 steps.
        const barIndex = Math.floor(beatIndex / 8);
        const chordIndex = barIndex % state.chords.length;
        const currentChord = state.chords[chordIndex];

        // -- Drums --
        if (state.genre === 'chill' || state.genre === 'ambient') {
            if (step === 0) this.triggerDrum(ctx, time, 'kick', tracks.drum);
            if (step === 4) this.triggerDrum(ctx, time, 'snare', tracks.drum);
            if ((beatIndex * 1234.5 % 1) > 0.5) this.triggerDrum(ctx, time, 'hat', tracks.drum); // Psuedo-random deterministic
        } else if (state.genre === 'hop') {
            if (step === 0) this.triggerDrum(ctx, time, 'kick', tracks.drum);
            if (step === 5) this.triggerDrum(ctx, time, 'kick', tracks.drum);
            if (step === 4) this.triggerDrum(ctx, time, 'snare', tracks.drum);
            this.triggerDrum(ctx, time, 'hat', tracks.drum);
        } else if (state.genre === 'dark') {
            if (step === 0 || step === 4) this.triggerDrum(ctx, time, 'kick', tracks.drum);
            if ((beatIndex * 777.7 % 1) > 0.7) this.triggerDrum(ctx, time, 'hat', tracks.drum);
        } else if (state.genre === 'pop') {
            if (step === 0 || step === 4) this.triggerDrum(ctx, time, 'kick', tracks.drum);
            if (step === 2 || step === 6) this.triggerDrum(ctx, time, 'snare', tracks.drum);
            this.triggerDrum(ctx, time, 'hat', tracks.drum);
        }

        // -- Bass -- (Bar start)
        if (isBarStart) {
            const rootName = currentChord[0];
            const freq = (getNote(rootName) || 261.63) / 4;
            const dur = (60 / state.tempo) * 4;
            const synthFn = INSTRUMENTS.bass[tracks.bass.instrument] || INSTRUMENTS.bass.sine;
            synthFn(ctx, tracks.bass.gainNode, freq, time, dur);
        }

        // -- Melody -- (Step 0 and 4)
        // -- Melody & Harmony -- (Step 0 and 4)
        if (step === 0 || step === 4) {
            const chordLen = currentChord.length;
            const noteIndex = Math.floor(Math.random() * chordLen);
            const noteName = currentChord[noteIndex];
            const freq = getNote(noteName) || 440;
            const beatDur = 60 / state.tempo;
            // Deterministic random
            const dur = ((beatIndex * 111.1) % 1) > 0.6 ? beatDur * 4 : beatDur * 2;

            // Melody
            const synthFn = INSTRUMENTS.melody[tracks.melody.instrument] || INSTRUMENTS.melody.sine;
            synthFn(ctx, tracks.melody.gainNode, freq, time, dur);

            // Harmony (Next note in chord = a 3rd above usually)
            if (tracks.harmony) {
                const harmIndex = (noteIndex + 1) % chordLen;
                const harmNote = currentChord[harmIndex];
                let harmFreq = getNote(harmNote) || 440;

                // Mobile Optimization: Shift harmony up an octave for visibility on small speakers
                // and use a rich instrument if pure sine is selected to help it cut through
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

                if (isMobile) {
                    harmFreq *= 2;
                }

                // Harmony usually quieter and same duration
                const harmSynthFn = INSTRUMENTS.melody[tracks.harmony.instrument] || INSTRUMENTS.melody.sine;
                harmSynthFn(ctx, tracks.harmony.gainNode, harmFreq, time, dur);
            }
        }
    }

    // Helper wrappers
    triggerDrum(ctx, time, type, track) {
        const gain = ctx.createGain();
        gain.connect(track.gainNode);
        const kit = track.instrument;

        if (type === 'kick') {
            const osc = ctx.createOscillator();
            let startFreq = 150; let endFreq = 0.01; let decay = 0.5;
            if (kit === 'elect') { startFreq = 200; decay = 0.3; }
            if (kit === 'lofi') { startFreq = 100; decay = 0.2; }
            osc.frequency.setValueAtTime(startFreq, time);
            osc.frequency.exponentialRampToValueAtTime(endFreq, time + decay);
            gain.gain.setValueAtTime(1, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + decay);
            osc.connect(gain); osc.start(time); osc.stop(time + decay);
        } else if (type === 'snare') {
            const bufferSize = ctx.sampleRate * 0.5;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = ctx.createBufferSource(); noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = kit === 'lofi' ? 'lowpass' : 'highpass';
            filter.frequency.value = kit === 'lofi' ? 1000 : 800;
            gain.gain.setValueAtTime(0.5, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
            noise.connect(filter); filter.connect(gain); noise.start(time); noise.stop(time + 0.2);
        } else if (type === 'hat') {
            const bufferSize = ctx.sampleRate * 0.1;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0); // reuse logic usually, but simplified here
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = ctx.createBufferSource(); noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = kit === 'lofi' ? 2000 : 5000;
            gain.gain.setValueAtTime(0.15, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
            noise.connect(filter); filter.connect(gain); noise.start(time); noise.stop(time + 0.05);
        }
    }

    // --- Realtime Scheduling Wrapper ---
    scheduleBeat(time, beatIndex) {
        // Just call the generalized trigger with current REALTIME state
        // We use Math.random() commonly in realtime, but for consistency lets allow the triggerBeat to handle it or override.
        // For now, I'll map `triggerBeat` to use psuedo-randoms based on beatIndex to make offline rendering match realtime feel logic
        // But for realtime, using actual Math.random is fine. 
        // Let's copy the logic from previous `scheduleBeat` into `triggerBeat` and use that.
        // To support `this.melodyTrack` (objects), I passed a `tracks` Map-like object.

        const tracks = {
            melody: this.melodyTrack,
            harmony: this.harmonyTrack,
            bass: this.bassTrack,
            drum: this.drumTrack
        };
        const state = {
            genre: this.genre,
            tempo: this.tempo,
            chords: this.chords
            // currentChordIndex is calculated inside triggerBeat based on beatIndex usually, 
            // OR passed in. `triggerBeat` logic I wrote calculates it from beatIndex.
        };

        // Use a slightly modified triggerBeat that uses actual Random for realtime if desired?
        // Actually, if I want offline export to be a "snapshot" of a possible performance, deterministic is better?
        // But user might want "Loop Export" to be a NEW variation.
        // The `triggerBeat` I wrote uses `Math.floor((beatIndex * 999.9) ...)` which is deterministic for a given beatIndex.
        // This is GOOD for looping (bar 1 and bar 9 will sound identical if math aligns).

        this.triggerBeat(this.ctx, time, beatIndex, tracks, state);
    }

    playMelody(time) { /* Deprecated by triggerBeat refactor */ }
    playBass(time) { /* Deprecated by triggerBeat refactor */ }
    playDrum(time) { /* Deprecated by triggerBeat refactor */ }

    // --- EXPORT ---

    async exportLoop(bars) {
        const AudioContext = window.AudioContext || window.webkitAudioContext; // For constant access if needed
        const OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;

        // Calc duration
        const secondsPerBeat = 60.0 / this.tempo;
        const totalBeats = bars * 4;
        const duration = totalBeats * secondsPerBeat;
        const sampleRate = 44100;

        const offlineCtx = new OfflineAudioContext(2, sampleRate * duration, sampleRate);

        // Setup Offline Master
        // We do NOT use the main this.masterGain etc.
        const offMaster = offlineCtx.createGain();
        offMaster.gain.value = 0.7;
        offMaster.connect(offlineCtx.destination);

        // Create Offline Tracks with same settings as current UI
        const offMelody = new Track(offlineCtx, offMaster, this.melodyTrack.volume);
        offMelody.setInstrument(this.melodyTrack.instrument);

        const offHarmony = new Track(offlineCtx, offMaster, this.harmonyTrack.volume);
        offHarmony.setInstrument(this.harmonyTrack.instrument);

        const offBass = new Track(offlineCtx, offMaster, this.bassTrack.volume);
        offBass.setInstrument(this.bassTrack.instrument);

        const offDrum = new Track(offlineCtx, offMaster, this.drumTrack.volume);
        offDrum.setInstrument(this.drumTrack.instrument);

        const tracks = { melody: offMelody, harmony: offHarmony, bass: offBass, drum: offDrum };
        const state = { genre: this.genre, tempo: this.tempo, chords: this.chords };

        // Schedule ALL beats synchronously
        // 8th notes
        const totalSteps = totalBeats * 2;

        for (let i = 0; i < totalSteps; i++) {
            const time = i * (secondsPerBeat / 2);
            this.triggerBeat(offlineCtx, time, i, tracks, state);
        }

        // Render
        const renderedBuffer = await offlineCtx.startRendering();

        // Convert to WAV
        const wavBlob = audioBufferToWav(renderedBuffer);
        const url = URL.createObjectURL(wavBlob);

        // Download
        const a = document.createElement('a');
        a.href = url;
        a.download = `bgm_loop_${this.genre}_${this.tempo}bpm_${bars}bars.wav`;
        a.click();
    }

    // ... rest of methods (start, stop, etc) ...

    async start() {
        if (this.isPlaying) return;
        this.init();
        if (this.ctx.state === 'suspended') await this.ctx.resume();

        this.isPlaying = true;
        this.nextNoteTime = this.ctx.currentTime + 0.1;
        this.beatCount = 0;
        this.currentChordIndex = 0;
        this.scheduleMusic();
    }

    scheduleMusic() {
        const secondsPerBeat = 60.0 / this.tempo;
        while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
            this.scheduleBeat(this.nextNoteTime, this.beatCount);
            this.nextNoteTime += (secondsPerBeat / 2);
            this.beatCount++;
        }
        if (this.isPlaying) {
            this.timerID = window.setTimeout(this.scheduleMusic.bind(this), this.lookahead);
        }
    }

    stop() {
        this.isPlaying = false;
        if (this.timerID) clearTimeout(this.timerID);
    }
    // ... setTempo, setGenre ...
    setGenre(g) {
        if (GENRES[g]) {
            this.genre = g;
            this.chords = GENRES[g].chords;
            this.setTempo(GENRES[g].tempo);
            this.currentChordIndex = 0;
        }
    }
    setTempo(t) { this.tempo = t; }
    startRecording() { /* ... */
        if (this.isRecording) return;
        this.chunks = [];
        this.mediaRecorder = new MediaRecorder(this.recDest.stream);
        this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);
        this.mediaRecorder.onstop = (e) => {
            const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bgm_gen_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.ogg`;
            a.click();
        };
        this.mediaRecorder.start();
        this.isRecording = true;
    }
    stopRecording() { /* ... */
        if (!this.isRecording) return;
        this.mediaRecorder.stop();
        this.isRecording = false;
    }

    // UI Helpers need to access this.masterGain...
}

// ... existing UI code ...
const engine = new AudioEngine();

// Re-bind stuff
// ...

document.getElementById('export-btn').addEventListener('click', async () => {
    const btn = document.getElementById('export-btn');
    const select = document.getElementById('export-bars');
    const bars = parseInt(select.value);

    const originalText = btn.querySelector('span').textContent;
    btn.querySelector('span').textContent = "Rendering...";
    btn.disabled = true;

    await engine.exportLoop(bars);

    btn.querySelector('span').textContent = originalText;
    btn.disabled = false;
});

// ... Keep existing listeners ...

const playBtn = document.getElementById('play-btn');
const recPlayBtn = document.getElementById('rec-play-btn');
const statusText = document.getElementById('status-text');

function togglePlayButtonState(isPlaying) {
    const iconPath = playBtn.querySelector('path');
    const textSpan = playBtn.querySelector('span');

    if (isPlaying) {
        playBtn.classList.add('active');
        textSpan.textContent = "Stop";
        iconPath.setAttribute('d', "M6 6H18V18H6Z"); // Square Stop Icon
    } else {
        playBtn.classList.remove('active');
        textSpan.textContent = "Start";
        iconPath.setAttribute('d', "M8 5V19L19 12L8 5Z"); // Triangle Play Icon
    }
}

playBtn.addEventListener('click', () => {
    if (!engine.isPlaying) {
        engine.start();
        togglePlayButtonState(true);
        statusText.textContent = "Generating...";
    } else {
        engine.stop();
        if (engine.isRecording) { engine.stopRecording(); recPlayBtn.classList.remove('active'); }
        togglePlayButtonState(false);
        statusText.textContent = "Paused";
    }
});

recPlayBtn.addEventListener('click', async () => {
    if (engine.isPlaying) {
        if (engine.isRecording) engine.stopRecording();
        engine.stop();
        togglePlayButtonState(false);
        recPlayBtn.classList.remove('active');
        statusText.textContent = "Paused";
    } else {
        engine.init();
        if (engine.ctx.state === 'suspended') await engine.ctx.resume();
        engine.startRecording();
        recPlayBtn.classList.add('active');
        engine.start();
        togglePlayButtonState(true);
        statusText.textContent = "Recording & Playing...";
    }
});

document.getElementById('genre-select').addEventListener('change', (e) => { engine.setGenre(e.target.value); updateTempoUI(engine.tempo); });
document.getElementById('tempo-number').addEventListener('change', (e) => { engine.setTempo(parseInt(e.target.value)); updateTempoUI(engine.tempo); });
document.getElementById('tempo-slider').addEventListener('input', (e) => { engine.setTempo(parseInt(e.target.value)); updateTempoUI(engine.tempo); });
document.getElementById('tempo-down').addEventListener('click', () => { engine.setTempo(engine.tempo - 5); updateTempoUI(engine.tempo); });
document.getElementById('tempo-up').addEventListener('click', () => { engine.setTempo(engine.tempo + 5); updateTempoUI(engine.tempo); });
function updateTempoUI(val) { document.getElementById('tempo-number').value = val; document.getElementById('tempo-slider').value = val; }

document.getElementById('inst-melody').addEventListener('change', (e) => { if (engine.melodyTrack) engine.melodyTrack.setInstrument(e.target.value); });
document.getElementById('inst-harmony').addEventListener('change', (e) => { if (engine.harmonyTrack) engine.harmonyTrack.setInstrument(e.target.value); });
document.getElementById('inst-bass').addEventListener('change', (e) => { if (engine.bassTrack) engine.bassTrack.setInstrument(e.target.value); });
document.getElementById('inst-drums').addEventListener('change', (e) => { if (engine.drumTrack) engine.drumTrack.setInstrument(e.target.value); });

document.getElementById('vol-master').addEventListener('input', (e) => { if (engine.masterGain) engine.masterGain.gain.exponentialRampToValueAtTime(parseFloat(e.target.value) || 0.001, engine.ctx.currentTime + 0.1); });
['vol-melody', 'vol-harmony', 'vol-bass', 'vol-drums'].forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => {
        const track = engine[id.replace('vol-', '').replace('drums', 'drum') + 'Track'];
        if (track) track.setVolume(parseFloat(e.target.value));
    });
});
