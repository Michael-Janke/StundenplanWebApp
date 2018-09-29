import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import blue from '@material-ui/core/colors/blue';
export default (themeType) =>
    createMuiTheme({
        typography: {
            fontFamily: `Roboto, system, -apple-system, system-ui, BlinkMacSystemFont, "Helvetica Neue", "Lucida Grande", "Segoe UI", "Ubuntu", "Cantarell", "Fira Sans", sans-serif`,
        },
        palette: {
            type: themeType,
            primary: blue,
        },
    });