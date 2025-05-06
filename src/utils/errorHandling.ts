import { toast } from 'react-toastify';
import { ErrorType, ErrorService, ErrorCode } from '@/types/error';

interface ErrorMessage {
  default: string;
  [key: string]: string | { [key: string]: string };
}

interface ErrorMessages {
  [key: string]: ErrorMessage;
}

const ERROR_MESSAGES: ErrorMessages = {
  auth: {
    default: 'Authentication error',
    spotify: {
      token_expired: 'Spotify session expired. Please reconnect.',
      invalid_token: 'Invalid Spotify token. Please reconnect.',
      auth_failed: 'Spotify authentication failed. Please try again.'
    },
    youtube: {
      token_expired: 'YouTube session expired. Please reconnect.',
      invalid_token: 'Invalid YouTube token. Please reconnect.',
      auth_failed: 'YouTube authentication failed. Please try again.'
    }
  },
  network: {
    default: 'Network error',
    offline: 'You are offline. Please check your internet connection.',
    timeout: 'Request timed out. Please try again.',
    server_error: 'Server error. Please try again later.'
  },
  playback: {
    default: 'Playback error',
    spotify: {
      not_playing: 'No track is currently playing on Spotify.',
      playback_failed: 'Failed to start Spotify playback.',
      device_not_found: 'No active Spotify device found.'
    },
    youtube: {
      not_playing: 'No video is currently playing on YouTube.',
      playback_failed: 'Failed to start YouTube playback.',
      video_not_found: 'Video not found on YouTube.'
    }
  },
  sync: {
    default: 'Synchronization error',
    spotify: {
      sync_failed: 'Failed to sync with Spotify playback.',
      state_mismatch: 'Spotify playback state mismatch.'
    },
    youtube: {
      sync_failed: 'Failed to sync with YouTube playback.',
      state_mismatch: 'YouTube playback state mismatch.'
    }
  },
  api: {
    default: 'API error',
    spotify: {
      rate_limit: 'Spotify API rate limit exceeded. Please try again later.',
      invalid_request: 'Invalid Spotify API request.',
      server_error: 'Spotify API server error.'
    },
    youtube: {
      rate_limit: 'YouTube API rate limit exceeded. Please try again later.',
      invalid_request: 'Invalid YouTube API request.',
      server_error: 'YouTube API server error.'
    }
  },
  webos: {
    default: 'WebOS error',
    init_failed: 'Failed to initialize WebOS integration.',
    navigation_failed: 'Failed to handle keyboard navigation.',
    media_keys_failed: 'Failed to handle media keys.',
    lifecycle_failed: 'Failed to handle app lifecycle events.'
  }
};

export class AppError extends Error {
  constructor(
    public type: ErrorType,
    public service?: ErrorService,
    public code?: ErrorCode,
    public originalError?: any
  ) {
    super(getErrorMessage(type, service, code));
    this.name = 'AppError';
  }
}

export function getErrorMessage(
  type: ErrorType,
  service?: ErrorService,
  code?: ErrorCode
): string {
  const messages = ERROR_MESSAGES[type];
  if (!messages) {
    return 'An unexpected error occurred.';
  }

  if (service && typeof messages[service] === 'object') {
    const serviceMessages = messages[service] as { [key: string]: string };
    if (code && serviceMessages[code]) {
      return serviceMessages[code];
    }
    return serviceMessages.default || messages.default;
  }

  return messages.default;
}

export function handleError(error: Error | AppError): void {
  if (error instanceof AppError) {
    const message = getErrorMessage(error.type, error.service, error.code);
    console.error(`[${error.type}] ${message}:`, error.originalError || error);
    
    // Show toast notification
    toast.error(message, {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Dispatch error event
    const errorEvent = new CustomEvent('app-error', {
      detail: {
        type: error.type,
        service: error.service,
        code: error.code,
        message,
        error: error.originalError || error.message
      }
    });
    window.dispatchEvent(errorEvent);
  } else {
    // Handle unknown errors
    console.error('Unexpected error:', error);
    toast.error('An unexpected error occurred. Please try again.', {
      position: 'bottom-right',
      autoClose: 5000,
    });
  }
}

export function isAuthError(error: any): boolean {
  return error?.status === 401 || error?.status === 403;
}

export function isNetworkError(error: any): boolean {
  return !navigator.onLine || error?.message?.includes('network');
}

export function isPlaybackError(error: any): boolean {
  return error?.message?.includes('playback') || error?.message?.includes('device');
}

export function isSyncError(error: any): boolean {
  return error?.message?.includes('sync') || error?.message?.includes('state');
}

export function isApiError(error: any): boolean {
  return error?.status >= 400 && error?.status < 600;
}

export function isWebOSError(error: any): boolean {
  return error?.message?.includes('webos') || error?.message?.includes('WebOS');
} 