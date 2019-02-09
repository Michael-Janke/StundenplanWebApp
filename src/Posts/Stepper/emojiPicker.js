import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';

import EmojiconIcon from '@material-ui/icons/Face';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import { Popover, Button, withStyles, TextField } from '@material-ui/core';

import Grid from 'react-virtualized/dist/commonjs/Grid'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
const styles = theme => ({
    grid: {
    },
    button: {
        fontSize: '1rem',
    },
    tab: {
        minWidth: 0,
        flex: 1,
        fontSize: '1rem',
    }
});

function getCharFromEmoji(entry) {
    return String.fromCodePoint(...entry.u.split('-').map(s => parseInt(s, 16)));
}

function Emoji({ entry }) {
    let emoji = getCharFromEmoji(entry);
    return <span role="img" dangerouslySetInnerHTML={{ __html: emoji }}></span>
}

class EmojiPicker extends React.Component {

    state = {
        anchorEl: null,
        emojiData: null,
        columnCount: 4,
        filter: null,
        search: "",
    };



    handleChange = (e, value) => {
        this.setState({ filter: value, filtered: this.filter(value, this.state.emojiData) });
    }

    filter(category, data, value = "") {
        if (value || !category) {
            value = value.toLowerCase();
            return Object.values(data.emojis).filter(entry => entry.n.indexOf(value) !== -1)
        } else {
            const filtered = category.members.map(id => data.emojis[id]);
            return filtered;
        }
    }

    componentDidUpdate() {
        if (this.state.anchorEl && !this.state.emojiData)
            import("./emojis.json").then(data => {
                const value = data.categories[0];
                this.setState({ emojiData: data, filter: value, filtered: this.filter(value, data) });
            });
    }


    handleClick = event => {
        event.preventDefault();
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleKey = event => {
        const value = event.target.value
        this.setState({
            search: value,
            filtered: this.filter(this.state.filter, this.state.emojiData, value),
        });
    }

    renderCell = ({ columnIndex, rowIndex, isScrolling, key, style }) => {
        const index = columnIndex + (this.state.columnCount * rowIndex);
        const { classes } = this.props;
        const entry = this.state.filtered[index];

        return (
            <div key={key} style={style}>
                <Button className={classes.button} onClick={() => this.props.onEmojiSelected(getCharFromEmoji(entry))}>
                    <Emoji entry={entry} />
                </Button>
            </div>
        );
    }

    renderNoRows = () => {
        return (
            <div>
                No Rows
            </div>
        )
    }


    render() {
        const { anchorEl, filtered } = this.state;
        const { classes } = this.props;

        return (
            <React.Fragment>
                <ToggleButton onMouseDown={this.handleClick} value="EMOJI">
                    <EmojiconIcon />
                    <ArrowDropDownIcon />
                </ToggleButton>
                <Popover
                    id="simple-popper"
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <div className={classes.grid}>
                        <TextField value={this.state.search} variant="filled" label="Suchen" fullWidth onChange={this.handleKey} />
                        <Tabs
                            value={this.state.search ? null : this.state.filter}
                            onChange={this.handleChange}
                        >
                            <Tab
                                className={classes.tab}
                                key={0}
                                value={null}
                                icon={<SearchIcon />}
                            >
                            </Tab>
                            {this.state.emojiData && this.state.emojiData.categories.map(category => {
                                const entry = this.state.emojiData.emojis[category.members[0]]
                                return (
                                    <Tab
                                        className={classes.tab}
                                        key={category.name}
                                        value={category}
                                        icon={<Emoji entry={entry}></Emoji>} />
                                )
                            })}
                        </Tabs>
                        <Grid
                            // to fix a weird bug when changing data source
                            // key={this.state.filtered}
                            ref="List"
                            height={200}
                            // overscanRowCount={10}
                            noRowsRenderer={this.renderNoRows}
                            rowCount={filtered ? (Math.floor(filtered.length / this.state.columnCount)) : 0}
                            columnCount={this.state.columnCount}
                            rowHeight={48}
                            columnWidth={64}
                            cellRenderer={this.renderCell}
                            width={264}
                        />
                    </div>
                </Popover>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(EmojiPicker);