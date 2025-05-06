// WebOS-specific functionality
const webOS = {
  init() {
    try {
      // Initialize WebOS-specific features
      this.setupKeyboardNavigation();
      this.setupMediaKeys();
      this.setupAppLifecycle();
    } catch (error) {
      window.dispatchEvent(new CustomEvent('webos-error', {
        detail: {
          type: 'WEBOS',
          code: 'init_failed',
          error
        }
      }));
    }
  },

  setupKeyboardNavigation() {
    try {
      // Handle WebOS remote control navigation
      document.addEventListener('keydown', (event) => {
        try {
          switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
              // Prevent default scrolling
              event.preventDefault();
              // Dispatch custom event for navigation
              window.dispatchEvent(new CustomEvent('webos-navigation', {
                detail: { direction: event.key }
              }));
              break;
            case 'Enter':
              // Handle select/confirm action
              window.dispatchEvent(new CustomEvent('webos-select'));
              break;
            case 'Backspace':
              // Handle back action
              window.dispatchEvent(new CustomEvent('webos-back'));
              break;
          }
        } catch (error) {
          window.dispatchEvent(new CustomEvent('webos-error', {
            detail: {
              type: 'WEBOS',
              code: 'navigation_failed',
              error
            }
          }));
        }
      });
    } catch (error) {
      window.dispatchEvent(new CustomEvent('webos-error', {
        detail: {
          type: 'WEBOS',
          code: 'keyboard_setup_failed',
          error
        }
      }));
    }
  },

  setupMediaKeys() {
    try {
      // Handle media control keys
      document.addEventListener('keydown', (event) => {
        try {
          switch (event.key) {
            case 'MediaPlayPause':
              window.dispatchEvent(new CustomEvent('webos-media', {
                detail: { action: 'playPause' }
              }));
              break;
            case 'MediaTrackNext':
              window.dispatchEvent(new CustomEvent('webos-media', {
                detail: { action: 'next' }
              }));
              break;
            case 'MediaTrackPrevious':
              window.dispatchEvent(new CustomEvent('webos-media', {
                detail: { action: 'previous' }
              }));
              break;
          }
        } catch (error) {
          window.dispatchEvent(new CustomEvent('webos-error', {
            detail: {
              type: 'WEBOS',
              code: 'media_key_failed',
              error
            }
          }));
        }
      });
    } catch (error) {
      window.dispatchEvent(new CustomEvent('webos-error', {
        detail: {
          type: 'WEBOS',
          code: 'media_keys_setup_failed',
          error
        }
      }));
    }
  },

  setupAppLifecycle() {
    try {
      // Handle app lifecycle events
      window.addEventListener('webos-close', () => {
        try {
          // Clean up resources
          this.cleanup();
        } catch (error) {
          window.dispatchEvent(new CustomEvent('webos-error', {
            detail: {
              type: 'WEBOS',
              code: 'cleanup_failed',
              error
            }
          }));
        }
      });

      // Handle visibility change
      document.addEventListener('visibilitychange', () => {
        try {
          if (document.hidden) {
            // App is in background
            window.dispatchEvent(new CustomEvent('webos-background'));
          } else {
            // App is in foreground
            window.dispatchEvent(new CustomEvent('webos-foreground'));
          }
        } catch (error) {
          window.dispatchEvent(new CustomEvent('webos-error', {
            detail: {
              type: 'WEBOS',
              code: 'visibility_change_failed',
              error
            }
          }));
        }
      });
    } catch (error) {
      window.dispatchEvent(new CustomEvent('webos-error', {
        detail: {
          type: 'WEBOS',
          code: 'lifecycle_setup_failed',
          error
        }
      }));
    }
  },

  cleanup() {
    try {
      // Clean up resources before app closes
      // Stop any ongoing operations
      window.dispatchEvent(new CustomEvent('webos-cleanup'));
    } catch (error) {
      window.dispatchEvent(new CustomEvent('webos-error', {
        detail: {
          type: 'WEBOS',
          code: 'cleanup_failed',
          error
        }
      }));
    }
  }
};

// Initialize WebOS functionality when the page loads
window.addEventListener('load', () => {
  try {
    webOS.init();
  } catch (error) {
    window.dispatchEvent(new CustomEvent('webos-error', {
      detail: {
        type: 'WEBOS',
        code: 'init_failed',
        error
      }
    }));
  }
}); 