import {
  indigo,
  grey,
  pink,
  
} from 'material-ui/colors';
import { fade } from 'material-ui/styles/colorManipulator';
import spacing from 'material-ui/styles/spacing';
import { createMuiTheme } from 'material-ui/styles';

const darkBlack = '#101010';
const fullBlack = '#000000';
const white = '#FFFFFF';

export default createMuiTheme({
  spacing: spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: indigo[500],
    primary2Color: indigo[700],
    primary3Color: grey[400],
    accent1Color: pink.A200,
    accent2Color: grey[100],
    accent3Color: grey[500],
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey[300],
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: indigo[500],
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
});