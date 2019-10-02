import { useEffect } from 'react';

export default function useKeyPress(callback) {
    // Add event listeners
    useEffect(() => {
        window.addEventListener('keydown', callback);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', callback);
        };
    }, [callback]);
}
