import React, { useCallback, useEffect, useState } from 'react';
import './FilterNodeSetting.css';
import './common-components.css';

const FilterNodeSetting = ({ filterNode, headerName }: { filterNode: BiquadFilterNode, headerName: string }) => {
    //console.log('FilterNode: ', filterNode);
    console.log(`FilterNode Freq: ${filterNode.frequency.value}, Type: ${filterNode.type}, Detune: ${filterNode.detune.value}, Q: ${filterNode.Q.value}`);

    const [freqValue, setFreqValue] = useState(filterNode.frequency.value);
    const [detuneValue, setDetuneValue] = useState(filterNode.detune.value / 100); // TODO: control this in the virtual node
    const [filterType, setFilterType] = useState(filterNode.type);
    const [qValue, setQValue] = useState(filterNode.Q.value);

    const onChangeFreq: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setFreqValue(parseFloat(e.target.value));
        filterNode.frequency.value = freqValue;
    }
    const onChangeDetune: React.ChangeEventHandler<HTMLInputElement> = (e) => setDetuneValue(parseFloat(e.target.value));
    const onChangeQ: React.ChangeEventHandler<HTMLInputElement> = (e) => setQValue(parseFloat(e.target.value));
    const onChangeFilterType: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => setFilterType(e.target.value as BiquadFilterType), [filterType]
    );

    /*
    useEffect(() => {
        filterNode.frequency.value = freqValue;
    }, [freqValue, filterNode])
    */
    useEffect(() => {
        filterNode.detune.value = detuneValue * 100; // TODO: control this in the virtual node
    }, [detuneValue, filterNode])

    useEffect(() => {
        filterNode.Q.value = qValue;
    }, [qValue, filterNode])

    useEffect(() => {
        filterNode.type = filterType;
    }, [filterType, filterNode])

    return (
        <div className='container-filter'>
            <header>Filter: {headerName}</header>
            <form>
                <label>Frequency: {freqValue}
                    <input
                        className='slider-generic'
                        type="range"
                        min="0"
                        max="15000"
                        value={freqValue}
                        onChange={onChangeFreq}
                        step="1"
                    />
                </label>
                <label>Detune: {detuneValue}
                    <input
                        className='slider-generic'
                        type="range"
                        min="-12"
                        max="12"
                        value={detuneValue}
                        onChange={onChangeDetune}
                        step="1"
                    />
                </label>
                <label>Q: {qValue}
                    <input
                        className='slider-generic'
                        type="range"
                        min="0"
                        max="50"
                        value={qValue}
                        onChange={onChangeQ}
                        step="0.1"
                    />
                </label>
                <div className='container-radio'>
                    <span>Filter type: </span>
                    <SelectFilterType
                        onChange={onChangeFilterType}
                        selectedType={filterType}
                        headerName={headerName}
                    />
                </div>
            </form >
        </div >
    );
}

const biquadFilterTypes: BiquadFilterType[] = [
    "lowpass",
    "highpass",
    "bandpass",
    "lowshelf",
    "highshelf",
    "peaking",
    "notch",
    "allpass"
] as const;

const SelectFilterType = ({ onChange, selectedType, headerName }: {
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    selectedType: BiquadFilterType,
    headerName: string
}) => {
    return biquadFilterTypes.map((value, index) => (
        <label
            className='label label-for-radio'
            htmlFor={value + index}
            key={value + index + headerName}
        >{value.toUpperCase()}
            <input
                onChange={onChange}
                checked={value === selectedType ? true : false}
                className='radio radio-filtertype'
                type="radio"
                value={value}
                id={value + index}
                name="filtertype"
            />
        </label>
    ));
}

export default FilterNodeSetting;