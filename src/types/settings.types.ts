export interface ImageModerationSettings {
  image_moderation_api: string;
  image_moderation_check_interval: number;
  image_moderation_concurrency: number;
  image_moderation_enabled: boolean;
  image_moderation_mode: string;
  image_moderation_temp_dir: string;
  image_moderation_threshold: number;
  image_moderation_timeout: number;
}

export interface ContentFilterSettings {
  content_filter_cache_size: number;
  content_filter_cache_ttl: number;
  content_filter_enabled: boolean;
  full_text_kinds: number[];
}

export interface NestFeederSettings {
  nest_feeder_cache_size: number;
  nest_feeder_cache_ttl: number;
  nest_feeder_enabled: boolean;
  nest_feeder_timeout: number;
  nest_feeder_url: string;
}

export interface OllamaSettings {
  ollama_model: string;
  ollama_timeout: number;
  ollama_url: string;
}

export interface XNostrNitterInstance {
  priority: number;
  url: string;
}

export interface XNostrNitterSettings {
  failure_threshold: number;
  instances: XNostrNitterInstance[];
  recovery_threshold: number;
  requests_per_minute: number;
}

export interface XNostrIntervalSettings {
  follower_update_interval_days: number;
  full_verification_interval_days: number;
  max_verification_attempts: number;
}

export interface XNostrSettings {
  xnostr_browser_path: string;
  xnostr_browser_pool_size: number;
  xnostr_check_interval: number;
  xnostr_concurrency: number;
  xnostr_enabled: boolean;
  xnostr_temp_dir: string;
  xnostr_update_interval: number;
  xnostr_nitter: XNostrNitterSettings;
  xnostr_verification_intervals: XNostrIntervalSettings;
}

export interface RelayInfoSettings {
  relaycontact: string;
  relaydescription: string;
  relaydhtkey: string;
  relayicon: string;
  relayname: string;
  relaypubkey: string;
  relaysoftware: string;
  relaysupportednips: number[];
  relayversion: string;
}

export interface WalletSettings {
  wallet_api_key: string;
  wallet_name: string;
}

export interface GeneralSettings {
  port: string;
  private_key: string;
  proxy: boolean;
  demo_mode: boolean;
  web: boolean;
  service_tag: string;
  relay_stats_db: string;
}

export interface QueryCacheSettings {
  [key: string]: any;
}

export type SettingsGroupName = 
  | 'image_moderation'
  | 'content_filter'
  | 'ollama'
  | 'relay_info'
  | 'wallet'
  | 'general'
  | 'relay_settings';

export type SettingsGroupType<T extends SettingsGroupName> = 
  T extends 'image_moderation' ? ImageModerationSettings :
  T extends 'content_filter' ? ContentFilterSettings :
  T extends 'ollama' ? OllamaSettings :
  T extends 'relay_info' ? RelayInfoSettings :
  T extends 'wallet' ? WalletSettings :
  T extends 'general' ? GeneralSettings :
  T extends 'relay_settings' ? any : // Using any for relay_settings as it's already defined elsewhere
  never;
