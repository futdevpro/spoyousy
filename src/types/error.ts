export type ErrorType = 'auth' | 'network' | 'playback' | 'sync' | 'api' | 'webos';

export type ErrorService = 'spotify' | 'youtube';

export type ErrorCode =
  | 'token_expired'
  | 'invalid_token'
  | 'auth_failed'
  | 'offline'
  | 'timeout'
  | 'server_error'
  | 'not_playing'
  | 'playback_failed'
  | 'device_not_found'
  | 'video_not_found'
  | 'sync_failed'
  | 'state_mismatch'
  | 'rate_limit'
  | 'invalid_request'
  | 'init_failed'
  | 'navigation_failed'
  | 'media_keys_failed'
  | 'lifecycle_failed'; 