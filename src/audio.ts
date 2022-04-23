class MultiSetter {
    observers: AudioParam[] = [];

    constructor(observers: AudioParam[] = []) {
        this.observers = observers;
    }

    add(newObserver: AudioParam) {
        if (this.observers.includes(newObserver)) {
            console.log("Observer already in list. ", this.observers);
            return;
        }
        this.observers.push(newObserver);
    }

    setValue(value: number) {
        //console.log("Multisetter: Got value to change: ", value);
        //console.log("This observers: ", this.observers);
        this.observers.forEach((observer) => {
            //console.log(`Setting value ${value} to observer[${index}]`, observer);
            observer.value = value;
        });
    }
}


/**
 * Basic envelope type
 * 
 * Has multiple parameters to set.
 * 
 * Attack: The amount of time it takes for the envelop to reach the end of that first stage, usually the peak level.
 * Decay: The amount of time it takes for the envelope to decrease to some specified sustain level
 * Sustain: The level of output while a sustain instruction persists (held note). Measure of level, not time.
 * Release: The time it takes for the output to decrease to zero after the key is released or the sustain instruction ends.
 */
class Envelope {
    audioCtx: AudioContext;
    value: number;

    attackTime = 0.1;
    decayTime = 0.4;
    sustainLevel = 0.5;
    releaseTime = 0.3;

    timeConstant = 3;

    constructor(audioCtx: AudioContext) {
        this.audioCtx = audioCtx;
        this.value = 0;
    }
}


class GainEnvelope extends Envelope {
    audioNode: GainNode;
    lastGain: number;
    fullGainValue: number; // maximum value for gain

    constructor(audioCtx: AudioContext, audioNode: GainNode) {
        super(audioCtx);
        this.audioNode = audioNode;
        this.lastGain = this.audioNode.gain.defaultValue;
        this.fullGainValue = this.audioNode.gain.defaultValue;
    }

    setFullGain(value: number) {
        this.fullGainValue = value;
        this.audioNode.gain.value = value;
    }

    start(currentTime?: number, gain?: number) {
        //console.log("Start envelope. ", this);
        if (this.fullGainValue <= 0) return;

        if (!currentTime) currentTime = this.audioCtx.currentTime;
        this.lastGain = gain || this.audioNode.gain.defaultValue;

        this.audioNode.gain.cancelScheduledValues(currentTime);

        // Attack
        if (this.attackTime === 0) {
            //this.audioNode.gain.setValueAtTime(this.fullGainValue, currentTime); // Attack
            this.audioNode.gain.value = this.fullGainValue;
        } else {
            this.audioNode.gain.setValueAtTime(this.audioNode.gain.value, currentTime);
            this.audioNode.gain.setTargetAtTime(
                this.fullGainValue,
                currentTime,
                this.attackTime / 10
            );
        }

        // Decay
        if (this.decayTime > 0) {
            this.audioNode.gain.setTargetAtTime(this.sustainLevel, currentTime + this.attackTime, this.decayTime / 10);
        }

        // This could be used for non-sustain mode
        //this.audioNode.gain.setTargetAtTime(0.01, currTime + this.attack + this.decay, this.releaseTime);
    }

    release(currentTime?: number, gain?: number) {
        //console.log("Release envelope.", this);
        if (!currentTime) currentTime = this.audioCtx.currentTime;
        this.lastGain = gain || this.audioNode.gain.defaultValue;

        this.audioNode.gain.cancelScheduledValues(currentTime);

        if (this.releaseTime === 0) {
            this.audioNode.gain.setValueAtTime(0.001, 0);
            //this.audioNode.gain.value = 0.0;
        } else {
            this.audioNode.gain.setTargetAtTime(0.001, currentTime, this.releaseTime);
        }


    }
}


class OscillatorEnvelope extends Envelope {
    public audioNode: OscillatorNode;
    lastFreq: number;

    attackTime = 0.0;
    decayTime = 0.1;
    releaseTime = 0.1;
    sustainLevel = 0;
    timeConstant = 3;

    constructor(audioCtx: AudioContext, audioNode: OscillatorNode) {
        super(audioCtx);
        this.audioNode = audioNode;
        this.lastFreq = this.audioNode.frequency.defaultValue;
    }

    start(frequency: number, currentTime?: number) {
        //console.log("Start envelope. ", this);
        if (!currentTime) currentTime = this.audioCtx.currentTime;

        this.audioNode.frequency.cancelScheduledValues(currentTime);

        if (this.attackTime === 0) {
            this.audioNode.frequency.value = frequency;
        } else {
            this.audioNode.frequency.setTargetAtTime(
                frequency,
                currentTime,
                this.attackTime / 8 //Math.pow(this.attackTime, this.timeConstant) / this.timeConstant
            );
        }

        if (this.decayTime > 0) { // Decay
            this.audioNode.frequency.setTargetAtTime(
                frequency + (frequency * this.sustainLevel),
                currentTime + this.attackTime,
                this.decayTime / 8 //Math.pow(this.decayTime, this.timeConstant) / this.timeConstant
            );
        }

        this.lastFreq = frequency;
    }

    release(currentTime?: number, frequency?: number) {
        console.log("Release envelope.", this);
        if (!currentTime) currentTime = this.audioCtx.currentTime;
        if (frequency) this.lastFreq = frequency; // TODO Do something with freq

        this.audioNode.frequency.cancelScheduledValues(currentTime);

        if (this.releaseTime === 0) { // release to zero
            // this.audioNode.frequency.setValueAtTime(0.0, 0);
            this.audioNode.frequency.value = 0;
        } else {
            this.audioNode.frequency.setValueAtTime(
                0,
                currentTime + this.releaseTime
            );
            // this.audioNode.frequency.setTargetAtTime(
            //     0.001,
            //     currentTime,
            //     this.releaseTime / 8
            // );
        }
    }
}


// TODO enhance virtual nodes to support attaching envelopes


class VGainNode {
    private _gain: number = 0.5;
    public audioNode: GainNode;

    constructor(audioNode: GainNode) {
        this.audioNode = audioNode;
    }

    set gain(value: number) {
        this._gain = value;
        this.audioNode.gain.value = value;
    }

    get gain() {
        return this._gain;
    }
}

class VOscillatorNode implements OscillatorOptions {
    private _frequency: number = 0;
    private _currentOctave: number = 4;
    public audioNode: OscillatorNode;

    constructor(audioNode: OscillatorNode) {
        this.audioNode = audioNode;
    }

    set frequency(value: number) {
        this._frequency = value;
        this.audioNode.frequency.value = value;
    }

    get frequency() {
        return this._frequency;
    }

    set type(type: OscillatorType) {
        this.audioNode.type = type;
    }

    get type() { return this.audioNode.type; }

    set detune(value: number) {
        this.audioNode.detune.value = value;
    }

    get detune() {
        return this.audioNode.detune.value;
    }

    set octave(value: number) {
        console.log(`Setting octave to ${value}. `, this);
        this._currentOctave = value;
    }

    get octave() {
        return this._currentOctave;
    }
}


export { MultiSetter, Envelope, GainEnvelope, OscillatorEnvelope, VGainNode, VOscillatorNode };