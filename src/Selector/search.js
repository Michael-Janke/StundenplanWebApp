import { createSelector } from 'reselect';
import searchFilter, { replaceUmlaute } from '../Common/search-filter';
import computeUser from './user';

const getMasterdata = (state) => state.timetable.masterdata;
const getFavorites = (state) => state.user.favorites;
const getCurrentValue = (state, props) => props.value;
const getSelectedFilter = (state, props) => props.filter;

const sortName = (o1, o2) => (o1.LASTNAME || o1.NAME).localeCompare(o2.LASTNAME || o2.NAME);

const computeData = (masterdata, favorites, user) => {
    favorites = favorites || [];
    let data = [
        ...(!user.id
            ? []
            : [
                  {
                      searchString: '',
                      upn: user.upn,
                      type: user.type,
                      id: user.id,
                      favorite: true,
                      text: `${user.firstname} ${user.lastname}`,
                      secondary: '',
                      filterType: '',
                  },
              ]),
        {
            searchString: '',
            type: 'all',
            id: -1,
            favorite: true,
            text: 'Freie Räume',
            secondary: '',
            filterType: 'Raum',
        },
        ...Object.values(masterdata.Class)
            .sort((o1, o2) => !!o2.STUDENT_COUNT - !!o1.STUDENT_COUNT || sortName(o1, o2))
            .map((entry) => {
                let teacher = entry.TEACHER.length
                    ? entry.TEACHER.map((id) => masterdata.Teacher[id])
                          .map((teacher) => (teacher ? teacher.FIRSTNAME[0] + '. ' + teacher.LASTNAME : ''))
                          .join(', ')
                    : undefined;
                let count = entry.STUDENT_COUNT > 0 ? `SuS: ${entry.STUDENT_COUNT}` : undefined;
                let secondary = [count, teacher].filter((a) => !!a).join(', ');
                return {
                    searchString: entry.NAME.toLowerCase() + ' ' + entry.NAME.toLowerCase().replace('0', ''),
                    type: 'class',
                    upn: entry.UPN,
                    id: entry.CLASS_ID,
                    favorite: favorites.indexOf(entry.NAME) >= 0,
                    text: 'Klasse ' + entry.NAME,
                    secondary: secondary || '',
                    filterType: 'Klasse',
                };
            }),
        ...Object.values(masterdata.Room)
            .sort(sortName)
            .map((entry) => ({
                searchString: entry.NAME.toLowerCase(),
                type: 'room',
                id: entry.ROOM_ID,
                favorite: favorites.indexOf(entry.NAME) >= 0,
                text: entry.NAME,
                secondary: 'Raum',
                filterType: 'Raum',
            })),
        ...Object.values(masterdata.Teacher)
            .sort(sortName)
            .map((entry) => ({
                searchString: replaceUmlaute(`${entry.FIRSTNAME} ${entry.LASTNAME}`),
                upn: entry.UPN,
                type: 'teacher',
                id: entry.TEACHER_ID,
                favorite: favorites.indexOf(entry.UPN) >= 0,
                text: entry.FIRSTNAME[0] + '. ' + entry.LASTNAME,
                secondary: 'Lehrer',
                filterType: 'Lehrer',
            })),
        ...Object.values(masterdata.Student)
            .sort(sortName)
            .map((entry) => ({
                searchString: replaceUmlaute(
                    `${entry.FIRSTNAME} ${entry.LASTNAME} ` + (masterdata.Class[entry.CLASS_ID] || {}).NAME
                ),
                upn: entry.UPN,
                type: 'student',
                id: entry.STUDENT_ID,
                favorite: favorites.indexOf(entry.UPN) >= 0,
                text: entry.FIRSTNAME + ' ' + entry.LASTNAME,
                secondary: 'Schüler (' + (masterdata.Class[entry.CLASS_ID] || {}).NAME + ')',
                filterType: 'Schüler',
            })),
    ];
    return data;
};

const getData = createSelector(getMasterdata, getFavorites, computeUser, computeData);

const getSearchResult = (data, value, selectedFilter) => {
    return data
        .filter((obj) => selectedFilter || value !== '' || obj.favorite)
        .filter((obj) => !selectedFilter || obj.filterType === selectedFilter)
        .filter((obj) => value === '' || searchFilter(value, obj.searchString));
};

const makeGetSearchResult = () => {
    return createSelector(getData, getCurrentValue, getSelectedFilter, getSearchResult);
};

export default makeGetSearchResult;
