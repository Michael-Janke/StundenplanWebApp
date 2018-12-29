import React from 'react';
import { Typography, Tab, withStyles, Tabs } from '@material-ui/core';
import types from './types';

const styles = theme => ({
    root: {

    }
});



class Choose extends React.Component {
    state = {
        currentTab: types["TEXT"],
    }
    handleNext = () => {
        const prevPost = this.props.post;
        return {
            ...prevPost,
            TYPE: this.state.currentTab.value,
        };
    }

    componentDidMount() {
        this.props.handleNextFunction(this.handleNext);
    }

    handleChange = (e, value) => {
        this.setState({ currentTab: value });
    }

    render() {
        const { currentTab } = this.state;
        return (
            <>
                <Typography variant="h5" paragraph>
                    Wähle aus, was du machen willst.
                </Typography>
                <Tabs
                    value={currentTab}
                    onChange={this.handleChange}
                    indicatorColor="secondary"
                    textColor="secondary"
                    fullWidth
                >
                    {Object.values(types).map(tab => {
                        return (
                            <Tab key={tab.label} label={tab.label} value={tab} icon={<tab.icon />} />
                        )
                    })}
                </Tabs>
                <Typography variant="body1" paragraph>
                    {currentTab.description}
                </Typography>
            </>
        );
    }
}

export default withStyles(styles)(Choose);