declare module '*.png' {
  const value: string;
  export = value;
}

declare global {
  interface Window {
    bridge: {
      storage: Storage,
      copyImage: (imgUrl: string) => void,
      pasteImage: () => Uint8Array,
      ipc: {
        send: (channel: string, data: any) => void,
        receive: (channel: string, cb: (data: any) => void) => void,
      },
    },
  }
}

export {};
