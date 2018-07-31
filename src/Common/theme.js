import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import blue from '@material-ui/core/colors/blue';
export default (themeType) =>
    createMuiTheme({
        // fontFamily: 'sans-serif',
        palette: {
            type: themeType,
            primary: blue,
        },
    });