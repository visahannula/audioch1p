import React, { useState, useEffect } from 'react';
import logo from './mute.svg';
import './App.css';
import OscillatorSetting from './components/OscillatorSetting';
import GainNodeSetting from './components/GainNodeSetting';
import FilterNodeSetting from './components/FilterNodeSetting';
import VirtualEnvelopeNodeSetting from './components/VirtualEnvelopeNodeSetting';
import PianoKeyboard, { pianoKeyHandler } from './components/PianoKeyboard';

import { GainEnvelope, OscillatorEnvelope, VGainNode, VOscillatorNode } from './audio';
import { getPitch, keyToNoteName, NOTES } from './keyhandler';
import OctaveSetting from './components/OctaveSetting';



let audioCtx = new (AudioContext || window.AudioContext)();

let oscillators = [
  new VOscillatorNode(audioCtx.createOscillator()),
  new VOscillatorNode(audioCtx.createOscillator())
]

let gains = [
  new VGainNode(audioCtx.createGain()),
  new VGainNode(audioCtx.createGain())
]

let filters = [
  audioCtx.createBiquadFilter()
]

let mainGain = new VGainNode(audioCtx.createGain());
mainGain.gain = 0.5;

// connect oscillators to gains
const oscStartTime = audioCtx.currentTime + 1;
oscillators.forEach((oscNode, index) => {
  oscNode.audioNode.connect(gains[index].audioNode);
  oscNode.frequency = 0;
  oscNode.audioNode.start(oscStartTime);
});

// connect gains to context destination
gains.forEach(gainNode => {
  gainNode.audioNode.connect(filters[0]);
  gainNode.gain = 0.5;
});



// some setup
filters[0].type = 'allpass';
filters[0].connect(mainGain.audioNode);
console.log("Created filter: ", filters[0]);

oscillators[0].audioNode.type = 'square';
oscillators[1].audioNode.type = 'sawtooth';


mainGain.audioNode.connect(audioCtx.destination);

// create multi oscillator freq tuner
//let oscFreqsSetter = new MultiSetter([oscillators[0].frequency, oscillators[1].frequency]);

const gainEnvelope = new GainEnvelope(audioCtx, gains[0].audioNode); // TODO enhance virtual nodes for more control of last values
const gain2Envelope = new GainEnvelope(audioCtx, gains[1].audioNode);

const oscillator1Envelope = new OscillatorEnvelope(audioCtx, oscillators[0].audioNode);
const oscillator2Envelope = new OscillatorEnvelope(audioCtx, oscillators[1].audioNode);

/**
 * Program
 */
const keyNoteOn = (note: string) => {
  if (!(NOTES as readonly string[]).includes(note)) return;

  console.log("Note on: ", note);

  const freqOsc1 = getPitch(note.toLocaleUpperCase() as typeof NOTES[number], oscillators[0].octave);
  const freqOsc2 = getPitch(note.toLocaleUpperCase() as typeof NOTES[number], oscillators[1].octave);

  if (freqOsc1 && freqOsc2) {
    // oscFreqsSetter.setValue(freq);
    const time = audioCtx.currentTime;
    oscillator1Envelope.start(freqOsc1, time);
    oscillator2Envelope.start(freqOsc2, time);
    gainEnvelope.start(time);
    gain2Envelope.start(time);
  }
}

const keyNoteOff = () => {
  const time = audioCtx.currentTime;

  gainEnvelope.release(time);
  gain2Envelope.release(time);
  oscillator1Envelope.release(time);
  oscillator2Envelope.release(time);
}

const onScreenPianoHandler: pianoKeyHandler = (event: string, note?: string) => {
  if (note && event === 'keydown') {
    console.log("Pointer down", event);
    keyNoteOn(note);
  }

  if (event === 'keyup') {
    keyNoteOff();
  }
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.repeat) {
    e.preventDefault();
    return;
  }

  const note = keyToNoteName(e);
  if (note) keyNoteOn(note);
}

const onKeyUp = (e: KeyboardEvent) => {
  if(keyToNoteName(e)) keyNoteOff(); // do not release if unknown key
}



/**
 * Main App to render the page
 * @returns JSX.Element
 */
function App(): JSX.Element {
  console.log("Context state: ", audioCtx);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Audiosh1t</p>
      </header>

      <AudioContextState audioContext={audioCtx}></AudioContextState>
      <div className="settings-container">
        <OscillatorSetting oscillator={oscillators[0]} headerName="1">
          <OctaveSetting oscillatorNode={oscillators[0]} />
          <VirtualEnvelopeNodeSetting envelope={oscillator1Envelope}></VirtualEnvelopeNodeSetting>
          <GainNodeSetting gainNode={gains[0].audioNode} envelope={gainEnvelope}>
            <VirtualEnvelopeNodeSetting envelope={gainEnvelope}></VirtualEnvelopeNodeSetting>
          </GainNodeSetting>
        </OscillatorSetting>

        <OscillatorSetting oscillator={oscillators[1]} headerName="2">
          <OctaveSetting oscillatorNode={oscillators[1]} />
          <VirtualEnvelopeNodeSetting envelope={oscillator2Envelope}></VirtualEnvelopeNodeSetting>
          <GainNodeSetting gainNode={gains[1].audioNode} envelope={gain2Envelope}>
            <VirtualEnvelopeNodeSetting envelope={gainEnvelope}></VirtualEnvelopeNodeSetting>
          </GainNodeSetting>
        </OscillatorSetting>

        <FilterNodeSetting filterNode={filters[0]} headerName="main"></FilterNodeSetting>

        <GainNodeSetting gainNode={mainGain.audioNode} headerName="main"></GainNodeSetting>
      </div>

      <PianoKeyboard keyhandler={onScreenPianoHandler}></PianoKeyboard>

      <footer className='App-footer'>
        <p>Use QWERTYU to play with oscillator frequency.</p>
        <small>Created by Visa Hannula, 2022, viha.fi/audiosh1t</small>
      </footer>
    </div>
  );
}

/**
 * Audiocontext state and control of it
 * 
 * @param AudioContext audio context which is being followed
 * @returns JSX.Element
 */
function AudioContextState({ audioContext }: { audioContext: AudioContext }): JSX.Element {
  let [audioState, setAudioState] = useState(() => audioContext.state);

  useEffect(() => {
    function handleCtxStateChange(this: AudioContext, ev: Event) {
      if (audioContext && ev.target) {
        console.log("AudioContext state change: ", this.state);
        setAudioState(this.state);
      }
    }
 
    const handleVisibilityChange = () => {
      console.log("Visibility change: ", document.visibilityState);
      if (audioContext) {
        setAudioState(() => audioContext.state);
      } else {
        alert("No audiocontext!");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange, false);
    audioCtx.addEventListener("statechange", handleCtxStateChange, false);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange, false);
      audioCtx.addEventListener("statechange", handleCtxStateChange, false);
    }
  }, [audioContext]);

  const toggleAudioState = () => {
    audioState === 'suspended' ? audioContext.resume() : audioContext.suspend();
  }

  return (
    <div onClick={toggleAudioState} className='audiostate-info'>Audio state:
      <span className={'audiostate-' + audioState}> {audioState}</span>
      {audioState !== 'running' ? ' ▶' : ' ⏹'}
    </div>
  );
}

export default App;
