import React, { useEffect, useState } from 'react';
import { GainEnvelope } from '../audio';
import './GainNodeSetting.css';
import './common-components.css';

type GainNodeSettings = {
    gainNode: GainNode,
    headerName?: string | null,
    envelope?: GainEnvelope,
    children?: React.ReactNode
};

const GainNodeSetting = ({ gainNode, headerName, envelope, children }: GainNodeSettings): React.ReactElement => {
    const [gainValue, setGainValue] = useState(envelope ? envelope.lastGain : gainNode.gain.value);

    useEffect(() => {
        if (envelope) {
            envelope.setFullGain(gainValue); // TODO move to virtual node
        } else {
            gainNode.gain.value = gainValue;
        }
    }, [gainValue, envelope, gainNode.gain])

    return (
        <div className='container-settings-gain'>
            <header>Gain{headerName && `: ${headerName}`}</header>
            <label>Gain: {gainValue}
                <input
                    className='slider-generic'
                    type="range"
                    min="0"
                    max="2"
                    value={gainValue}
                    onChange={(e) => setGainValue(parseFloat(e.target.value))}
                    step="0.01"
                />
            </label>
            {children}
        </div>
    );
}

export default GainNodeSetting;