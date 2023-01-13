
declare global {
  interface Window {
    bridge: {
      storage: Storage,
      platform: string,
      ipc: {
        send: (channel: string, data: any) => void,
        receive: (channel: string, cb: (data: any) => void) => void,
      },
    },
  }
}

export {};
