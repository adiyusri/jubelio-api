const Joi = require('joi');
const productsController = require('../controllers/productsController');

module.exports = [
  {
    method: 'GET',
    path: '/api/products',
    handler: productsController.getProducts,
    options: {
      validate: {
        query: Joi.object({
          title: Joi.string().optional(),
          sku: Joi.string().optional(),
          limit: Joi.number().min(1).default(8),
          page: Joi.number().min(1).default(1)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/products/{id}',
    handler: productsController.getProductDetails,
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
    path: '/api/products',
    handler: productsController.createProduct,
    options: {
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          sku: Joi.string().required(),
          image: Joi.string().uri().required(),
          price: Joi.number().positive().required(),
          stock: Joi.number().positive().required(),
          description: Joi.string().optional().required().allow('')
        })
      }
    }
  },
  {
    method: 'PATCH',
    path: '/api/products/{id}',
    handler: productsController.updateProduct,
    options: {
      validate: {
        payload: Joi.object({
          title: Joi.string(),
          image: Joi.string().optional(),
          sku: Joi.string().optional(),
          price: Joi.number().positive().optional(),
          description: Joi.string().optional().allow('')
        }),
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/products/{id}',
    handler: productsController.deleteProduct,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/populate',
    handler: productsController.importProducts
  }
];
