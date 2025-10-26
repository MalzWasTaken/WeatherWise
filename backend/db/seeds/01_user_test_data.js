/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("users").del();

  await knex("users").insert([
    {
      id: 1,
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
    },
    {
      id: 2,
      firstname: "Jane",
      lastname: "Smith",
      email: "jane.smith@example.com",
    },
    {
      id: 3,
      firstname: "Alice",
      lastname: "Johnson",
      email: "alice.johnson@example.com",
    },
  ]);
}
