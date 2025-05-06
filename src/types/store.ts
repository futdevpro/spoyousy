export interface SpotifyAuth {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: {
    id: string;
    displayName: string;
    email: string;
    imageUrl: string;
  } | null;
}

export interface YouTubeAuth {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: {
    id: string;
    displayName: string;
    email: string;
    imageUrl: string;
  } | null;
}

export interface AuthState {
  spotify: SpotifyAuth;
  youtube: YouTubeAuth;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  artwork: string | null;
}

export interface SpotifyPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  device: string | null;
}

export interface YouTubePlayerState {
  videoId: string | null;
  isPlaying: boolean;
  progress: number;
  syncStatus: 'synced' | 'syncing' | 'out-of-sync';
}

export interface PlayerSettings {
  searchPreference: 'official' | 'lyrics' | 'any';
  autoResync: boolean;
  manualOverride: string | null;
}

export interface PlayerState {
  spotify: SpotifyPlayerState;
  youtube: YouTubePlayerState;
  settings: PlayerSettings;
}

export interface RootState {
  auth: AuthState;
  player: PlayerState;
} 