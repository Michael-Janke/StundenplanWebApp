import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    componentDidCatch(error, info) {
        this.setState({ error: { error, info } });
    }

    render() {
        const { error } = this.state;
        if (error) {
            return (
                <Redirect to={{
                    pathname: '/error',
                    state: {
                        error: 500,
                        message: `Fehlerberschreibung: ${error.error.message} \nStacktrace: ${error.info.componentStack}`,
                    }
                }} />
            );
        }
        return this.props.children;
    }
}

export default withRouter(ErrorBoundary);