// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        success: true,
        accessToken: 'test-token',
        refreshToken: 'test-refresh-token',
        expiresAt: Date.now() + 3600000,
        user: {
          displayName: 'Test User',
        },
      }),
  })
) as jest.Mock; 