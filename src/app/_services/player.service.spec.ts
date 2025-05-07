import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { INITIAL_PLAYER_STATE } from '../_models/player.const';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerService]
    });
    service = TestBed.inject(PlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default state', () => {
    expect(service.youtube_()).toEqual(INITIAL_PLAYER_STATE.youtube);
    expect(service.spotify_()).toEqual(INITIAL_PLAYER_STATE.spotify);
  });

  it('should manage loading state', () => {
    expect(service.loading_()).toBe(true);
    
    service.setLoading(false);
    expect(service.loading_()).toBe(false);
    
    service.setLoading(true);
    expect(service.loading_()).toBe(true);
  });

  it('should update YouTube playback state', () => {
    service.setYoutubePlayback(true);
    expect(service.youtube_().isPlaying).toBe(true);
    
    service.setYoutubePlayback(false);
    expect(service.youtube_().isPlaying).toBe(false);
  });

  it('should update YouTube video ID', () => {
    const videoId = 'test-video-id';
    service.setYoutubeVideoId(videoId);
    expect(service.youtube_().videoId).toBe(videoId);
  });

  it('should update Spotify playback state', () => {
    const trackId = 'test-track-id';
    service.setSpotifyPlayback(true, 0, trackId);
    expect(service.spotify_().isPlaying).toBe(true);
    expect(service.spotify_().trackId).toBe(trackId);
    expect(service.spotify_().progress).toBe(0);
  });

  it('should update access tokens', () => {
    const youtubeToken = 'youtube-token';
    const spotifyToken = 'spotify-token';
    
    service.setYoutubeAccessToken(youtubeToken);
    expect(service.youtubeAccessToken_()).toBe(youtubeToken);
    
    service.setSpotifyAccessToken(spotifyToken);
    expect(service.spotifyAccessToken_()).toBe(spotifyToken);
  });
}); 