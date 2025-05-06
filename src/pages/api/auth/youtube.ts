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

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    const { access_token, refresh_token, expiry_date } = tokens;

    if (!access_token || !refresh_token || !expiry_date) {
      throw new Error('Invalid token response');
    }

    // Get user profile
    oauth2Client.setCredentials(tokens);
    const youtube = google.youtube('v3');
    const profile = await youtube.channels.list({
      auth: oauth2Client,
      part: ['snippet'],
      mine: true,
    });

    const channel = profile.data.items?.[0];
    if (!channel) {
      throw new Error('No channel found');
    }

    return res.status(200).json({
      success: true,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: expiry_date,
      user: {
        id: channel.id,
        displayName: channel.snippet?.title || 'Unknown User',
      },
    });
  } catch (error) {
    console.error('YouTube auth error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to authenticate with YouTube',
    });
  }
} 