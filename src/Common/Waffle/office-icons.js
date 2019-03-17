import React from 'react';
import TextSmsIcon from '@material-ui/icons/Textsms';
import OneNoteIcon from '../icons/OneNote';
import OutlookIcon from '../icons/Outlook';
import TeamsIcon from '../icons/Teams';
import OneDriveIcon from '../icons/OneDrive';
import ExcelIcon from '../icons/Excel';
import PowerPointIcon from '../icons/PowerPoint';
import WordIcon from '../icons/Word';

export default {
    Stundenplan: {
        color: '#00593b',
        icon: Icon(require('../icons/icon.png')),
        link: '/',
        router: true,
    },
    InfoTafel: {
        color: '#00233a',
        icon: TextSmsIcon,
        link: '/posts',
        router: true,
    },
    Outlook: {
        color: '#0078d7',
        icon: OutlookIcon,
        link: 'https://outlook.office365.com/',
    },
    OneDrive: {
        color: '#0078d7',
        icon: OneDriveIcon,
        link: 'https://wgmail-my.sharepoint.com/',
    },
    Word: {
        color: 'rgb(43, 87, 154)',
        icon: WordIcon,
        link: 'https://www.office.com/launch/word?auth=2',
    },
    Excel: {
        color: 'rgb(33, 115, 70)',
        icon: ExcelIcon,
        link: 'https://www.office.com/launch/excel?auth=2',
    },
    PowerPoint: {
        color: 'rgb(183, 71, 42)',
        icon: PowerPointIcon,
        link: 'https://www.office.com/launch/powerpoint?auth=2',
    },
    OneNote: {
        color: '#771aaa',
        icon: OneNoteIcon,
        link: 'https://www.onenote.com/notebooks?auth=2',
    },
    Teams: {
        color: '#6264a7',
        icon: TeamsIcon,
        link: 'https://teams.microsoft.com/_',
    },
    Homepage: {
        color: 'black',
        icon: Icon(require('../icons/logoicon.png'), {
            filter: 'invert(100%)',
            WebkitFilter: 'invert(100%)',
        }),
        link: 'https://www.wolkenberg-gymnasium.de/',
    },
    'InfoTafel alt': {
        color: 'black',
        icon: Icon(require('../icons/logoicon.png'), {
            filter: 'invert(100%)',
            WebkitFilter: 'invert(100%)',
        }),
        link: 'https://www.wolkenberg-gymnasium.de/InfoTafel/',
    },
};

function Icon(source, style) {
    return props => {
        return (
            <img
                alt="wolkenberg"
                src={source}
                style={{
                    ...style,
                    width: 24,
                }}
            />
        );
    };
}
