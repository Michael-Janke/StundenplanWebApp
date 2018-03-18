import chroma from 'chroma-js';
import * as colors from 'material-ui/styles/colors';


export const WEEKDAY_NAMES = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
export const DRAWER_WIDTH = 300;

const colorsArray = ["red", "pink", "purple", "deepPurple", "indigo", "blue", "cyan", "teal", "green", "lime", "yellow", "amber", "orange", "deepOrange", "brown", "blueGrey", "grey"];

export const SUBJECT_COLORS = colorsArray.map(color => colors[color + "600"]);

export const SUBJECTS = ["de", "inf", "en", "sp", "geo", "ph", "la", "ch", "ge", "bio", "ma", "ku", "ds", "mu", "fr", "ru", "pb", "sn", "ler", "rel", "wat"];

export const SUBJECT_COLORS_MAP = {};
SUBJECTS.forEach((subject, i) => {
    SUBJECT_COLORS_MAP[subject] = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
});


export const SUBSTITUTION_MAP = {
    SUBSTITUTION: {
        color: "red",
        name: "Vertretung",
        targets: ['room', 'subject', 'teacher'],
    },
    ASSIGNMENT: {
        color: "yellow",
        name: "Aufgaben"
    },
    ELIMINATION: {
        color: "lime",
        name: "Entfall"
    },
    CLASS_SUBSTITUTION: {
        color: "#a7bef7",
        name: "Klasse absent",
        targets: [],
    },
    ROOM_SUBSTITUTION: {
        color: "blue600",
        backgroundColor: "blue100",
        name: "Raumvertretung",
        targets: ['room']
    },
    INFORMATION: {
        color: "purple",
        name: "Hinweis",
    },
    SWAP: {
        color: "gold",
        name: "Tausch"
    },
    EXTRA_LESSON: {
        color: "fuchsia",
        name: "Zusatzstunde"
    },
    SUPERVISION: {
        color: "grey",
        name: "Mitbetreuung",
        targets: ['teacher']
    },
    REDUNDANCY: {
        color: "lime",
        name: "Freistellung"
    }
};