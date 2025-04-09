// src/types/nostr.ts
export interface NostrProvider {
    getPublicKey: () => Promise<string>;
    signEvent: (event: any) => Promise<any>;
    getRelays: () => Promise<Record<string, { read: boolean; write: boolean }>>;
    nip04?: {
      encrypt?: (pubkey: string, content: string) => Promise<string>;
      decrypt?: (pubkey: string, content: string) => Promise<string>;
    };
    nip44?: {
      encrypt?: (pubkey: string, content: string) => Promise<string>;
      decrypt?: (pubkey: string, content: string) => Promise<string>;
    };
  }
  
  declare global {
    interface Window {
      nostr?: NostrProvider;
    }
  }