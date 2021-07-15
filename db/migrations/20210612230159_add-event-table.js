exports.up = function (knex) {
    return knex.schema
      .createTable("event", function (table) {
        table.uuid("id").defaultTo(knex.raw('gen_random_uuid()')).primary();
        table.uuid("odds_id").notNullable().references('id').inTable('odds');;
        table.string("type").notNullable();
        table.string("home_team").notNullable();
        table.string("away_team").notNullable();
        table.string("score");
        table.timestamp("start_at").notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("event");
  };
  