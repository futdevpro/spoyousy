import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setSpotifyPlayback } from '@/store/slices/playerSlice';
import SpotifyWebApi from 'spotify-web-api-node';

const POLLING_INTERVAL = 3000; // 3 seconds

export default function useSpotifyPolling(spotifyApi: SpotifyWebApi) {
  const dispatch = useDispatch();
  const pollingRef = useRef<NodeJS.Timeout>();
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.spotify.accessToken);

  useEffect(() => {
    const pollSpotifyPlayback = async () => {
      try {
        const data = await spotifyApi.getMyCurrentPlaybackState();
        
        if (data.body) {
          dispatch(
            setSpotifyPlayback({
              isPlaying: data.body.is_playing,
              progress: data.body.progress_ms || 0,
              trackId: data.body.item?.id || null,
            })
          );
        }
      } catch (error) {
        console.error('Error polling Spotify playback:', error);
      }
    };

    if (isAuthenticated) {
      pollSpotifyPlayback(); // Initial poll
      pollingRef.current = setInterval(pollSpotifyPlayback, POLLING_INTERVAL);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [isAuthenticated, dispatch, spotifyApi]);
} 