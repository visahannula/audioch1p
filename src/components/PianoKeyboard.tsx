import React, { type ReactElement } from "react";
import './PianoKeyboard.css';
import { type NoteName, NOTES } from '../keyhandler';

let isPointerKeyDown = false;

type pianoKeyHandler = (event: 'keydown' | 'keyup', note?: NoteName) => void;

function PianoKeyboard({ keyhandler }: { keyhandler: pianoKeyHandler }): ReactElement {
    const handleKeyDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        console.log("UI Keyboard down: ", e);

        if (e.target) {
            isPointerKeyDown = true;
            const el = e.target as HTMLDivElement;
            const innerText = el.innerText;
            if ((NOTES as readonly string[]).includes(innerText)) {
                keyhandler('keydown', innerText as typeof NOTES[number]);
            }
        }
    };

    const handleKeyUp = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();

        if (isPointerKeyDown) {
            isPointerKeyDown = false;
            keyhandler('keyup');
            console.log("UI Keyboard up: ", e);
        }
    };

    const keysElems = NOTES.map((value) => (
        <div
            className={value.includes('#') ? 'key-black' : 'key-white'}
            key={value + 1}
            onPointerDown={handleKeyDown}
            onPointerUp={handleKeyUp}
            onPointerOut={handleKeyUp}
        >
            {value}
        </div>
    ));

    return (
        <div id='container-piano-keyboard'>
            {keysElems}
        </div>
    );
}

export default PianoKeyboard;
export type { pianoKeyHandler };