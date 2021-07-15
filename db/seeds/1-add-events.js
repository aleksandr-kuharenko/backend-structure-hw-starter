exports.seed = (knex) => {
  return knex("odds")
    .then(() => {
      return knex("odds").insert([
        {
          id: "e653b50c-3aa6-4ad0-a925-b95642e30358",
          home_win: 1.4,
          draw: 3.3,
          away_win: 7.2,
        },
      ]);
    })
    .then(() => {
      knex("event")
        .then(() => {
          return knex("event").insert([
            {
              id: "154baa1f-2102-4874-a488-aa2713b9c2d3",
              odds_id: "e653b50c-3aa6-4ad0-a925-b95642e30358",
              type: "football",
              home_team: "Ukraine",
              away_team: "England",
              start_at: "2021-07-03T22:22:09.900Z",
            },
          ]);
        });
    });
};
