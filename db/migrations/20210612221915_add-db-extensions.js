exports.up = function (knex) {
  return knex.schema.raw(
    'CREATE EXTENSION IF NOT EXISTS "pgcrypto" schema public'
  );
};

exports.down = function (knex) {
  return knex.schema.raw('drop extension if exists "pgcrypto"');
};
