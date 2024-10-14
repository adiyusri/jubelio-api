const db = require('../db/db');
const httpsHelper = require('../helpers/httpsHelper');

// GET /products - Get list of products with pagination
exports.getProducts = async (request, h) => {
  const { page = 1, limit = 8 } = request.query;
  try {
    const products = await db.any(
      'SELECT id, title, sku, image, price, stock FROM products ORDER BY id DESC LIMIT $1 OFFSET $2',
      [limit, (page - 1) * limit]
    );
    return h.response(products).code(200);
  } catch (error) {
    return h.response({ error: 'Failed to fetch products' }).code(500);
  }
};

// GET /products/:id - Get product details
exports.getProductDetails = async (request, h) => {
  const { id } = request.params;
  try {
    const product = await db.oneOrNone(
      'SELECT id, title, sku, image, price, stock, description FROM products WHERE id = $1',
      [id]
    );
    if (product) {
      return h.response(product).code(200);
    } else {
      return h.response({ error: 'Product not found' }).code(404);
    }
  } catch (error) {
    return h.response({ error: 'Failed to fetch product details' }).code(500);
  }
};

// POST /products - Create a new product
exports.createProduct = async (request, h) => {
  const { title, sku, image, price, description } = request.payload;
  try {
    const newProduct = await db.one(
      'INSERT INTO products (title, sku, image, price, stock, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [title, sku, image, price, 0, description]
    );
    return h
      .response({
        message: 'Product created successfully',
        productId: newProduct.id
      })
      .code(201);
  } catch (error) {
    return h.response({ error: 'Failed to create product' }).code(500);
  }
};

// PUT /products/:id - Update product details
exports.updateProduct = async (request, h) => {
  const { id } = request.params;
  const { title, sku, image, price, description } = request.payload;

  try {
    // Store the fields to be updated in an array
    const fields = [];
    const values = [];

    if (title) {
      fields.push('title = $' + (fields.length + 1));
      values.push(title);
    }
    if (sku) {
      fields.push('sku = $' + (fields.length + 1));
      values.push(sku);
    }
    if (image) {
      fields.push('image = $' + (fields.length + 1));
      values.push(image);
    }
    if (price) {
      fields.push('price = $' + (fields.length + 1));
      values.push(price);
    }
    if (description) {
      fields.push('description = $' + (fields.length + 1));
      values.push(description);
    }

    // If there are no fields to update, return a 400 response
    if (fields.length === 0) {
      return h.response({ error: 'No fields to update' }).code(400);
    }

    // Construct the update query
    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = $${
      fields.length + 1
    }`;
    values.push(id);

    // Execute the update query
    const result = await db.result(query, values);

    if (result.rowCount > 0) {
      return h.response({ message: 'Product updated successfully' }).code(200);
    } else {
      return h.response({ error: 'Product not found' }).code(404);
    }
  } catch (error) {
    return h.response({ error: 'Failed to update product' }).code(500);
  }
};

// DELETE /products/:id - Delete a product
exports.deleteProduct = async (request, h) => {
  const { id } = request.params;
  try {
    const result = await db.result('DELETE FROM products WHERE id = $1', [id]);
    if (result.rowCount > 0) {
      return h.response({ message: 'Product deleted successfully' }).code(200);
    } else {
      return h.response({ error: 'Product not found' }).code(404);
    }
  } catch (error) {
    return h.response({ error: 'Failed to delete product' }).code(500);
  }
};

exports.importProducts = async (request, h) => {
  try {
    const host = process.env.DUMMY_HOST;
    const data = await httpsHelper(host);
    const products = data.products;

    for (const product of products) {
      const { title, sku, images, price, description } = product;

      const existingProduct = await db.oneOrNone(
        'SELECT 1 FROM products WHERE sku = $1',
        [sku]
      );
      if (!existingProduct) {
        await db.none(
          'INSERT INTO products (title, sku, image, price, stock, description) VALUES ($1, $2, $3, $4, $5, $6)',
          [title, sku, images[0], price, 0, description]
        );
      }
    }

    return h.response({ message: 'Products imported successfully' }).code(200);
  } catch (error) {
    return h.response({ error: 'Failed to import products' }).code(500);
  }
};
