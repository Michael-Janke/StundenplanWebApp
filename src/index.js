import { runWithAdal } from './Common/Adal/react-adal';
import { authContext } from './Common/Adal/adalConfig';

runWithAdal(authContext, () => {

  // eslint-disable-next-line
  require('./indexReact.js');

});