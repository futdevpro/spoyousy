import { Injectable, signal, computed } from '@angular/core';
import { PlayerState } from '../_models/player.interface';
import { INITIAL_PLAYER_STATE } from '../_models/player.const';

/**
 * Service responsible for managing the player state across both YouTube and Spotify.
 * Handles playback state, authentication tokens, and loading states.
 */
@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private readonly state = signal<PlayerState>(INITIAL_PLAYER_STATE);
  private readonly loading = signal<boolean>(true);

  readonly youtube_ = computed(() => this.state().youtube);
  readonly spotify_ = computed(() => this.state().spotify);
  readonly youtubeAccessToken_ = computed(() => this.state().auth.youtube.accessToken);
  readonly spotifyAccessToken_ = computed(() => this.state().auth.spotify.accessToken);
  readonly loading_ = computed(() => this.loading());

  /**
   * Updates the global loading state of the application.
   * @param isLoading - The new loading state
   */
  setLoading(isLoading: boolean): void {
    console.log('⏳ Setting loading state to:', isLoading);
    try {
      this.loading.set(isLoading);
      console.log('✅ Loading state updated successfully');
    } catch (error) {
      console.error('❌ Failed to update loading state:', error);
      throw error;
    }
  }

  /**
   * Updates the YouTube playback state.
   * @param isPlaying - Whether the video is currently playing
   */
  setYoutubePlayback(isPlaying: boolean): void {
    console.log('🎥 Updating YouTube playback state:', isPlaying);
    try {
      this.state.update(state => ({
        ...state,
        youtube: {
          ...state.youtube,
          isPlaying
        }
      }));
      console.log('✅ YouTube playback state updated successfully');
    } catch (error) {
      console.error('❌ Failed to update YouTube playback state:', error);
      throw error;
    }
  }

  /**
   * Updates the current YouTube video ID.
   * @param videoId - The ID of the YouTube video
   */
  setYoutubeVideoId(videoId: string | null): void {
    console.log('🎬 Updating YouTube video ID:', videoId);
    try {
      this.state.update(state => ({
        ...state,
        youtube: {
          ...state.youtube,
          videoId
        }
      }));
      console.log('✅ YouTube video ID updated successfully');
    } catch (error) {
      console.error('❌ Failed to update YouTube video ID:', error);
      throw error;
    }
  }

  /**
   * Updates the YouTube access token.
   * @param accessToken - The new access token
   */
  setYoutubeAccessToken(accessToken: string | null): void {
    console.log('🔑 Updating YouTube access token');
    try {
      this.state.update(state => ({
        ...state,
        auth: {
          ...state.auth,
          youtube: {
            accessToken
          }
        }
      }));
      console.log('✅ YouTube access token updated successfully');
    } catch (error) {
      console.error('❌ Failed to update YouTube access token:', error);
      throw error;
    }
  }

  /**
   * Updates the Spotify playback state and progress.
   * @param isPlaying - Whether the track is currently playing
   * @param progress - The current playback progress in milliseconds
   * @param trackId - The ID of the current Spotify track
   */
  setSpotifyPlayback(isPlaying: boolean, progress: number, trackId: string | null): void {
    console.log('🎵 Updating Spotify playback state:', { isPlaying, progress, trackId });
    try {
      this.state.update(state => ({
        ...state,
        spotify: {
          isPlaying,
          progress,
          trackId
        }
      }));
      console.log('✅ Spotify playback state updated successfully');
    } catch (error) {
      console.error('❌ Failed to update Spotify playback state:', error);
      throw error;
    }
  }

  /**
   * Updates the Spotify access token.
   * @param accessToken - The new access token
   */
  setSpotifyAccessToken(accessToken: string | null): void {
    console.log('🔑 Updating Spotify access token');
    try {
      this.state.update(state => ({
        ...state,
        auth: {
          ...state.auth,
          spotify: {
            accessToken
          }
        }
      }));
      console.log('✅ Spotify access token updated successfully');
    } catch (error) {
      console.error('❌ Failed to update Spotify access token:', error);
      throw error;
    }
  }
} 