import { Injectable, inject, signal, computed } from '@angular/core';
import { PlayerState } from '../_models/player.interface';
import { INITIAL_PLAYER_STATE } from '../_models/player.const';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private readonly state = signal<PlayerState>(INITIAL_PLAYER_STATE);

  readonly youtube_ = computed(() => this.state().youtube);
  readonly spotify_ = computed(() => this.state().spotify);
  readonly youtubeAccessToken_ = computed(() => this.state().auth.youtube.accessToken);
  readonly spotifyAccessToken_ = computed(() => this.state().auth.spotify.accessToken);

  setYoutubePlayback(isPlaying: boolean): void {
    this.state.update(state => ({
      ...state,
      youtube: {
        ...state.youtube,
        isPlaying
      }
    }));
  }

  setYoutubeVideoId(videoId: string | null): void {
    this.state.update(state => ({
      ...state,
      youtube: {
        ...state.youtube,
        videoId
      }
    }));
  }

  setYoutubeAccessToken(accessToken: string | null): void {
    this.state.update(state => ({
      ...state,
      auth: {
        ...state.auth,
        youtube: {
          accessToken
        }
      }
    }));
  }

  setSpotifyPlayback(isPlaying: boolean, progress: number, trackId: string | null): void {
    this.state.update(state => ({
      ...state,
      spotify: {
        isPlaying,
        progress,
        trackId
      }
    }));
  }

  setSpotifyAccessToken(accessToken: string | null): void {
    this.state.update(state => ({
      ...state,
      auth: {
        ...state.auth,
        spotify: {
          accessToken
        }
      }
    }));
  }
} 