import Tickets from '../models/Tickets.model.js';

/**
 * Create new Tickets
 */
export const createTickets = async (TicketsData) => {
  return await Tickets.create(TicketsData);
};

/**
 * Find Tickets by ID
 */
export const findTicketsById = async (TicketsId) => {
  return await Tickets.findById(TicketsId);
};

/**
 * Find Tickets by ID and user ID
 */
export const findTicketsByIdAndUserId = async (TicketsId, userId) => {
  return await Tickets.findOne({
    _id: TicketsId,
    'createdBy._id': userId,
  });
};

/**
 * Find all Tickets by user ID
 */
export const findTicketsByUserId = async (userId, filters = {}) => {
  const query = { 'createdBy._id': userId };
  
  if (filters.type) {
    query.type = filters.type;
  }

  return await Tickets.find(query).sort({ createdAt: -1 });
};

/**
 * Count Tickets by user ID
 */
export const countTicketsByUserId = async (userId, type = null) => {
  const query = { 'createdBy._id': userId };
  
  if (type) {
    query.type = type;
  }

  return await Tickets.countDocuments(query);
};

/**
 * Update Tickets by ID
 */
export const updateTicketsById = async (TicketsId, userId, updateData) => {
  return await Tickets.findOneAndUpdate(
    { _id: TicketsId, 'createdBy._id': userId },
    updateData,
    { new: true }
  );
};

/**
 * Delete Tickets by ID
 */
export const deleteTicketsById = async (TicketsId, userId) => {
  return await Tickets.findOneAndDelete({
    _id: TicketsId,
    'createdBy._id': userId,
  });
};

