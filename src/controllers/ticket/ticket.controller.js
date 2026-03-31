import * as TicketDatasource from '../../datasource/Ticket.datasource.js';
import * as transactionDatasource from '../../datasource/transaction.datasource.js';

/**
 * Create new Ticket
 */
export const createTicket = async (req, res) => {
  const { title, icon, type } = req.body;

  try {
    const TicketData = {
      createdBy: {
        _id: req.user.id,
        email: req.user.email,
      },
      title,
      icon,
      type,
    };

    const Ticket = await TicketDatasource.createTicket(TicketData);

    res.status(201).json({
      message: 'Ticket created successfully',
      data: Ticket,
      subscription: req.subscription, // Info from checkTicketLimit middleware
    });
  } catch (error) {
    console.error('Create Ticket Error:', error);
    res.status(500).json({
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
};

/**
 * Get all categories for current user
 */
export const getCategories = async (req, res) => {
  try {
    const { type } = req.query;

    const categories = await TicketDatasource.findCategoriesByUserId(
      req.user.id,
      { type }
    );

    // Get Ticket IDs to calculate total amounts
    const TicketIds = categories.map(cat => cat._id);

    // Get total amounts for all categories
    const amountsByTicket = await transactionDatasource.getTotalAmountsByTicketIds(
      req.user.id,
      TicketIds
    );

    // Map categories with amount
    const categoriesWithAmount = categories.map(Ticket => {
      const TicketId = Ticket._id.toString();
      const amount = amountsByTicket[TicketId] || 0;

      return {
        ...Ticket.toObject(),
        amount: amount,
      };
    });

    res.status(200).json({
      data: categoriesWithAmount,
      total: categoriesWithAmount.length,
    });
  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
};

/**
 * Get Ticket by ID
 */
export const getTicketById = async (req, res) => {
  const { id } = req.params;

  try {
    const Ticket = await TicketDatasource.findTicketByIdAndUserId(
      id,
      req.user.id
    );

    if (!Ticket) {
      return res.status(404).json({
        message: 'Ticket not found',
        code: 'Ticket_NOT_FOUND',
      });
    }

    res.status(200).json({
      data: Ticket,
    });
  } catch (error) {
    console.error('Get Ticket By ID Error:', error);
    res.status(500).json({
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
};

/**
 * Update Ticket by ID
 */
export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { title, icon, type } = req.body;

  try {
    const updateData = {};
    
    if (title !== undefined) updateData.title = title;
    if (icon !== undefined) updateData.icon = icon;
    if (type !== undefined) updateData.type = type;

    const Ticket = await TicketDatasource.updateTicketById(
      id,
      req.user.id,
      updateData
    );

    if (!Ticket) {
      return res.status(404).json({
        message: 'Ticket not found',
        code: 'Ticket_NOT_FOUND',
      });
    }

    res.status(200).json({
      message: 'Ticket updated successfully',
      data: Ticket,
    });
  } catch (error) {
    console.error('Update Ticket Error:', error);
    res.status(500).json({
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
};

/**
 * Delete Ticket by ID
 */
export const deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    // Get Ticket first to get the name
    const Ticket = await TicketDatasource.findTicketByIdAndUserId(
      id,
      req.user.id
    );

    if (!Ticket) {
      return res.status(404).json({
        message: 'Ticket not found',
        code: 'Ticket_NOT_FOUND',
      });
    }

    // Update all transactions that use this Ticket with snapshot
    const TicketSnapshot = Ticket.title;
    const updateResult = await transactionDatasource.updateTicketSnapshot(
      id,
      TicketSnapshot
    );

    // Delete Ticket
    await TicketDatasource.deleteTicketById(id, req.user.id);

    res.status(200).json({
      message: 'Ticket deleted successfully',
      data: Ticket,
    });
  } catch (error) {
    console.error('Delete Ticket Error:', error);
    res.status(500).json({
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
};

