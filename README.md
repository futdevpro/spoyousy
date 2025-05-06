# SpoYouSy

A WebOS application that integrates Spotify and YouTube playback, built with Angular 18.

## Project Structure

```
spoyousy/
├── src/
│   ├── app/
│   │   ├── _components/     # Angular components
│   │   │   ├── auth-buttons/    # Authentication UI
│   │   │   ├── settings/        # Settings panel
│   │   │   ├── spotify-player/  # Spotify player UI
│   │   │   └── youtube-player/  # YouTube player UI
│   │   ├── _services/      # Angular services
│   │   ├── _models/        # TypeScript interfaces and constants
│   │   └── app.component.* # Root component files
│   ├── assets/        # Static assets
│   ├── environments/  # Environment configurations
│   ├── styles/        # Global styles
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── main.ts        # Application entry point
│   └── index.html     # Main HTML file
├── webos/            # WebOS specific files
├── scripts/          # Build and deployment scripts
├── .vscode/          # VSCode configuration
├── .github/          # GitHub workflows
└── ... configuration files
```

## Tech Stack

- Angular 18
- Angular Signals for state management
- Angular's built-in control flow syntax (@if, @for)
- Tailwind CSS for styling
- Jest for testing
- WebOS SDK for deployment

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Run tests:
```bash
npm test
```

## WebOS Development

1. Set up WebOS environment:
```bash
npm run setup-webos
```

2. Build for WebOS:
```bash
npm run build-webos
```

3. Package for WebOS:
```bash
npm run package-webos
```

4. Deploy to WebOS device:
```bash
npm run deploy-webos
```

## Testing

- Unit tests use Jest
- Run tests: `npm test`
- Watch mode: `npm run test:watch`
- Coverage report: `npm run test:coverage`

## Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run linter
- `npm run build-webos` - Build for WebOS
- `npm run package-webos` - Package for WebOS
- `npm run deploy-webos` - Deploy to WebOS device
- `npm run dev-webos` - Development mode with WebOS packaging
- `npm run setup-webos` - Set up WebOS environment

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Features

- 🔐 Secure OAuth2 authentication for both Spotify and YouTube
- 🎧 Real-time Spotify track monitoring
- 🔍 Intelligent YouTube video matching
- ⏱️ Precise playback synchronization
- ⚙️ Customizable settings and preferences
- 🎯 Manual video override options
- 🛡️ Comprehensive error handling
- 🎮 WebOS remote control support

## Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm
- WebOS development environment
- Spotify Developer Account
- Google Cloud Platform Account with YouTube Data API enabled
- WebOS SDK (for WebOS TV development)

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spoyousy.git
cd spoyousy
```

2. Install dependencies:
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm (recommended)
pnpm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:29336/api/auth/spotify/callback

# YouTube API Credentials
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:29336/api/auth/youtube/callback
YOUTUBE_API_KEY=your_youtube_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:29336
NODE_ENV=development
```

4. Install WebOS SDK:
```bash
# Download the WebOS SDK from the [LG Developer Portal](https://webostv.developer.lge.com/sdk/installation/)
# Follow the platform-specific instructions to install the SDK
# Add the SDK tools to your system PATH:
#   - Windows: Add `C:\Program Files\webOS TV SDK\CLI\bin` to your PATH
#   - macOS/Linux: Add `/opt/webOS_TV_SDK/CLI/bin` to your PATH
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:29336](http://localhost:29336) in your browser.

## Building for WebOS

1. Build the application:
```bash
npm run build-webos
# or
yarn build-webos
# or
pnpm build-webos
```

2. Package for WebOS:
```bash
npm run package-webos
# or
yarn package-webos
# or
pnpm package-webos
```

3. Install on WebOS device:
```bash
npm run install:webos
# or
yarn install:webos
# or
pnpm install:webos
```

## API Integration

### Spotify API
- Uses OAuth2 for authentication
- Polls currently playing track every 2-5 seconds
- Handles token refresh automatically
- Required scopes:
  - `user-read-playback-state`
  - `user-read-currently-playing`
  - `user-read-private`
  - `user-read-email`

### YouTube API
- Uses OAuth2 for authentication
- Searches for matching videos using track metadata
- Implements smart video selection algorithm
- Required scopes:
  - `https://www.googleapis.com/auth/youtube.readonly`

## Error Handling

The application implements comprehensive error handling for various scenarios:

### Authentication Errors
- Token expiration
- Invalid credentials
- Authentication failures
- Automatic token refresh

### Network Errors
- Offline detection
- Request timeouts
- Server errors
- Connection issues

### API Rate Limits
- Spotify API rate limiting
- YouTube API rate limiting
- Exponential backoff
- Automatic retry

### Playback Errors
- Device not found
- Track not found
- Playback control failures
- State synchronization issues

### Sync Errors
- No matching video found
- Poor quality matches
- Sync loss detection
- Manual override suggestions

### WebOS-Specific Errors
- App lifecycle events
- Media key handling
- Navigation events
- System integration

## WebOS Features

### Remote Control Support
- Arrow key navigation
- Enter/Select actions
- Back button handling
- Media key controls

### App Lifecycle
- Background/Foreground handling
- Resource cleanup
- State persistence
- Error recovery

### UI Optimization
- TV-friendly interface
- Remote navigation
- High contrast support
- Responsive layout

## Acknowledgments

- Spotify Web API
- YouTube Data API
- WebOS Platform
- Next.js Team 