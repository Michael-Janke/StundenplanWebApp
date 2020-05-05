import React, { useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import Fade from '@material-ui/core/Fade';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Person from '@material-ui/icons/Person';
import Group from '@material-ui/icons/Group';
import Room from '@material-ui/icons/Room';
import SearchIcon from '@material-ui/icons/Search';
import Teacher from './Teacher';
import Classes from './Classes';
import Rooms from './Rooms';
import Students from './Students';
import Search from '../../../Main/components/Search';
import Keyboard from '../../../Main/components/Keyboard';

const useStyles = makeStyles((theme) => ({
    root: { display: 'flex', flexDirection: 'column' },
    growContent: {
        flex: 1,
        position: 'relative',

        '& > *': {
            position: 'absolute',
            top: 0,
            height: '100%',
            width: '100%',
            padding: theme.spacing(1),
            boxSizing: 'border-box',
        },
    },
    tabRoot: {
        minWidth: 100,
    },
}));

function FastSelect({ open }) {
    const classes = useStyles();
    const [filter, setFilter] = useState('student');
    return (
        <Fade className={classes.root} in={open}>
            <Paper square>
                <Tabs
                    variant="fullWidth"
                    onChange={(e, value) => setFilter(value)}
                    value={filter}
                    className={classes.tabs}
                >
                    <Tab icon={<Person />} label="Lehrer" value="teacher" classes={{ root: classes.tabRoot }} />
                    <Tab icon={<Person />} label="Schüler" value="student" classes={{ root: classes.tabRoot }} />
                    <Tab icon={<Group />} label="Klasse" value="class" classes={{ root: classes.tabRoot }} />
                    <Tab icon={<Room />} label="Raum" value="room" classes={{ root: classes.tabRoot }} />
                    <Tab icon={<SearchIcon />} label="Suche" value="search" classes={{ root: classes.tabRoot }} />
                </Tabs>

                <div className={classes.growContent}>
                    <Teacher open={open && filter === 'teacher'} />
                    <Classes open={open && filter === 'class'} />
                    <Rooms open={open && filter === 'room'} />
                    <Students open={open && filter === 'student'} />
                    <Grow in={open && filter === 'search'}>
                        <Search style={{ paddingBottom: 8, flex: 'none' }} open={true} tv={true} Keyboard={Keyboard} />
                    </Grow>
                </div>
            </Paper>
        </Fade>
    );
}

export default FastSelect;
