exports.seed = (knex) => {
  return knex("bet")
    .then(() => {
      return knex("bet").insert([
        {
          event_id: "154baa1f-2102-4874-a488-aa2713b9c2d3",
          bet_amount: 100,
          prediction: "w1",
          multiplier: 1.4,
          user_id: '860329e2-ae5c-49f4-ba8b-38c49c6e1838'
        }
      ]);
    });
};
