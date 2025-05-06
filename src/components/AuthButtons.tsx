import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  setSpotifyAuth,
  setYoutubeAuth,
  clearSpotifyAuth,
  clearYoutubeAuth,
} from '@/store/slices/authSlice';
import { toast } from 'react-toastify';

export default function AuthButtons() {
  const dispatch = useDispatch();
  const { spotify, youtube } = useSelector((state: RootState) => state.auth);

  const handleSpotifyLogin = async () => {
    try {
      // TODO: Implement Spotify OAuth flow
      const response = await fetch('/api/auth/spotify');
      const data = await response.json();
      
      if (data.success) {
        dispatch(setSpotifyAuth({
          isAuthenticated: true,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
          user: data.user,
        }));
        toast.success('Successfully connected to Spotify!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to connect to Spotify');
      console.error('Spotify login error:', error);
    }
  };

  const handleYoutubeLogin = async () => {
    try {
      // TODO: Implement YouTube OAuth flow
      const response = await fetch('/api/auth/youtube');
      const data = await response.json();
      
      if (data.success) {
        dispatch(setYoutubeAuth({
          isAuthenticated: true,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
          user: data.user,
        }));
        toast.success('Successfully connected to YouTube!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to connect to YouTube');
      console.error('YouTube login error:', error);
    }
  };

  const handleSpotifyLogout = () => {
    dispatch(clearSpotifyAuth());
    toast.info('Disconnected from Spotify');
  };

  const handleYoutubeLogout = () => {
    dispatch(clearYoutubeAuth());
    toast.info('Disconnected from YouTube');
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* Spotify Auth */}
      <div className="flex items-center space-x-2">
        {spotify.isAuthenticated ? (
          <>
            <span className="text-sm text-gray-400">
              Connected as {spotify.user?.displayName}
            </span>
            <button
              onClick={handleSpotifyLogout}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={handleSpotifyLogin}
            className="px-4 py-2 text-sm bg-[#1DB954] hover:bg-[#1ed760] text-white rounded-md transition-colors"
          >
            Connect Spotify
          </button>
        )}
      </div>

      {/* YouTube Auth */}
      <div className="flex items-center space-x-2">
        {youtube.isAuthenticated ? (
          <>
            <span className="text-sm text-gray-400">
              Connected as {youtube.user?.displayName}
            </span>
            <button
              onClick={handleYoutubeLogout}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={handleYoutubeLogin}
            className="px-4 py-2 text-sm bg-[#FF0000] hover:bg-[#cc0000] text-white rounded-md transition-colors"
          >
            Connect YouTube
          </button>
        )}
      </div>
    </div>
  );
} 