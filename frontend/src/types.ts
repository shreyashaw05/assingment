export type EventStatus = 'draft' | 'published' | 'cancelled'
export type RegistrationMode = 'open' | 'shortlisted'
export type RegistrationStatus = 'pending' | 'registered' | 'approved' | 'rejected' | 'revoked'

export type EventModel = {
  _id: string
  title: string
  description?: string
  date: string
  venue?: string
  slug: string
  registrationMode: RegistrationMode
  status: EventStatus
  capacity: number
}

export type RegistrationModel = {
  _id: string
  attendeeName: string
  attendeeEmail: string
  phone?: string | null
  status: RegistrationStatus
}