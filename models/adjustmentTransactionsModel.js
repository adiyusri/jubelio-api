const db = require('../db/db');

const addNewTransactions = (payload) => {
  const { sku, qty } = payload;
  return db.query(
    `INSERT INTO "AdjustmentTransactions" (sku, qty) 
         VALUES ($1, $2) RETURNING *`,
    [sku, qty]
  );
};

const getTransactionsList = () => {
  return db.any(`SELECT * FROM `);
};

module.exports = { addNewTransactions };
