import { Component, OnDestroy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../_services/player.service';

interface SpotifyPlayerState {
  is_playing: boolean;
  position: number;
  track_window: {
    current_track: {
      id: string;
    };
  };
}

interface SpotifyDeviceEvent {
  device_id: string;
}

type SpotifyEventData = SpotifyPlayerState | SpotifyDeviceEvent;

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (config: {
        name: string;
        getOAuthToken: (callback: (token: string) => void) => void;
        volume: number;
      }) => {
        addListener: (event: string, callback: (data: SpotifyEventData) => void) => void;
        connect: () => Promise<boolean>;
      };
    };
  }
}

@Component({
  selector: 'app-spotify-player',
  templateUrl: './spotify-player.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class SpotifyPlayerComponent implements OnDestroy {
  private readonly playerService = inject(PlayerService);
  readonly spotify_ = this.playerService.spotify_;
  readonly accessToken_ = this.playerService.spotifyAccessToken_;
  private deviceId: string | null = null;

  constructor() {
    effect(() => {
      const accessToken = this.accessToken_();
      if (accessToken) {
        this.initializePlayer();
      }
    });

    effect(() => {
      const spotify = this.spotify_();
      if (spotify.trackId && this.deviceId) {
        this.loadTrack(spotify.trackId);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up Spotify player resources
    if (this.deviceId) {
      this.deviceId = null;
    }
  }

  private initializePlayer() {
    // Initialize Spotify Web Playback SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: (cb: (token: string) => void) => { cb(this.accessToken_() || ''); },
        volume: 0.5
      });

      player.addListener('ready', (data: SpotifyEventData) => {
        if ('device_id' in data) {
          console.log('Ready with Device ID', data.device_id);
          this.deviceId = data.device_id;
        }
      });

      player.addListener('not_ready', (data: SpotifyEventData) => {
        if ('device_id' in data) {
          console.log('Device ID has gone offline', data.device_id);
          if (this.deviceId === data.device_id) {
            this.deviceId = null;
          }
        }
      });

      player.addListener('player_state_changed', (data: SpotifyEventData) => {
        if ('is_playing' in data) {
          this.playerService.setSpotifyPlayback(
            data.is_playing,
            data.position,
            data.track_window.current_track.id
          );
        }
      });

      player.connect();
    };
  }

  private loadTrack(trackId: string) {
    if (!this.deviceId) return;

    // Load track using Spotify Web API
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken_()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: [`spotify:track:${trackId}`]
      })
    });
  }

  connectSpotify() {
    const clientId = 'YOUR_SPOTIFY_CLIENT_ID'; // Replace with your Spotify Client ID
    const redirectUri = window.location.origin;
    const scope = 'streaming user-read-email user-read-private';

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
  }
} 