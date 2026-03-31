import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from '../controllers/Ticket/Ticket.controller.js';

// Middleware imports
import { authMiddleware } from '../middlewares/auth/auth.middleware.js';
import { checkTicketLimit } from '../middlewares/checkTicketLimit.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';

// DTO imports
import { createTicketsDto, updateTicketDto } from '../dto/Ticket.dto.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create Ticket (with limit check)
router.post('/', checkTicketLimit, validate(createTicketsDto), createTicket);

// Get all Tickets
router.get('/', getTickets);

// Get Ticket by ID
router.get('/:id', getTicketById);

// Update Ticket by ID
router.put('/:id', validate(updateTicketsDto), updateTicket);

// Delete Ticket by ID
router.delete('/:id', deleteTicket);

export default router;

