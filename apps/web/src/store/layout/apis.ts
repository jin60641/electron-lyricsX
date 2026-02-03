import actions from './actions';

export const requestClosePreference = async () =>
  window.bridge.ipc.send(actions.closePreference.type, null);
