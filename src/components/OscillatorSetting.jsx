import React, { useEffect, useMemo, useState } from 'react';
import './OscillatorSetting.css';

const OscillatorSetting = ({ oscillator, headerName, freqSetter = null, children }) => {
    //console.log("OscillatorNode: ", oscillator);
    console.log(`Oscillator Freq: ${oscillator.frequency}, Type: ${oscillator.type}, Detune: ${oscillator.detune}`);

    const [detuneValue, setDetuneValue] = useState(oscillator.detune / 100); // value is in cents
    const [oscType, setOscType] = useState(oscillator.type);

    useEffect(() => {
        oscillator.detune = detuneValue * 100;
    }, [detuneValue, oscillator])


    useEffect(() => {
        oscillator.type = oscType;
    }, [oscType, oscillator])

    const handleZeroDetune = (e) => {
        e.preventDefault();
        setDetuneValue(0);
    }

    const SelectOscTypeMemo = useMemo(() => {
        return (
            <SelectOscType
                onChange={(e) => setOscType(e.target.value)}
                selectedType={oscType}
                className='input-osctype'
                headerName={headerName}
            />)
    }, [oscType, headerName]);


    return (
        <div className='container-osc'>
            <header>Oscillator{headerName ? `: ${headerName}` : ""}</header>

            <form>
                <>{freqSetter ? <FrequencySettingNode oscillator={oscillator} freqSetter={freqSetter} /> : ""}</>

                <label className='label'>Detune: {detuneValue} <button onClick={handleZeroDetune}>Zero</button>
                    <input
                        className='slider-generic'
                        type="range"
                        min="-12"
                        max="12"
                        value={detuneValue}
                        onChange={(e) => setDetuneValue(parseInt(e.target.value))}
                        step="1"
                        name={`slider-detune${headerName}`}
                    />
                </label>

                <div className='container-radio'>
                    <span>Wave: </span>
                    {SelectOscTypeMemo}
                </div>
            </form>
            {children}
        </div>
    );
}

const oscillatorTypes = {
    "sine": "sin",
    "square": "sqr",
    "sawtooth": "saw",
    "triangle": "tri"
};

const SelectOscType = ({ onChange, selectedType, headerName }) => {
    return Object.entries(oscillatorTypes).map(([key, value], index) => (
        <label
            htmlFor={'type' + key + index}
            key={'keylabel' + key + headerName}
            className={`label label-for-radio label-for-value-${key}`}
            onPointerDown={() => onChange({ 'target': { 'value': key } })} // fake event
        >{value.toUpperCase()}
            <input
                className={`radio radio-osctype radio-value-${key}`}
                key={'keyinput' + key + headerName}
                type="radio"
                value={key}
                onChange={onChange}
                name={'type' + key + index}
                checked={key === selectedType ? true : false}
            />
        </label>
    ));
}

const FrequencySettingNode = ({ oscillator, freqSetter }) => {
    const [freqValue, setFreqValue] = useState(oscillator.frequency.value);

    const onChangeFreq = ({ target: { value } }) => {
        console.log("Freqsetter in Oscillator: ", freqSetter);
        freqSetter.setValue(value);
        setFreqValue(value);
    }

    const onZeroFreqPress = () => {
        //oscillator.frequency.setValueAtTime(0, oscillator.context.currentTime);
        onChangeFreq({ target: { value: 0 } });
        setFreqValue(0);
    }

    return (
        <>
            <p>Frequency: {freqValue} <button onClick={onZeroFreqPress}>Zero</button></p>
            <input
                className='slider-freq'
                type="range"
                min="0"
                max="10000"
                value={freqValue}
                onChange={onChangeFreq}
                step="1"
            />
        </>
    )
}




export default OscillatorSetting;
