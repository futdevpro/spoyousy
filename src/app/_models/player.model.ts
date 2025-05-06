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

export const INITIAL_PLAYER_STATE: PlayerState = {
  youtube: {
    videoId: null,
    isPlaying: false
  },
  spotify: {
    trackId: null,
    isPlaying: false,
    progress: 0
  },
  auth: {
    youtube: {
      accessToken: null
    },
    spotify: {
      accessToken: null
    }
  }
}; 