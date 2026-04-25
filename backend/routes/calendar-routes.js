import express from 'express';
import { createCalendarEvent, getAuthUrl, getTokensFromCode } from '../lib/calendar-service.js';
import Organizer from '../model/Organizer.js';
import Event from '../model/Events.js';
import { protect } from '../middleware/auth-middleware.js';

const router = express.Router();

router.get('/connect', protect, (req, res) => {
  const url = getAuthUrl(req.organizer._id.toString());
  res.json({ url });
});

router.get('/callback', async (req, res) => {
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
  try {
    const { code, state } = req.query;
    if (!code || !state) {
      return res.redirect(`${FRONTEND_URL}/organizer/events?calendar=error`);
    }

    const tokens = await getTokensFromCode(code);
    
    await Organizer.findByIdAndUpdate(state, {
      googleTokens: tokens
    });

    const unsyncedEvents = await Event.find({
      organizerId: state,
      status: 'published',
      $or: [
        { googleCalendarEventId: null },
        { googleCalendarEventId: { $exists: false } }
      ]
    });

    for (const event of unsyncedEvents) {
      const result = await createCalendarEvent(tokens, event);
      if (result.success) {
        event.googleCalendarEventId = result.googleEventId;
        event.calendarSyncStatus = 'synced';
        event.calendarSyncError = null;
      } else {
        event.calendarSyncStatus = 'failed';
        event.calendarSyncError = result.error || 'Failed to create Google Calendar event.';
      }
      await event.save();
    }

    res.redirect(`${FRONTEND_URL}/organizer/events?calendar=connected`);
  } catch (err) {
    console.error('Calendar callback error:', err);
    res.redirect(`${FRONTEND_URL}/organizer/events?calendar=error`);
  }
});

router.get('/status', protect, async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.organizer._id);
    res.json({ connected: !!organizer.googleTokens });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check status' });
  }
});

export default router;