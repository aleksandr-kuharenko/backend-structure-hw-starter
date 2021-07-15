exports.up = function (knex) {
    return knex.schema
      .createTable("bet", function (table) {
        table.uuid("id").defaultTo(knex.raw('gen_random_uuid()')).primary();
        table.uuid("event_id").notNullable().references('id').inTable('event');
        table.uuid("user_id").notNullable().references('id').inTable('user');
        table.float("bet_amount").notNullable();
        table.string("prediction").notNullable();
        table.float("multiplier").notNullable();
        table.boolean("win");
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("bet");
  };
  