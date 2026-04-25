import { useEffect, useState } from 'react'
import { buildHeaders, getApiBase, parseResponse } from '../lib/api'
import type { EventModel } from '../types'

type OrganizerEventsPageProps = {
  setStatusMessage: (value: string) => void
}

const API_BASE = getApiBase()

export function OrganizerEventsPage({ setStatusMessage }: OrganizerEventsPageProps) {
  const [events, setEvents] = useState<EventModel[]>([])
  const [loading, setLoading] = useState(false)
  const [syncingEventId, setSyncingEventId] = useState<string | null>(null)

  async function loadEvents() {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/events/mine`, {
        method: 'GET',
        credentials: 'include',
        headers: buildHeaders({ includeJson: false })
      })
      const data = await parseResponse<{ events: EventModel[] }>(response)
      setEvents(data.events || [])
      setStatusMessage(`Loaded ${data.events?.length || 0} events.`)
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to load events.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadEvents()
  }, [])

  async function syncEventToGoogleCalendar(eventId: string) {
    setSyncingEventId(eventId)
    try {
      const response = await fetch(`${API_BASE}/api/events/${eventId}/sync-calendar`, {
        method: 'POST',
        credentials: 'include',
        headers: buildHeaders({ includeJson: false })
      })
      const data = await parseResponse<{ message?: string; event?: EventModel }>(response)
      setStatusMessage(data.message ?? 'Event synced to Google Calendar.')
      await loadEvents()
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to sync event to Google Calendar.')
    } finally {
      setSyncingEventId(null)
    }
  }

  return (
    <section className="card page-card wide">
      <h2>My Events</h2>
      <div className="row">
        <button type="button" onClick={() => void loadEvents()}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Calendar Sync</th>
              <th>Registration Mode</th>
              <th>Capacity</th>
              <th>Share Link</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={7}>No events loaded.</td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{event.status}</td>
                  <td title={event.calendarSyncError || ''}>
                    {event.calendarSyncStatus || 'not_synced'}
                    {event.calendarSyncError ? ' (check tooltip)' : ''}
                  </td>
                  <td>{event.registrationMode}</td>
                  <td>{event.capacity}</td>
                  <td>
                    <a href={`/events/${event.slug}`} target="_blank" rel="noreferrer">
                      {`${window.location.origin}/events/${event.slug}`}
                    </a>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => void syncEventToGoogleCalendar(event._id)}
                      disabled={syncingEventId === event._id || event.status !== 'published'}
                      title={event.status !== 'published' ? 'Only published events can be synced.' : undefined}
                    >
                      {syncingEventId === event._id ? 'Syncing...' : 'Sync to Google Calendar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}