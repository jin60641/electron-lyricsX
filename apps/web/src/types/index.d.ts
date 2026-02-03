declare global {
  interface Window {
    bridge: {
      storage: Storage,
      platform: string,
      ipc: {
        send: <T = unknown>(channel: string, data: T) => void,
        receive: <T = unknown>(channel: string, cb: (data: T) => void) => void,
      },
    },
  }
}

export {};
