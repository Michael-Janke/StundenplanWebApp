import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import BackSpace from '@material-ui/icons/Backspace';

const styles = theme => ({
    row: {
        display: 'flex',
        width: '100%',
    },
    keyboard: {
        display: 'block',
        flexDirection: 'column',
    },
    key: {
        flex: 1,
        minWidth: 0,
    },
});

const Key = props => (
    <Button className={props.className} onClick={props.onPress}>
        {props.name}
    </Button>
);

class Keyboard extends React.PureComponent {
    onKeyPress(key) {
        this.props.onInput(name => name + key);
    }

    onBackPress = () => {
        this.props.onInput(name => name.slice(0, -1));
    };

    render() {
        const { className, classes } = this.props;
        return (
            <div className={className + ' ' + classes.keyboard}>
                <div className={classes.row} key={-2}>
                    {'1234567890'.split('').map((name, i) => (
                        <Key className={classes.key} key={i} onPress={this.onKeyPress.bind(this, name)} name={name} />
                    ))}
                    <Key className={classes.key} onPress={this.onBackPress} name={<BackSpace />} />
                </div>
                {['QWERTZUIOPÜ', 'ASDFGHJKLÖÄ', 'YXCVBNM'].map((row, j) => (
                    <div className={classes.row} key={j}>
                        {row.split('').map((name, i) => (
                            <Key
                                className={classes.key}
                                key={i}
                                onPress={this.onKeyPress.bind(this, name)}
                                name={name}
                            />
                        ))}
                    </div>
                ))}
                <div className={classes.row} key={-1}>
                    <Key className={classes.key} onPress={this.onKeyPress.bind(this, ' ')} name="Leerzeichen" />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Keyboard);
