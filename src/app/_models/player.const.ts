import { PlayerState } from './player.interface';

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