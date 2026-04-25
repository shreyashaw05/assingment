import { NavLink, useNavigate } from 'react-router-dom'
import { buildHeaders, getApiBase, parseResponse } from '../lib/api'
import { useEffect, useState } from 'react'

const links = [
  { to: '/organizer/events/create', label: 'Create Event' },
  { to: '/organizer/events', label: 'My Events', end: true },
  { to: '/organizer/review', label: 'Review RSVP' }
]

type NavbarProps = {
  setStatusMessage: (value: string) => void
}

const API_BASE = getApiBase()

export function Navbar({ setStatusMessage }: NavbarProps) {
  const navigate = useNavigate()
  const [isCalendarConnected, setIsCalendarConnected] = useState<boolean | null>(null)

  useEffect(() => {
    let active = true

    async function loadCalendarStatus() {
      try {
        const response = await fetch(`${API_BASE}/api/calendar/status`, {
          method: 'GET',
          credentials: 'include',
          headers: buildHeaders({ includeJson: false })
        })
        const data = await parseResponse<{ connected: boolean }>(response)
        if (active) {
          setIsCalendarConnected(Boolean(data.connected))
        }
      } catch (_error) {
        if (active) {
          setIsCalendarConnected(false)
        }
      }
    }

    void loadCalendarStatus()
    return () => {
      active = false
    }
  }, [])

  async function logoutOrganizer() {
    try {
      const response = await fetch(`${API_BASE}/api/organisations/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: buildHeaders({ includeJson: false })
      })
      const data = await parseResponse<{ message?: string }>(response)
      setStatusMessage(data.message ?? 'Logged out successfully.')
      navigate('/organizer/auth')
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to logout.')
    }
  }

  const handleConnectCalendar = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/calendar/connect`, {
        method: 'GET',
        credentials: 'include',
        headers: buildHeaders({ includeJson: false })
      })
      const data = await parseResponse<{ url: string }>(response)
      window.location.href = data.url
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Failed to connect Google Calendar.')
    }
  }

  return (
    <header className="sleek-navbar">
      <div className="navbar-brand">
        <span className="navbar-title">Organizer Console</span>
      </div>

      <nav className="navbar-links" aria-label="Primary">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar-actions">
        <div className="calendar-status">
          {isCalendarConnected === false && (
            <button 
              type="button" 
              className="btn-outline" 
              onClick={() => void handleConnectCalendar()}
            >
              Connect Calendar
            </button>
          )}
          {isCalendarConnected === true && (
            <span className="status-badge connected">Calendar Connected</span>
          )}
        </div>
        <button 
          type="button" 
          className="btn-solid" 
          onClick={() => void logoutOrganizer()}
        >
          Logout
        </button>
      </div>
    </header>
  )
}