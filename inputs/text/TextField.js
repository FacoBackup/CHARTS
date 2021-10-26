import styles from './styles/Input.module.css'
import React, {useCallback, useMemo, useState} from 'react'
import InputMask from 'react-input-mask'
import LocalePT from '../shared/LocalePT'
import PropTypes from "prop-types";
import ParseCurrency from "./methods/ParseCurrency";
import shared from '../shared/Shared.module.css'


export default function TextField(props) {
    const lang = LocalePT
    const [maskStartWidth, setMaskStartWidth] = useState(32)
    const [maskEndWidth, setMaskEndWidth] = useState(32)

    const maskStartRef = useCallback(node => {
        if (node !== null) {
            setMaskStartWidth(node.getBoundingClientRect().width + 8)
        }
    }, [])
    const maskEndRef = useCallback(node => {
        if (node !== null) {
            setMaskEndWidth(node.getBoundingClientRect().width + 8)
        }
    }, [])
    const content = (value) => (

            <input
                disabled={props.disabled}
                placeholder={props.placeholder}
                data-mask-end={props.maskEnd}
                data-mask-start={props.maskStart}
                type={props.type !== 'password' ? props.type : (!props.visible ? 'password' : 'text')}
                value={value}
                className={styles.inputContainer}
                style={{
                    height: props.size === 'small' ? '36px' : '56px',
                    paddingLeft: props.maskStart ? maskStartWidth + 'px' : undefined,
                    paddingRight: props.maskEnd ? maskEndWidth : undefined
                }}
                onChange={e => {
                    let data = e.target.value
                    if (props.type === 'number' && props.floatFilter)
                        data = ParseCurrency(e.target.value)

                    props.handleChange({target: {value: data}})
                }}
                maxLength={props.maxLength}
            />

    )
    const getField = () => {
        switch (true) {
            case !props.mask:
                return (
                    <div style={{width: '100%', position: 'relative'}}>
                        {content(props.value ? props.value : '')}
                    </div>
                )
            case props.variant === 'area':
                return (
                    <textarea
                        disabled={props.disabled}
                        placeholder={props.placeholder}
                        value={props.value ? props.value : ''}
                        className={styles.inputContainer}
                        style={{
                            background: props.disabled ? 'white' : undefined,
                            border: props.disabled ? '#ecedf2 1px solid' : undefined,
                            boxShadow: props.disabled ? 'none' : undefined,
                            resize: 'vertical'
                        }}
                        onChange={props.handleChange}
                        maxLength={props.maxLength}
                    />
                )
            case props.mask && props.mask !== 'currency':
                return (
                    <InputMask
                        mask={props.mask} maskPlaceholder={''}
                        value={props.value ? props.value : ''} alwaysShowMask={false}
                    >
                        {event =>
                            <div style={{width: '100%', position: 'relative'}}>
                                {content(event.value)}
                            </div>
                        }
                    </InputMask>
                )
            default:
                return null
        }
    }
    const color = useMemo(() => {
        if (props.colorVariant === 'secondary')
            return shared.secondaryVariant
    }, [])
    return (
        <div
            style={{
                width: props.width,
                height: 'auto',
                display: 'grid',
                alignItems: props.value ? 'unset' : 'flex-start',
                gap: '4px',
                overflow: 'visible'
            }}
        >
            <div
                className={shared.labelContainer}
                style={{
                    visibility: (props.value !== undefined && props.value !== null && props.value.length > 0) || props.type === 'time' || props.type === 'number' ? 'visible' : 'hidden',
                    opacity: (props.value !== undefined && props.value !== null && props.value.length > 0) || props.type === 'time' || props.type === 'number' ? '1' : '0',
                    transition: 'visibility 0.2s ease,opacity 0.2s ease'
                }}
            >
                {props.label}
            </div>
            <div className={[color, shared.wrapper].join(' ')} disabled={props.disabled}>
                {getField()}
            </div>

            <div className={shared.alertLabel}
                 style={{
                     color: (props.value === null || !props.value || props.value.length === 0) ? '#ff5555' : '#262626',
                     visibility: props.required ? 'visible' : 'hidden',
                     display: props.noMargin && !props.required ? 'none' : undefined
                 }}>{lang.required}
            </div>

        </div>
    )
}

TextField.propTypes = {
    width: PropTypes.string,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    required: PropTypes.bool,

    mask: PropTypes.string,

    maxLength: PropTypes.number,
    disabled: PropTypes.bool,
    variant: PropTypes.oneOf([
        'default',
        'area'
    ]),
    type: PropTypes.oneOf(['number', 'text', 'password']),

    maskStart: PropTypes.any,
    maskEnd: PropTypes.any,
    floatFilter: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'default']),
    noMargin: PropTypes.bool,
    colorVariant: PropTypes.oneOf(['default', 'secondary'])
}
