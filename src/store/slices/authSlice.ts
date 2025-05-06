import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, SpotifyAuth, YouTubeAuth } from '@/types/store';

const initialState: AuthState = {
  spotify: {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    user: null,
  },
  youtube: {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    user: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSpotifyAuth: (state, action: PayloadAction<Partial<SpotifyAuth>>) => {
      state.spotify = { ...state.spotify, ...action.payload };
    },
    setYoutubeAuth: (state, action: PayloadAction<Partial<YouTubeAuth>>) => {
      state.youtube = { ...state.youtube, ...action.payload };
    },
    setSpotifyTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
      }>
    ) => {
      state.spotify.accessToken = action.payload.accessToken;
      state.spotify.refreshToken = action.payload.refreshToken;
      state.spotify.expiresAt = action.payload.expiresAt;
      state.spotify.isAuthenticated = true;
    },
    setYoutubeTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
      }>
    ) => {
      state.youtube.accessToken = action.payload.accessToken;
      state.youtube.refreshToken = action.payload.refreshToken;
      state.youtube.expiresAt = action.payload.expiresAt;
      state.youtube.isAuthenticated = true;
    },
    logoutSpotify: (state) => {
      state.spotify = initialState.spotify;
    },
    logoutYoutube: (state) => {
      state.youtube = initialState.youtube;
    },
    clearSpotifyAuth: (state) => {
      state.spotify = initialState.spotify;
    },
    clearYoutubeAuth: (state) => {
      state.youtube = initialState.youtube;
    },
  },
});

export const {
  setSpotifyAuth,
  setYoutubeAuth,
  setSpotifyTokens,
  setYoutubeTokens,
  logoutSpotify,
  logoutYoutube,
  clearSpotifyAuth,
  clearYoutubeAuth,
} = authSlice.actions;

export default authSlice.reducer; 