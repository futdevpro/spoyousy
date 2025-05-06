import { render, screen, fireEvent } from '@/utils/test-utils'
import Settings from '../Settings'

describe('Settings', () => {
  it('renders settings button', () => {
    render(<Settings />)
    expect(screen.getByText(/settings/i)).toBeInTheDocument()
  })

  it('opens settings modal when button is clicked', () => {
    render(<Settings />)
    fireEvent.click(screen.getByText(/settings/i))
    
    expect(screen.getByText(/search preferences/i)).toBeInTheDocument()
    expect(screen.getByText(/sync settings/i)).toBeInTheDocument()
    expect(screen.getByText(/manual override/i)).toBeInTheDocument()
  })

  it('updates search preferences', () => {
    const preloadedState = {
      settings: {
        searchPreferences: {
          useExactMatch: false,
          includeRemixes: false,
          includeLiveVersions: false
        },
        autoResync: false,
        manualVideoOverride: null
      }
    }
    
    render(<Settings />, { preloadedState })
    fireEvent.click(screen.getByText(/settings/i))
    
    const exactMatchCheckbox = screen.getByLabelText(/use exact match/i)
    fireEvent.click(exactMatchCheckbox)
    expect(exactMatchCheckbox).toBeChecked()
  })

  it('updates auto resync setting', () => {
    const preloadedState = {
      settings: {
        searchPreferences: {
          useExactMatch: false,
          includeRemixes: false,
          includeLiveVersions: false
        },
        autoResync: false,
        manualVideoOverride: null
      }
    }
    
    render(<Settings />, { preloadedState })
    fireEvent.click(screen.getByText(/settings/i))
    
    const autoResyncCheckbox = screen.getByLabelText(/auto-resync/i)
    fireEvent.click(autoResyncCheckbox)
    expect(autoResyncCheckbox).toBeChecked()
  })

  it('updates manual video override', () => {
    const preloadedState = {
      settings: {
        searchPreferences: {
          useExactMatch: false,
          includeRemixes: false,
          includeLiveVersions: false
        },
        autoResync: false,
        manualVideoOverride: null
      }
    }
    
    render(<Settings />, { preloadedState })
    fireEvent.click(screen.getByText(/settings/i))
    
    const overrideInput = screen.getByPlaceholderText(/youtube video id/i)
    fireEvent.change(overrideInput, { target: { value: 'test123' } })
    expect(overrideInput).toHaveValue('test123')
  })

  it('closes settings modal when close button is clicked', () => {
    render(<Settings />)
    fireEvent.click(screen.getByText(/settings/i))
    fireEvent.click(screen.getByText(/close/i))
    
    expect(screen.queryByText(/search preferences/i)).not.toBeInTheDocument()
  })
}) 