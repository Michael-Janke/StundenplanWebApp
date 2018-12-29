import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import ApproveIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles, Menu, MenuItem, ListItemIcon, ListItemText, Badge } from '@material-ui/core';
import { connect } from 'react-redux';
import moment from 'moment';
import { ObjectIcon } from '../Main/components/Avatars';
import PostDeletionDialog from './PostDeletionDialog';
import { deletePost, editPost } from './actions';
import draftToHtml from 'draftjs-to-html';

const styles = theme => ({
    card: {
        maxWidth: 600,
    },
    media: {
        paddingTop: '56.5%'
    },
    content: {
        fontSize: '100%',
    }
});

class Post extends React.Component {
    state = {
        anchorEl: null,
        deleteOpen: false,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleOpenDelete = () => {
        this.setState({ deleteOpen: true, anchorEl: null });
    }

    handleEdit = () => {
        this.setState({ anchorEl: null, deleteOpen: false });
        this.props.onEdit(this.props.post);
    };
    
    handleApprove = () => {
        this.setState({ anchorEl: null, deleteOpen: false });
        this.props.editPost({...this.props.post, APPROVED: !this.props.post.APPROVED})
    };
    handleClose = () => {
        this.setState({ anchorEl: null, deleteOpen: false });
    };
    handleDelete = () => {
        this.setState({ anchorEl: null, deleteOpen: false });
        this.props.deletePost(this.props.post);
    }

    render() {
        const { anchorEl, deleteOpen } = this.state;
        const { isAdmin, classes, post } = this.props;
        const approved = post.APPROVED;
        const menu = (post.USER_CREATED || isAdmin) && (
            <React.Fragment>
                <IconButton onClick={this.handleClick}>
                    {!isAdmin || approved ? <MoreVertIcon /> :
                        <Badge badgeContent={1} color="primary">
                            <MoreVertIcon />
                        </Badge>
                    }
                </IconButton>
                <Menu
                    id="post-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    { (post.USER_CREATED || isAdmin) &&
                        <MenuItem onClick={this.handleOpenDelete}>
                            <ListItemIcon>
                                <DeleteIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Löschen" />
                        </MenuItem>
                    }
                    { (post.USER_CREATED || isAdmin) &&
                        <MenuItem onClick={this.handleEdit}>
                            <ListItemIcon>
                                <EditIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Editieren" />
                        </MenuItem>
                    }
                        
                    {isAdmin &&
                        <MenuItem onClick={this.handleApprove}>
                            <ListItemIcon>
                                <ApproveIcon />
                            </ListItemIcon>
                            <ListItemText inset primary={approved ? "Sperren" :"Freigeben"} />
                        </MenuItem>
                    }
                </Menu>
                {<PostDeletionDialog
                    open={deleteOpen}
                    handleClose={this.handleClose}
                    handleDelete={this.handleDelete}
                />}
            </React.Fragment>
        );
        const rawContentState = JSON.parse(post.TEXT);

        const markup = draftToHtml(
            rawContentState,
        );

        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <ObjectIcon size={0} upn={post.CREATOR} />
                    }
                    action={menu}
                    title={post.TITLE}
                    subheader={post.DATE_FROM && moment(post.DATE_FROM.date).format("DD. MMMM, YYYY")}
                />
                {/* <CardMedia
                    className={classes.media}
                    image=""
                    title="Contemplative Reptile"
                /> */}
                <CardContent>
                    <div className={classes.content} dangerouslySetInnerHTML={{__html: markup}}/>
                    <div>von {post.CREATOR}</div>
                </CardContent>
                <CardActions className={classes.actions} disableActionSpacing>
                    <IconButton aria-label="Add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="Share">
                        <ShareIcon />
                    </IconButton>
                </CardActions>
            </Card>
        );
    }
}


const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    deletePost: (post) => dispatch(deletePost(post)), 
    editPost: (post) => dispatch(editPost(post)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Post));
