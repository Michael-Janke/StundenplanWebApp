import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import StarIcon from '@material-ui/icons/Star';
import FilterIcon from '@material-ui/icons/FilterList';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import useKeyPress from '../../Common/hooks/useKeyDown';

const useStyles = makeStyles((theme) => ({
    filter: {
        top: 0,
        position: 'sticky',
        backgroundColor: theme.palette.background.paper,
        zIndex: 1,
    },
}));

const FilterBar = ({ small, filter, onChange }) => {
    const classes = useStyles();
    const filterOptions = ['Lehrer', 'Schüler', 'Raum', 'Klasse'];
    useKeyPress((e) => {
        if (e.keyCode === 37 || e.key === 'ArrowLeft') {
            const i = Math.max(filterOptions.indexOf(filter) - 1, -1);
            onChange(filterOptions[i] || '');
        }
        if (e.keyCode === 39 || e.key === 'ArrowRight') {
            const i = Math.min(filterOptions.indexOf(filter) + 1, filterOptions.length - 1);
            onChange(filterOptions[i] || '');
        }
    });
    return (
        <ListItem className={classes.filter}>
            {!small && (
                <ListItemIcon>
                    <FilterIcon />
                </ListItemIcon>
            )}
            <ListItemText>
                <ToggleButtonGroup
                    exclusive
                    size={small ? 'small' : 'medium'}
                    value={filter || ''}
                    onChange={(e, value) => onChange(value)}
                >
                    <ToggleButton key={''} value={''}>
                        <StarIcon></StarIcon>
                    </ToggleButton>
                    {filterOptions.map((type) => (
                        <ToggleButton key={type} value={type}>
                            {type}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </ListItemText>
        </ListItem>
    );
};

export default FilterBar;
