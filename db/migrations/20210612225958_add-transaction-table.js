exports.up = function (knex) {
    return knex.schema
      .createTable("transaction", function (table) {
        table.uuid("id").defaultTo(knex.raw('gen_random_uuid()')).primary();
        table.uuid("user_id").notNullable().references('id').inTable('user');
        table.string("card_number").notNullable();
        table.float("amount").notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("transaction");
  };
  