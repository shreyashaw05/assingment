import { google } from 'googleapis';

const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || '').trim();
const GOOGLE_CLIENT_SECRET = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
const GOOGLE_REDIRECT_URI = (process.env.GOOGLE_REDIRECT_URI || '').trim();

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

export function getAuthUrl(state) {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    prompt: 'consent',
    state
  });
}

export async function getTokensFromCode(code) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export function createClientWithTokens(tokens) {
  const client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
  client.setCredentials(tokens);
  return client;
}

export async function createCalendarEvent(tokens, event) {
  try {
    const auth = createClientWithTokens(tokens);
    const calendar = google.calendar({ version: 'v3', auth });
    
    const calendarEvent = {
      summary: event.title,
      description: event.description,
      location: event.venue || 'Online',
      start: { dateTime: new Date(event.date).toISOString() },
      end: { dateTime: new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString() }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: calendarEvent
    });

    return { success: true, googleEventId: response.data.id };
  } catch (err) {
    console.error('Calendar create failed:', err);
    return { success: false, error: err?.message || 'Calendar create failed' };
  }
}

export async function updateCalendarEvent(tokens, googleEventId, event) {
  try {
    const auth = createClientWithTokens(tokens);
    const calendar = google.calendar({ version: 'v3', auth });

    await calendar.events.update({
      calendarId: 'primary',
      eventId: googleEventId,
      resource: {
        summary: event.title,
        description: event.description,
        location: event.venue || 'Online',
        start: { dateTime: new Date(event.date).toISOString() },
        end: { dateTime: new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString() }
      }
    });

    return { success: true };
  } catch (err) {
    console.error('Calendar update failed:', err);
    return { success: false, error: err?.message || 'Calendar update failed' };
  }
}

export async function deleteCalendarEvent(tokens, googleEventId) {
  try {
    const auth = createClientWithTokens(tokens);
    const calendar = google.calendar({ version: 'v3', auth });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: googleEventId
    });

    return { success: true };
  } catch (err) {
    console.error('Calendar delete failed:', err);
    return { success: false, error: err?.message || 'Calendar delete failed' };
  }
}