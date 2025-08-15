// Types for managing kind status in the new system

export type KindStatusType = 'enabled' | 'disabled' | 'allowed-unregistered' | 'blocked-unregistered';

export interface KindStatus {
  icon: string;
  status: KindStatusType;
  statusText: string;
  canToggle: boolean;
  info?: string;
}

export interface KindInfo {
  kind: number;
  kindString: string;
  description: string;
  isRegistered: boolean;
  isEnabled: boolean;
  status: KindStatus;
}

// Helper function type definitions
export type IsRegisteredKindFunc = (kind: number, registeredKinds: number[]) => boolean;
export type IsKindEnabledFunc = (kind: string, kindWhitelist: string[]) => boolean;
export type GetKindStatusFunc = (kind: number, settings: {
  allowUnregisteredKinds: boolean;
  registeredKinds: number[];
  kinds: string[];
}) => KindStatus;