import React from "react";
import './PianoKeyboard.css';
import { NOTES } from '../keyhandler';

export type pianoKeyHandler = (event: 'keydown' | 'keyup', note?: typeof NOTES[number]) => void;

let isPointerKeyDown = false;

function PianoKeyboard({ keyhandler }: { keyhandler: pianoKeyHandler }): JSX.Element {
    const handleKeyDown = (e: React.PointerEvent<HTMLDivElement>) => {
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

    const keysElems = NOTES.map((value, index) => {
        return (
            <div
                className={value.includes('#') ? 'key-black' : 'key-white'}
                key={value + 1}
                onPointerDown={handleKeyDown}
                onPointerUp={handleKeyUp}
                onPointerOut={handleKeyUp}
            >
                {value}
            </div>
        );
    });

    return (
        <div id='container-piano-keyboard'>
            {keysElems}
        </div>
    );
}

export default PianoKeyboard;