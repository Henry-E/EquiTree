export interface EthereumProvider {
  request: (args: { method: string }) => Promise<string[]>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};
