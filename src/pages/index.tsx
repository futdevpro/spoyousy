import { useEffect, useState } from 'react';
import Head from 'next/head';
import SpotifyWebApi from 'spotify-web-api-node';
import SpotifyPlayer from '@/components/SpotifyPlayer';
import YouTubePlayer from '@/components/YouTubePlayer';
import AuthButtons from '@/components/AuthButtons';
import Settings from '@/components/Settings';
import useSpotifyPolling from '@/hooks/useSpotifyPolling';
import useYouTubeSearch from '@/hooks/useYouTubeSearch';
import { useDispatch } from 'react-redux';
import { setYoutubePlayback } from '@/store/slices/playerSlice';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export default function Home() {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);
  const { searchVideo } = useYouTubeSearch();

  useSpotifyPolling(spotifyApi);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>SpoYouSy - Spotify YouTube Sync</title>
        <meta name="description" content="Sync your Spotify playback with YouTube videos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-background-color text-text-color">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-center mb-4">SpoYouSy</h1>
            <div className="flex justify-between items-center">
              <AuthButtons />
              <Settings />
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SpotifyPlayer spotifyApi={spotifyApi} />
            <YouTubePlayer />
          </div>
        </div>
      </main>
    </>
  );
} 