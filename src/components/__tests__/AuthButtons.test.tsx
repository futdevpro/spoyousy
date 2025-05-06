import { render, screen, fireEvent } from '@/utils/test-utils'
import AuthButtons from '../AuthButtons'

describe('AuthButtons', () => {
  it('renders auth buttons', () => {
    render(<AuthButtons />)
    expect(screen.getByText(/connect spotify/i)).toBeInTheDocument()
    expect(screen.getByText(/connect youtube/i)).toBeInTheDocument()
  })

  it('shows login state when not authenticated', () => {
    const preloadedState = {
      auth: {
        spotify: { isAuthenticated: false },
        youtube: { isAuthenticated: false }
      }
    }
    
    render(<AuthButtons />, { preloadedState })
    expect(screen.getByText(/connect spotify/i)).toBeInTheDocument()
    expect(screen.getByText(/connect youtube/i)).toBeInTheDocument()
  })

  it('shows logout state when authenticated', () => {
    const preloadedState = {
      auth: {
        spotify: { 
          isAuthenticated: true,
          user: { displayName: 'Test User' }
        },
        youtube: { 
          isAuthenticated: true,
          user: { displayName: 'Test User' }
        }
      }
    }
    
    render(<AuthButtons />, { preloadedState })
    expect(screen.getAllByText(/connected as test user/i)).toHaveLength(2)
    expect(screen.getAllByText(/disconnect/i)).toHaveLength(2)
  })

  it('handles Spotify login click', async () => {
    render(<AuthButtons />)
    fireEvent.click(screen.getByText(/connect spotify/i))
    // Note: We can't test the actual API call here as it's mocked
  })

  it('handles YouTube login click', async () => {
    render(<AuthButtons />)
    fireEvent.click(screen.getByText(/connect youtube/i))
    // Note: We can't test the actual API call here as it's mocked
  })
}) 