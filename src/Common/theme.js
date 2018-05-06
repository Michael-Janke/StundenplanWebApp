import { createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
export default (themeType) =>
    createMuiTheme({
        palette: {
            type: themeType,
            primary: blue,
        },
    });