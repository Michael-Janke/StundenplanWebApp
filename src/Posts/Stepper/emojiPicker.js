import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';

import EmojiconIcon from '@material-ui/icons/Face';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Popover, Button, withStyles, TextField } from '@material-ui/core';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import Grid from 'react-virtualized/dist/commonjs/Grid'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
const styles = theme => ({
    grid: {
        width: 200,
    },
    button: {
        fontSize: '100%',
    },
    tab: {
        minWidth: 48,
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
        columnCount: 3,
        filter: null,
    };



    handleChange = (e, value) => {
        this.setState({ filter: value, filtered: this.filter(value, this.state.emojiData) });
    }

    filter(category, data) {
        const filtered = category.members.map(id => data.emojis[id]);
        return filtered;
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
                        <TextField variant="filled" label="Suchen"/>
                        <Tabs
                            value={this.state.filter}
                            onChange={this.handleChange}
                            scrollable
                            scrollButtons="on">
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
                        <AutoSizer disableHeight>
                            {({ width }) => (
                                <Grid
                                    // to fix a weird bug when changing data source
                                    key={this.state.filter && this.state.filter.name}
                                    ref="List"
                                    height={200}
                                    overscanRowCount={10}
                                    noRowsRenderer={this.renderNoRows}
                                    rowCount={filtered ? (filtered.length / 3 - 1) : 0}
                                    columnCount={3}
                                    rowHeight={48}
                                    columnWidth={64}
                                    cellRenderer={this.renderCell}
                                    width={width}
                                />)}
                        </AutoSizer>
                    </div>
                </Popover>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(EmojiPicker);