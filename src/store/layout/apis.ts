import { getType } from 'typesafe-actions';

import actions from './actions';

export const requestClosePreference = async () => (
  window.bridge.ipc.send(getType(actions.closePreference), null)
);
