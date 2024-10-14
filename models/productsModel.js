const db = require('../db/db');

const getProductList = (query) => {
  const { limit, page } = query;
  const offset = (page - 1) * limit;
  return db.any(
    `SELECT p.title, p.sku, p.image, p.price, COALESCE(SUM(t.qty), 0) AS stock
     FROM "Products" p
     LEFT JOIN "AdjustmentTransactions" t ON p.sku = t.sku
     GROUP BY p.sku, p.title, p.image, p.price
     OFFSET $1 LIMIT $2`,
    [offset, limit]
  );
};

const getProductDetail = (sku) => {
  return db.oneOrNone(
    `SELECT p.title, p.sku, p.image, p.price, COALESCE(SUM(t.qty), 0) AS stock
     FROM "Products" p
     LEFT JOIN "AdjustmentTransactions" t ON p.sku = t.sku
     WHERE p.sku = $1
     GROUP BY p.sku, p.title, p.image, p.price`,
    [sku]
  );
};

const addNewProduct = (payload) => {
  const { title, sku, image, price, description } = payload;
  return db.one(
    `INSERT INTO "Products" (title, sku, image, price, description) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, sku, image, price, description]
  );
};

const deleteProduct = (sku) => {
  return db.oneOrNone('DELETE FROM "Products" WHERE sku = $1 RETURNING *', [
    sku
  ]);
};

const updateProduct = (payload) => {
  const { title, image, price, description, sku } = payload;
  return db.oneOrNone(
    `UPDATE "Products" 
         SET title = COALESCE($1, title),
             image = COALESCE($2, image), 
             price = COALESCE($3, price), 
             description = COALESCE($4, description) 
         WHERE sku = $5 
         RETURNING *`,
    [title, image, price, description, sku]
  );
};

module.exports = {
  getProductList,
  getProductDetail,
  addNewProduct,
  deleteProduct,
  updateProduct
};
