import { runWithAdal } from 'react-adal';
import { authContext } from './adalConfig';

runWithAdal(authContext, () => {

  // eslint-disable-next-line
  require('./indexApp.js');

});