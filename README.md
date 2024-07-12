Very crude monosynth implementation using Web Audio API.

Play with buttons Q to 7 with keyboard.

Live: <https://viha.fi/audioch1p>

By Visa Hannula - 2022

TODO:
=====

- Notes lookup table
- Envelope on/off
- Polyphony
- Channel selection for Audionodes
- JSX -> TSX
- Make components more modular (with usecontext?)
- Save settings (needed for seq)
- Sequencer / repeat
- Add visualizer
- MIDI input
- Midi output
- VS Code launch configuration for mobile device
- Envelope: add curve type (linear, exponential, custom)
- Dynamic build of components for user

---

Project uses Vite for development.

Use scripts:
- start -> start dev
- build -> build for production (./dist)
- 