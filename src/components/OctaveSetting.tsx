import React, { useEffect, useState } from "react";
import { VOscillatorNode } from "../audio";
import './common-components.css';

function OctaveSetting({ oscillatorNode }: { oscillatorNode: VOscillatorNode }): React.ReactElement {
    const [octave, setOctave] = useState(oscillatorNode.octave);

    useEffect(() => {
        oscillatorNode.octave = octave;
    }, [octave, oscillatorNode]);

    return (
        <>
            <label className="label">Octave: {octave}
                <input
                    className='slider-generic'
                    type="range"
                    min="1"
                    max="8"
                    value={octave}
                    onChange={e => setOctave(e.target.valueAsNumber)}
                    step="1"
                />
            </label>
        </>
    )
}

export { OctaveSetting as default };