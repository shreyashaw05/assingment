import { NavLink, useNavigate } from 'react-router-dom'
import { buildHeaders, getApiBase, parseResponse } from '../lib/api'

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

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Event RSVP Platform</p>
        <h1>Organizer Console</h1>
      </div>

      <nav className="tabs" aria-label="Primary">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `tab${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
        <button type="button" className="tab tab-button" onClick={() => void logoutOrganizer()}>
          Logout
        </button>
      </nav>
    </header>
  )
}