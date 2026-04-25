import { useState } from 'react'
import { buildHeaders, getApiBase, parseResponse } from '../lib/api'
import type { EventModel, EventStatus, RegistrationMode } from '../types'

type CreateEventPageProps = {
  setStatusMessage: (value: string) => void
  createdEvent: EventModel | null
  setCreatedEvent: (event: EventModel | null) => void
}

const API_BASE = getApiBase()

export function CreateEventPage({
  setStatusMessage,
  createdEvent,
  setCreatedEvent
}: CreateEventPageProps) {
  const initialFormState = {
    title: '',
    description: '',
    date: '',
    venue: '',
    mode: 'offline',
    capacity: 50,
    registrationMode: 'open' as RegistrationMode,
    status: 'published' as EventStatus
  }

  const [form, setForm] = useState({
    ...initialFormState
  })

  async function createEvent(event: React.FormEvent) {
    event.preventDefault()
    try {
      const response = await fetch(`${API_BASE}/api/events`, {
        method: 'POST',
        credentials: 'include',
        headers: buildHeaders(),
        body: JSON.stringify(form)
      })
      const data = await parseResponse<{ event: EventModel }>(response)
      setCreatedEvent(data.event)
      setForm({ ...initialFormState })
      setStatusMessage('Event created successfully.')
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Event creation failed.')
    }
  }

  return (
    <section className="sleek-form-container">
      <div className="form-header">
        <h2>Create Event</h2>
        <p className="subtitle">Fill out the details below to launch a new event.</p>
      </div>
      
      <form className="sleek-form stack" onSubmit={createEvent}>
        <div className="form-group">
          <input
            placeholder="Event Title"
            value={form.title}
            className="sleek-input"
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            required
          />
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="Event Description"
            value={form.description}
            className="sleek-input"
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group half-width">
            <input
              type="datetime-local"
              value={form.date}
              className="sleek-input"
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              required
            />
          </div>
          <div className="form-group half-width">
            <input
              placeholder="Venue"
              value={form.venue}
              className="sleek-input"
              onChange={(event) => setForm((prev) => ({ ...prev, venue: event.target.value }))}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group third-width">
            <input
              type="number"
              min={1}
              placeholder="Capacity"
              value={form.capacity || ''}
              className="sleek-input"
              onChange={(event) => setForm((prev) => ({ ...prev, capacity: Number(event.target.value) || 0 }))}
              required
            />
          </div>
          <div className="form-group third-width">
            <select
              value={form.registrationMode}
              className="sleek-input"
              onChange={(event) =>
                setForm((prev) => ({ ...prev, registrationMode: event.target.value as RegistrationMode }))
              }
            >
              <option value="open">Open</option>
              <option value="shortlisted">Shortlisted</option>
            </select>
          </div>
          <div className="form-group third-width">
            <select
              value={form.status}
              className="sleek-input"
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as EventStatus }))}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-solid form-submit-btn">
          Create Event
        </button>
      </form>

      {createdEvent ? (
        <div className="stark-summary">
          <p>
            <strong>✓ Event created successfully.</strong>
          </p>
          <p className="summary-details">
            {createdEvent.title} is now available in your events list.
          </p>
        </div>
      ) : null}
    </section>
  )
}