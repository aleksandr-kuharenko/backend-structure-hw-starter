exports.up = function (knex) {
  return knex.schema
    .createTable("user", function (table) {
      table.uuid("id").defaultTo(knex.raw('gen_random_uuid()')).primary();
      table.string("type").notNullable();
      table.string("email").unique().notNullable();
      table.string("phone").unique().notNullable();
      table.string("name").notNullable();
      table.float("balance").notNullable();
      table.string("city");
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user");
};
