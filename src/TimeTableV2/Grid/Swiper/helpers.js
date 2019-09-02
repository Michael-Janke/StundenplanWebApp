import { useRef, useState, useEffect } from 'react';

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