// migration file for products table
exports.up = function (knex) {
  return knex.schema
    .createTable('products', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('sku').notNullable().unique();
      table.string('image').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.integer('stock').notNullable().defaultTo(0);
      table.text('description').notNullable();
      table.timestamps(true, true);
    })
    .createTable('transactions', (table) => {
      table.increments('id').primary();
      table.string('sku').notNullable();
      table.integer('qty').notNullable();
      table.decimal('amount', 10, 2).notNullable();
      table.timestamps(true, true);

      table.foreign('sku').references('products.sku').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('transactions')
    .dropTableIfExists('products');
};
