import Event from '../model/Events.js';

function createSlugBase(title) {
    return title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
}

async function createUniqueSlug(title) {
    const baseSlug = createSlugBase(title) || 'event';
    let slug = baseSlug;
    let suffix = 1;

    while (await Event.findOne({ slug })) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
    }

    return slug;
}

export async function createEvent(req, res) {
    try {
        const {
            title,
            description,
            date,
            venue,
            mode,
            capacity,
            registrationMode,
            status
        } = req.body;

        if (!title || !date || capacity === undefined || capacity === null) {
            return res.status(400).json({ message: 'Title, date, and capacity are required.' });
        }

        const eventDate = new Date(date);
        if (Number.isNaN(eventDate.getTime())) {
            return res.status(400).json({ message: 'A valid event date is required.' });
        }

        const event = await Event.create({
            title: title.trim(),
            description: description?.trim(),
            date: eventDate,
            venue: venue?.trim(),
            mode,
            capacity,
            registrationMode,
            status,
            organizerId: req.organizer._id,
            slug: await createUniqueSlug(title)
        });

        return res.status(201).json({
            message: 'Event created successfully.',
            event
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error while creating event.' });
    }
}