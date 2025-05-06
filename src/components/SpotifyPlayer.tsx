import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setSpotifyPlayback } from '@/store/slices/playerSlice';
import SpotifyWebApi from 'spotify-web-api-node';

interface SpotifyPlayerProps {
  spotifyApi: SpotifyWebApi;
}

export default function SpotifyPlayer({ spotifyApi }: SpotifyPlayerProps) {
  const dispatch = useDispatch();
  const { spotify } = useSelector((state: RootState) => state.player);
  const { accessToken } = useSelector((state: RootState) => state.auth.spotify);

  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);

    const pollPlayback = async () => {
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

    pollPlayback();
    const interval = setInterval(pollPlayback, 1000);

    return () => clearInterval(interval);
  }, [accessToken, dispatch, spotifyApi]);

  if (!accessToken) {
    return (
      <div className="bg-surface-color rounded-lg p-6 text-center">
        <p className="text-gray-400">Connect your Spotify account to start playing</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-color rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Spotify</h2>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              spotify.isPlaying ? 'bg-green-500' : 'bg-gray-500'
            }`}
          />
          <span className="text-sm text-gray-400">
            {spotify.isPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>
      </div>

      {spotify.trackId ? (
        <div>
          <p className="text-lg font-medium mb-2">Track ID: {spotify.trackId}</p>
          <p className="text-gray-400">Progress: {spotify.progress}ms</p>
        </div>
      ) : (
        <p className="text-gray-400">No track playing</p>
      )}
    </div>
  );
} 