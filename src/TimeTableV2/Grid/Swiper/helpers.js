import React, { useRef, useState, useEffect } from 'react';
import { useGesture } from 'react-use-gesture';
import { useSpring, useSprings } from 'react-spring';

export function useMeasure(callback, fields) {
    const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 })
    const [bind] = useMeasureCallback((newBounds) => {
        if (fields.some((field) => bounds[field] !== newBounds[field])) {
            set(newBounds);
            callback && callback(newBounds)
        }
    })
    return [bind, bounds]
}

export function useMeasureCallback(callback) {
    const ref = useRef()
    const [ro] = useState(() => new ResizeObserver(([entry]) => {
        callback && callback(entry.contentRect);
    }))
    useEffect(() => {
        if (ref.current) ro.observe(ref.current)
        return () => ro.disconnect()
    }, [ro])
    return [{ ref }];
}


export function Gesture({ onGesture, children, ...other }) {
    const bind = useGesture(onGesture);
    return (
        <div {...bind()} {...other}>
            {children}
        </div>
    )
}

export function Width({ onWidth, children, ...other }) {
    const [bindMeasure] = useMeasureCallback(onWidth);
    return (
        <div {...bindMeasure} {...other}>
            {children}
        </div>
    )
}

export function Springs({ length, getProps, children, onSet }) {
    const [props, set] = useSprings(length, getProps);
    onSet(set);
    return children(props);
}

export function Spring({ children, onSet, getProps }) {
    const [props, set] = useSpring(getProps);
    onSet(set);
    return children(props);
}