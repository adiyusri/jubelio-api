const Joi = require('joi');
const adjustmentTransactionsController = require('../controllers/adjustmentTransactionsController');

module.exports = [
  {
    method: 'GET',
    path: '/api/transactions',
    handler: adjustmentTransactionsController.getTransactions,
    options: {
      validate: {
        query: Joi.object({
          limit: Joi.number().min(1).default(8),
          page: Joi.number().min(1).default(1)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/transactions/{id}',
    handler: adjustmentTransactionsController.getTransactionDetails,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/transactions',
    handler: adjustmentTransactionsController.createTransaction,
    options: {
      validate: {
        payload: Joi.object({
          sku: Joi.string().required(),
          qty: Joi.number().required()
        })
      }
    }
  },
  {
    method: 'PATCH',
    path: '/api/transactions/{id}',
    handler: adjustmentTransactionsController.updateTransaction,
    options: {
      validate: {
        payload: Joi.object({
          sku: Joi.string().required(),
          qty: Joi.number().min(1).required()
        }),
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/transactions/{id}',
    handler: adjustmentTransactionsController.deleteTransaction,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    }
  }
];
