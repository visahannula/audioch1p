import React, { useState } from 'react';
import { Envelope } from '../audio';
import './VirtualEnvelopeNodeSetting.css';

const VirtualEnvelopeNodeSetting = ({ envelope }: { envelope: Envelope }) => {
    const [attack, setAttack] = useState(envelope.attackTime);
    const [decay, setDecay] = useState(envelope.decayTime);
    const [sustain, setSustain] = useState(envelope.sustainLevel);
    const [release, setRelease] = useState(envelope.releaseTime);

    const onChangeAttack = (e: React.ChangeEvent) => {
        if (!e.target) return;
        const t = e.target as HTMLInputElement;

        envelope.attackTime = t.valueAsNumber;
        setAttack(t.valueAsNumber);
    }

    const onChangeDecay = (e: React.ChangeEvent) => {
        if (!e.target) return;
        const t = e.target as HTMLInputElement;

        envelope.decayTime = t.valueAsNumber;
        setDecay(t.valueAsNumber);
    }

    const onChangeSustain = (e: React.ChangeEvent) => {
        if (!e.target) return;
        const t = e.target as HTMLInputElement;

        envelope.sustainLevel = t.valueAsNumber;
        setSustain(t.valueAsNumber);
    }

    const onChangeRelease = (e: React.ChangeEvent) => {
        if (!e.target) return;
        const t = e.target as HTMLInputElement;

        envelope.releaseTime = t.valueAsNumber;
        setRelease(t.valueAsNumber);
    }

    return (
        <div className='container-envelope-settings'>
            <header>Envelope:</header>
            <label>Attack: {attack}s
                <input
                    className='slider-generic'
                    type="range"
                    min="0"
                    max="5"
                    value={attack}
                    onChange={onChangeAttack}
                    step="0.05"
                />
            </label>
            <label>Decay: {decay}s
                <input
                    className='slider-generic'
                    type="range"
                    min="0"
                    max="5"
                    value={decay}
                    onChange={onChangeDecay}
                    step="0.05"
                />
            </label>
            <label>Sustain level: {sustain}
                <input
                    className='slider-generic'
                    type="range"
                    min="0"
                    max="2"
                    value={sustain}
                    onChange={onChangeSustain}
                    step="0.1"
                />
            </label>
            <label>Release: {release}s
                <input
                    className='slider-generic'
                    type="range"
                    min="0"
                    max="5"
                    value={release}
                    onChange={onChangeRelease}
                    step="0.05"
                />
            </label>
        </div>)

}

export default VirtualEnvelopeNodeSetting;
