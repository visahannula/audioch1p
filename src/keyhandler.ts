// Canvas testing: https://jsfiddle.net/my54k8qr/9/

const noteFreqValues = {
    // octave 4
    // TODO: make freqs as array of octaves
    "c": 261.63,
    "c#": 277.18,
    "d": 293.66,
    "d#": 311.13,
    "e": 329.63,
    "f": 349.23,
    "f#": 369.99,
    "g": 392.00,
    "g#": 415.30,
    "a": 440.00,
    "a#": 466.16,
    "b": 493.88
};

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

const kbKeysToNote = {
    'q': 'C',
    '2': 'C#',
    'w': 'D',
    '3': 'D#',
    'e': 'E',
    'r': 'F',
    '5': 'F#',
    't': 'G',
    '6': 'G#',
    'y': 'A',
    '7': 'A#',
    'u': 'B',
} as const;

type KbKeys = keyof typeof kbKeysToNote;
type NoteName = typeof kbKeysToNote[KbKeys];


/**
 * Convert note to frequency
 * @param note 
 * @param octave 
 * @returns pitch frequency
 */
function getPitch(note: typeof NOTES[number], octave?: number): number {
    if (!octave) octave = 4;
    // ("A", 4) => 440
    // multiply by 2^(1/12) N times to get N steps higher
    const step = NOTES.indexOf(note);
    const power = Math.pow(2, (octave * 12 + step - 57) / 12);
    return 440 * power;
}

/**
 * Get keyboard key from event, return note or null
 * @param e Keyboard event
 * @param octave 
 * @returns notename
 */
const keyToNoteName = (e: KeyboardEvent): NoteName | null => {
    //console.log("Keypress: ", e.key);
    //console.log("Canceable? ", e.cancelable);
    const key = e.key.toLowerCase()

    if (key in kbKeysToNote) {
        return kbKeysToNote[key as KbKeys] as NoteName;
    }
    console.log('No key set.');
    return null;
}

export { keyToNoteName, noteFreqValues, NOTES, getPitch };
export type { NoteName };
