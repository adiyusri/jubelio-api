const db = require('../db/db');

// GET /transactions - Get list of transactions with pagination
exports.getTransactions = async (request, h) => {
  const { page = 1, limit = 10 } = request.query;
  try {
    const transactions = await db.any(
      'SELECT id, sku, qty, amount FROM transactions LIMIT $1 OFFSET $2',
      [limit, (page - 1) * limit]
    );
    return h.response(transactions).code(200);
  } catch (error) {
    return h.response({ error: 'Failed to fetch transactions' }).code(500);
  }
};

// GET /transactions/:id - Get transaction details
exports.getTransactionDetails = async (request, h) => {
  const { id } = request.params;
  try {
    const transaction = await db.oneOrNone(
      'SELECT * FROM transactions WHERE id = $1',
      [id]
    );
    if (transaction) {
      return h.response(transaction).code(200);
    } else {
      return h.response({ error: 'Transaction not found' }).code(404);
    }
  } catch (error) {
    return h
      .response({ error: 'Failed to fetch transaction details' })
      .code(500);
  }
};

// POST /transactions - Create a new transaction
exports.createTransaction = async (request, h) => {
  const { sku, qty } = request.payload;
  try {
    // Get the product's price and current stock
    const product = await db.oneOrNone(
      'SELECT price, stock FROM products WHERE sku = $1',
      [sku]
    );

    if (product) {
      // Check if there is enough stock for the transaction
      if (product.stock + qty < 0) {
        return h.response({ error: 'Insufficient stock' }).code(400);
      }

      // Calculate the total amount
      const amount = product.price * qty;
      const newStock = product.stock + qty;

      // Create the transaction
      const newTransaction = await db.one(
        'INSERT INTO transactions (sku, qty, amount) VALUES ($1, $2, $3) RETURNING id',
        [sku, qty, amount]
      );

      // Update the stock in the products table
      await db.none('UPDATE products SET stock = $1 WHERE sku = $2', [
        newStock,
        sku
      ]);

      return h
        .response({
          message: 'Transaction created successfully',
          transactionId: newTransaction.id
        })
        .code(201);
    } else {
      return h.response({ error: 'Product not found' }).code(404);
    }
  } catch (error) {
    return h.response({ error: 'Failed to create transaction' }).code(500);
  }
};

// PUT /transactions/:id - Update transaction details
exports.updateTransaction = async (request, h) => {
  const { id } = request.params;
  const { sku, qty } = request.payload;
  try {
    const product = await db.oneOrNone(
      'SELECT price FROM products WHERE sku = $1',
      [sku]
    );
    if (product) {
      const amount = product.price * qty;
      const result = await db.result(
        'UPDATE transactions SET sku = $1, qty = $2, amount = $3 WHERE id = $4',
        [sku, qty, amount, id]
      );
      if (result.rowCount > 0) {
        return h
          .response({ message: 'Transaction updated successfully' })
          .code(200);
      } else {
        return h.response({ error: 'Transaction not found' }).code(404);
      }
    } else {
      return h.response({ error: 'Product not found' }).code(404);
    }
  } catch (error) {
    return h.response({ error: 'Failed to update transaction' }).code(500);
  }
};

// DELETE /transactions/:id - Delete a transaction
exports.deleteTransaction = async (request, h) => {
  const { id } = request.params;
  try {
    const result = await db.result('DELETE FROM transactions WHERE id = $1', [
      id
    ]);
    if (result.rowCount > 0) {
      return h
        .response({ message: 'Transaction deleted successfully' })
        .code(200);
    } else {
      return h.response({ error: 'Transaction not found' }).code(404);
    }
  } catch (error) {
    return h.response({ error: 'Failed to delete transaction' }).code(500);
  }
};
