exports.seed = (knex) => {
  return knex("user")
    .then(() => {
      return knex("user").insert([
        {
          id: "c486ab55-5c4b-4689-8f57-ace155ea65b4",
          type: "client",
          phone: "380505443322",
          name: "Alex",
          email: "alex@gmail.com",
          balance: 0,
        },
        {
          id: "0f290598-1b54-4a36-8c58-33caa7d08b5f",
          type: "client",
          phone: "380952768899",
          name: "Ivan",
          email: "ivan@gmail.com",
          balance: 50,
        },
        {
          id: "860329e2-ae5c-49f4-ba8b-38c49c6e1838",
          type: "client",
          phone: "380572764821",
          name: "Sasha",
          email: "sasha@gmail.com",
          balance: 0,
        },
      ]);
    });
};
