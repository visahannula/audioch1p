import React, { useEffect, useMemo, useState } from 'react';
import { VOscillatorNode } from '../audio';
import './OscillatorSetting.css';

type oscillatorSettings = {
    oscillator: VOscillatorNode,
    headerName: string,
    freqSetter?: boolean,
    children?: React.ReactNode
}

const OscillatorSetting = ({ oscillator, headerName, freqSetter = false, children }: oscillatorSettings) => {
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

    const handleZeroDetune: React.PointerEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        setDetuneValue(0);
    }

    const setOscillatorType: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (oscillatorTypes.has(e.target.value)) {
            setOscType(e.target.value as OscillatorType)
        }
    }

    const SelectOscTypeMemo = useMemo(() => {
        return (
            <SelectOscType
                onChange={ setOscillatorType }
                selectedType={oscType}
                headerName={headerName}
            />)
    }, [oscType, headerName]);


    return (
        <div className='container-osc'>
            <header>Oscillator{headerName ? `: ${headerName}` : ""}</header>

            <form>
                <>{freqSetter ? <FrequencySettingNode oscillator={ oscillator } /> : ""}</>

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

const oscillatorTypes = new Map([
    ["sine", "sin"],
    ["square", "sqr"],
    ["sawtooth", "saw"],
    ["triangle", "tri"],
]); 

type oscTypeParams = {
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    selectedType: OscillatorType
    headerName: string
}

const SelectOscType = ({ onChange, selectedType, headerName }: oscTypeParams) => {
    return Array.from(oscillatorTypes).map(([key, value], index) => (
        <label
            htmlFor={'type' + key + headerName + index}
            key={'keylabel' + key + headerName}
            className={`label label-for-radio label-for-value-${key}`}
        >{value.toUpperCase()}
            <input
                className={`radio radio-osctype radio-value-${key}`}
                key={'keyinput' + key + headerName}
                type="radio"
                value={key}
                onChange={onChange}
                name={'type' + key + headerName + index}
                id={'type' + key + headerName + index}
                checked={key === selectedType ? true : false
                }
            />
        </label>
    ));
}

const FrequencySettingNode = ({ oscillator }: {oscillator: VOscillatorNode}) => {
    const [freqValue, setFreqValue] = useState(oscillator.frequency);

    const onChangeFreq: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
        setFreqValue(parseFloat(value));
    }

    const onZeroFreqPress: React.MouseEventHandler<HTMLButtonElement> = () => {
        //oscillator.frequency.setValueAtTime(0, oscillator.context.currentTime);
        //onChangeFreq({ target: { value: 0 } });
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
