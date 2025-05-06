import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface SearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  description: string;
  thumbnailUrl: string;
}

interface SettingsState {
  searchPreferences: {
    useExactMatch: boolean;
    includeRemixes: boolean;
    includeLiveVersions: boolean;
  };
  autoResync: boolean;
  manualVideoOverride: string | null;
}

export default function useYouTubeSearch() {
  const { accessToken } = useSelector((state: RootState) => state.auth.youtube);
  const { searchPreferences, manualVideoOverride } = useSelector(
    (state: RootState) => state.settings as SettingsState
  );

  const searchVideo = useCallback(
    async (
      title: string,
      artist: string
    ): Promise<SearchResult | null> => {
      if (!accessToken) return null;

      // If there's a manual override, return it directly
      if (manualVideoOverride) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${manualVideoOverride}&key=${process.env.YOUTUBE_API_KEY}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!response.ok) throw new Error('Failed to fetch video details');

          const data = await response.json();
          if (!data.items?.length) return null;

          const video = data.items[0];
          return {
            videoId: video.id,
            title: video.snippet.title,
            channelTitle: video.snippet.channelTitle,
            description: video.snippet.description,
            thumbnailUrl: video.snippet.thumbnails.default.url,
          };
        } catch (error) {
          console.error('Error fetching manual override video:', error);
          return null;
        }
      }

      // Build search query based on preferences
      let query = `${title} ${artist}`;
      if (searchPreferences.useExactMatch) {
        query = `"${title}" "${artist}"`;
      }
      if (!searchPreferences.includeRemixes) {
        query += ' -remix -mix';
      }
      if (!searchPreferences.includeLiveVersions) {
        query += ' -live -concert -performance';
      }

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
            query
          )}&key=${process.env.YOUTUBE_API_KEY}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to search videos');

        const data = await response.json();
        if (!data.items?.length) return null;

        const video = data.items[0];
        return {
          videoId: video.id.videoId,
          title: video.snippet.title,
          channelTitle: video.snippet.channelTitle,
          description: video.snippet.description,
          thumbnailUrl: video.snippet.thumbnails.default.url,
        };
      } catch (error) {
        console.error('Error searching YouTube:', error);
        return null;
      }
    },
    [accessToken, searchPreferences, manualVideoOverride]
  );

  return { searchVideo };
} 