import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();
    const { access_token, expiry_date } = credentials;

    if (!access_token || !expiry_date) {
      throw new Error('Invalid token response');
    }

    return res.status(200).json({
      accessToken: access_token,
      refreshToken: refreshToken,
      expiresIn: Math.floor((expiry_date - Date.now()) / 1000),
    });
  } catch (error) {
    console.error('Error refreshing YouTube token:', error);
    return res.status(500).json({ error: 'Failed to refresh token' });
  }
} 