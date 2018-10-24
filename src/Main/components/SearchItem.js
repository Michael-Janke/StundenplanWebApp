import React from 'react';
import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { ObjectIcon } from './Avatars';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const isTv = process.env.REACT_APP_MODE === 'tv';

class SearchItem extends React.PureComponent {

    handleClick = () => {
        this.props.onClick(this.props);
    }

    handleToggleFavorite = () => {
        this.props.toggleFavorite(this.props);
    }

    render() {
        const { id, type, upn, text, secondary, favorite } = this.props;
        return (
            <ListItem
                dense
                key={id + type}
                button
                onClick={this.handleClick}
            // {...(i === 0 && { className: classes.listItemSelected })}
            >
                <ListItemIcon>
                    <ObjectIcon
                        type={type}
                        upn={upn}
                    />
                </ListItemIcon>
                <ListItemText inset primary={text} secondary={secondary} />
                {!isTv &&
                    <ListItemSecondaryAction>
                        {secondary &&
                            <IconButton onClick={this.handleToggleFavorite}>
                                {favorite ? <StarIcon /> : <StarBorderIcon />}
                            </IconButton>
                        }
                    </ListItemSecondaryAction>
                }
            </ListItem>
        );
    }
}
export default SearchItem;