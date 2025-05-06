import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
  spotify: {
    isPlaying: boolean;
    progress: number;
    trackId: string | null;
  };
  youtube: {
    isPlaying: boolean;
    progress: number;
    videoId: string | null;
  };
  syncStatus: 'synced' | 'syncing' | 'out-of-sync';
}

const initialState: PlayerState = {
  spotify: {
    isPlaying: false,
    progress: 0,
    trackId: null,
  },
  youtube: {
    isPlaying: false,
    progress: 0,
    videoId: null,
  },
  syncStatus: 'synced',
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setSpotifyPlayback: (state, action: PayloadAction<Partial<PlayerState['spotify']>>) => {
      state.spotify = { ...state.spotify, ...action.payload };
    },
    setYoutubePlayback: (state, action: PayloadAction<Partial<PlayerState['youtube']>>) => {
      state.youtube = { ...state.youtube, ...action.payload };
    },
    setSyncStatus: (state, action: PayloadAction<PlayerState['syncStatus']>) => {
      state.syncStatus = action.payload;
    },
  },
});

export const { setSpotifyPlayback, setYoutubePlayback, setSyncStatus } = playerSlice.actions;
export default playerSlice.reducer; 