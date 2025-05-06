import { store } from '@/store';
import { setSpotifyTokens, setYoutubeTokens } from '@/store/slices/authSlice';

const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function refreshSpotifyToken(): Promise<boolean> {
  const state = store.getState();
  const { refreshToken } = state.auth.spotify;

  if (!refreshToken) return false;

  try {
    const response = await fetch('/api/auth/spotify/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh Spotify token');
    }

    const data = await response.json();
    store.dispatch(
      setSpotifyTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + data.expiresIn * 1000,
      })
    );

    return true;
  } catch (error) {
    console.error('Error refreshing Spotify token:', error);
    return false;
  }
}

export async function refreshYoutubeToken(): Promise<boolean> {
  const state = store.getState();
  const { refreshToken } = state.auth.youtube;

  if (!refreshToken) return false;

  try {
    const response = await fetch('/api/auth/youtube/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh YouTube token');
    }

    const data = await response.json();
    store.dispatch(
      setYoutubeTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + data.expiresIn * 1000,
      })
    );

    return true;
  } catch (error) {
    console.error('Error refreshing YouTube token:', error);
    return false;
  }
}

export function shouldRefreshToken(expiresAt: number | null): boolean {
  if (!expiresAt) return false;
  return Date.now() + REFRESH_THRESHOLD >= expiresAt;
}

export function setupTokenRefresh() {
  // Check and refresh tokens every minute
  setInterval(() => {
    const state = store.getState();
    const { spotify, youtube } = state.auth;

    if (shouldRefreshToken(spotify.expiresAt)) {
      refreshSpotifyToken();
    }

    if (shouldRefreshToken(youtube.expiresAt)) {
      refreshYoutubeToken();
    }
  }, 60 * 1000); // Check every minute
} 