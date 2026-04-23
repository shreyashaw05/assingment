import express from 'express';
import { createEvent } from '../controllers/event-controller.js';
import {
	approveRegistration,
	getEventRegistrations,
	rejectRegistration,
	revokeRegistration,
	registerForEvent
} from '../controllers/registration-controller.js';
import { protect } from '../middleware/auth-middleware.js';

const router = express.Router();

router.post('/', protect, createEvent);
router.post('/:eventId/register', registerForEvent);
router.get('/:eventId/registrations', protect, getEventRegistrations);
router.patch('/:eventId/registrations/:registrationId/approve', protect, approveRegistration);
router.patch('/:eventId/registrations/:registrationId/reject', protect, rejectRegistration);
router.patch('/:eventId/registrations/:registrationId/revoke', protect, revokeRegistration);

export default router;