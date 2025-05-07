export interface PlayerState {
  youtube: {
    videoId: string | null;
    isPlaying: boolean;
  };
  spotify: {
    trackId: string | null;
    isPlaying: boolean;
    progress: number;
  };
  auth: {
    youtube: {
      accessToken: string | null;
    };
    spotify: {
      accessToken: string | null;
    };
  };
} 