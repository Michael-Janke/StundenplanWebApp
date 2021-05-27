import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/styles';
import { lighten } from '@material-ui/core/styles';

const BorderLinearProgress = withStyles({
    root: {
        height: 8,
        backgroundColor: lighten('#ff6c5c', 0.5),
    },
    bar: {
        backgroundColor: '#ff6c5c',
    },
})(LinearProgress);

export default function ReadProgress({ time = 20 * 1000, onFinished }) {
    const [completed, setCompleted] = React.useState(0);

    React.useEffect(() => {
        const startTime = new Date().getTime();
        function progress() {
            let p = ((new Date().getTime() - startTime) / time) * 100;
            if (p >= 100) {
                p = 100;
                onFinished && onFinished();
            }
            setCompleted(p);
        }

        const timer = setInterval(progress, 100);
        return () => {
            clearInterval(timer);
        };
    }, [onFinished, time]);

    return <BorderLinearProgress variant="determinate" value={completed} />;
}
