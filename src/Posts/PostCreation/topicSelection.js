import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import debounce from 'debounce';

const UNSPLASH_KEY = '89cf4875441cd2ff854a44fce573499a7e8ec2977ebcb2026623d0290e6f47a4';

const styles = theme => ({
    suggestions: { flex: 1, maxHeight: 100, overflow: 'hidden' },
    searchInput: { width: '100%' },
    root: {},
    pictures: {
        overflowY: 'auto',
    },
    picture: {
        flex: 0.5,
        maxWidth: 400,
    },
});

const suggestions = [
    { german: 'Kuchenbasar', english: 'cake' },
    { german: 'Karten', english: 'ticket' },
    { german: 'Information', english: 'information' },
    { german: 'Schüleraustausch', english: 'international' },
    { german: 'Chor', english: 'choir' },
    { german: 'Weihnachten', english: 'Christmas' },
    { german: 'Treffen', english: 'Meeting' },
    { german: 'Spaß', english: 'Fun' },
];

class TopicSelection extends React.Component {
    state = {
        results: [],
        topic: 'cake',
    };

    queryPictures = query => {
        fetch(`https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&client_id=${UNSPLASH_KEY}`)
            .then(data => data.json())
            .then(data => this.setState({ results: data.results, error: false }))
            .catch(() => this.setState({ error: true }));
    };

    componentDidMount() {
        this.queryPictures('cake');
    }

    handleChangeDebounced = debounce(this.queryPictures, 500);
    handleChange = event => {
        this.setState({ topic: event.target.value });
        this.handleChangeDebounced(event.target.value);
    };

    setSuggestion = query => () => {
        this.queryPictures(query);
        this.setState({ topic: query });
    };

    render() {
        const { classes } = this.props;
        const { results, topic } = this.state;
        return (
            <div className={classes.root}>
                <Typography>
                    Wähle ein Thema für dein Beitrag, indem die entweder ein vordefiniertes Thema wählst, ein Stichwort
                    (englisch) eingibst oder ein eigenes Foto hochlädst.
                </Typography>

                <TextField
                    label="Thema (englisch)"
                    className={classes.searchInput}
                    onChange={this.handleChange}
                    value={topic}
                    margin="normal"
                    variant="outlined"
                />
                <div className={classes.suggestions}>
                    {suggestions.map(pair => (
                        <Button key={pair.english} onClick={this.setSuggestion(pair.english)}>
                            {pair.german}
                        </Button>
                    ))}
                </div>

                <div className={classes.pictures}>
                    {results.map(picture => (
                        <img
                            src={picture.urls.small}
                            className={classes.picture}
                            alt={picture.description}
                            key={picture.id}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

TopicSelection.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TopicSelection);
