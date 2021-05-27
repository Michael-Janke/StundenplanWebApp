import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import blue from '@material-ui/core/colors/blue';
export default (themeType) =>
    createMuiTheme({
        typography: {
            fontFamily: `Roboto, system, -apple-system, system-ui, BlinkMacSystemFont, "Helvetica Neue", "Lucida Grande", "Segoe UI", "Ubuntu", "Cantarell", "Fira Sans", sans-serif`,
            useNextVariants: true,
        },
        palette: {
            type: themeType,
            primary: blue,
        },
        overrides: {
            MuiListItemText: {
                primary: {
                    fontSize: '0.875rem',
                },
                secondary: {
                    fontSize: '0.8rem',
                },
            },

            MuiListItemIcon: {},
            MuiListSubheader: {
                root: {
                    fontSize: '0.875rem',
                },
            },
        },
    });
