# SpoYouSy Specifications

## Overview
SpoYouSy is a Next.js/React application that integrates Spotify and YouTube, allowing users to synchronize and interact with both platforms. The app is designed for deployment on WebOS devices (such as LG Smart TVs) and supports both simulator and physical TV deployment.

## Tech Stack
- Next.js (React, TypeScript)
- Redux Toolkit for state management
- react-toastify for notifications
- Jest and Testing Library for unit tests
- WebOS CLI and packaging scripts for deployment

## Key Features
- Spotify and YouTube integration
- Global loading screen and loading process
- Global error handling with popups
- Robust startup flow
- Branded UI (uses app logo)
- Unit tests (all in `.spec.tsx` format)
- CI workflows for lint, test, and build
- VSCode settings and extension recommendations

## Logging Style and Placement
- **All logs in scripts must use emojis to improve readability.**
- **Logs must be placed both before and after all major executions.**
- These rules are enforced for every script and code change, as per `.cursor/rules`.

## Startup Flow
1. Show a branded loading screen while the app initializes.
2. Run startup tasks (auth check, API init, etc.).
3. On error, show a global error popup.
4. On success, show the main app UI.

## Loading Process
- Uses a global `loading` state in Redux (`appSlice`).
- Loading is set to `true` at startup and `false` after initialization.
- The loading screen is shown whenever `loading` is `true`.

## Global Error Handling
- Uses a global `globalError` state in Redux (`appSlice`).
- Top-level React Error Boundary catches rendering errors and dispatches `setGlobalError`.
- Async startup logic uses try/catch and dispatches `setGlobalError` on error.
- Errors are shown as popups using `react-toastify`.

## Testing
- All unit test files use the `.spec.tsx` extension.
- Tests are run with Jest and Testing Library.

## Deployment
- Uses custom scripts for building, packaging, and deploying to WebOS devices.
- Supports both simulator and physical TV deployment.
- Icon is always copied from `src/assets/icon.png`.

## VSCode
- Recommended extensions: WebOS Studio, SonarLint, etc.
- Workspace settings for formatting, file associations, and search.

## Global Instructions
- Always follow every rule under `.cursor/rules` and where it points.
- When the user commands to do something in a new way (global how-to), add that to `AI Agent directives.md` (now `.cursor/rules`).
- When the user commands to create something new in the app that is not included in this file, add it to `specifications.md`.
- **All rules and commands from `.cursor/rules` must be enforced for every command and implementation.**

## WebOS Development Scripts

### Overview
A set of scripts for building, packaging, and deploying WebOS applications. All scripts follow consistent patterns for error handling, logging, and user feedback.

### Scripts

#### `build-webos.js`
- **Purpose**: Complete WebOS build process
- **Flow**: CLI check → Next.js build → WebOS files copy → Next.js output copy → Minification management
- **Key**: Platform-specific operations, minification skip handling

#### `package-webos.js`
- **Purpose**: Package built app for deployment
- **Flow**: Build → Minify → Version sync → IPK generation
- **Key**: Terser minification, version management, IPK output

#### `deploy-webos.js`
- **Purpose**: Deploy and install WebOS app
- **Flow**: Package → Device check → Uninstall if needed → Install → Launch
- **Key**: Device management, installation handling, app launching

#### `restore-webos.js`
- **Purpose**: Restore unminified files
- **Flow**: Temp storage → Restore → Cleanup
- **Key**: File preservation, cleanup management

#### `setup-webos.js`
- **Purpose**: WebOS environment setup
- **Flow**: CLI check → Install/update → Path config → Device setup
- **Key**: Environment configuration, device setup assistance

### Common Features
- Consistent error handling and logging
- Platform-specific adaptations
- Progress tracking and cleanup
- Unique, prefixed logs with emojis
- Comprehensive user feedback

### Dependencies
- Node.js and pnpm
- WebOS CLI
- Platform tools (xcopy/cp)

### Best Practices
1. Run in order: setup → build → package → deploy
2. Monitor logs for status
3. Verify device connection
4. Keep versions in sync
5. Maintain minification skip list

### Troubleshooting
- CLI installation status
- Device connection
- File permissions
- Platform issues
- Log review

---

*This file should be updated any time new global requirements or features are added to the app.* 