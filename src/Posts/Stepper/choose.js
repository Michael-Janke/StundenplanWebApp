import React from 'react';
import { Tab, withStyles, Tabs, Paper } from '@material-ui/core';
import types from './types';

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
    },
    content: {
        padding: theme.spacing.unit * 3,
    },
});

class Choose extends React.Component {
    state = {
        currentTab: types['TEXT'],
    };
    static getDerivedStateFromProps(props, state) {
        if (props.post !== state.post) {
            return {
                post: props.post,
                currentTab: types[props.post.TYPE || 'TEXT'],
            };
        }
        return null;
    }

    handleNext = () => {
        const prevPost = this.props.post;
        return {
            ...prevPost,
            TYPE: this.state.currentTab.value,
        };
    };

    componentDidMount() {
        this.props.handleNextFunction(this.handleNext);
    }

    handleChange = (e, value) => {
        this.setState({ currentTab: value });
    };

    render() {
        const { currentTab } = this.state;
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Paper square elevation={0}>
                    <Tabs
                        value={currentTab}
                        onChange={this.handleChange}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="fullWidth"
                    >
                        {Object.values(types).map(tab => {
                            return <Tab key={tab.label} label={tab.label} value={tab} icon={<tab.icon />} />;
                        })}
                    </Tabs>
                    <div className={classes.content}>{currentTab.description}</div>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(Choose);
