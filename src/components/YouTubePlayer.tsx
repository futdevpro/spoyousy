import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setYoutubePlayback } from '@/store/slices/playerSlice';
import YouTube from 'youtube-player';

export default function YouTubePlayer() {
  const dispatch = useDispatch();
  const { youtube } = useSelector((state: RootState) => state.player);
  const { accessToken } = useSelector((state: RootState) => state.auth.youtube);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !accessToken) return;

    playerRef.current = YouTube(containerRef.current, {
      videoId: youtube.videoId || undefined,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
      },
    });

    playerRef.current.on('stateChange', (event: any) => {
      if (event.data === 1) { // Playing
        dispatch(setYoutubePlayback({ isPlaying: true }));
      } else if (event.data === 2) { // Paused
        dispatch(setYoutubePlayback({ isPlaying: false }));
      }
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [accessToken, dispatch, youtube.videoId]);

  useEffect(() => {
    if (playerRef.current && youtube.videoId) {
      playerRef.current.loadVideoById(youtube.videoId);
    }
  }, [youtube.videoId, playerRef]);

  if (!accessToken) {
    return (
      <div className="bg-surface-color rounded-lg p-6 text-center">
        <p className="text-gray-400">Connect your YouTube account to start playing</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-color rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">YouTube</h2>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              youtube.isPlaying ? 'bg-green-500' : 'bg-gray-500'
            }`}
          />
          <span className="text-sm text-gray-400">
            {youtube.isPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>
      </div>

      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
} 