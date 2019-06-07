import React from 'react';
import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { ObjectIcon } from './Avatars';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

class SearchItem extends React.PureComponent {
    handleClick = () => {
        this.props.onClick(this.props);
    };

    handleToggleFavorite = () => {
        this.props.toggleFavorite(this.props);
    };

    render() {
        const { type, upn, text, secondary, favorite, selected } = this.props;
        return (
            <ListItem
                dense
                button
                selected={selected}
                onClick={this.handleClick}
                // {...(i === 0 && { className: classes.listItemSelected })}
            >
                <ListItemIcon>
                    <ObjectIcon type={type} upn={upn} />
                </ListItemIcon>
                <ListItemText primary={text} secondary={secondary} />
                {this.props.toggleFavorite && (
                    <ListItemSecondaryAction>
                        {secondary && (
                            <IconButton onClick={this.handleToggleFavorite}>
                                {favorite ? <StarIcon /> : <StarBorderIcon />}
                            </IconButton>
                        )}
                    </ListItemSecondaryAction>
                )}
            </ListItem>
        );
    }
}
export default SearchItem;
