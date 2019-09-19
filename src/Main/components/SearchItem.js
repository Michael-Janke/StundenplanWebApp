import React from 'react';
import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { ObjectIcon } from './Avatars';
import StarIcon from '@material-ui/icons/Star';
import MailIcon from '@material-ui/icons/Mail';
import StarBorderIcon from '@material-ui/icons/StarBorder';

class SearchItem extends React.PureComponent {
    handleClick = () => {
        this.props.onClick(this.props);
    };

    handleToggleFavorite = () => {
        this.props.toggleFavorite(this.props);
    };

    handleMail = () => {
        window.open(`https://outlook.office.com/?path=/mail/action/compose&to=${this.props.upn}`, '_blank');
    };

    render() {
        const { type, upn, text, secondary, favorite, selected } = this.props;
        return (
            <ListItem dense button selected={selected} onClick={this.handleClick}>
                <ListItemIcon>
                    <ObjectIcon type={type} upn={upn} outline={true} size={40} />
                </ListItemIcon>
                <ListItemText primary={text} secondary={secondary} />
                {this.props.toggleFavorite && (
                    <ListItemSecondaryAction>
                        {secondary && upn && (
                            <IconButton onClick={this.handleMail}>
                                <MailIcon></MailIcon>
                            </IconButton>
                        )}
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
