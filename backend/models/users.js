import db from "../db/db.js";

//GET methods
const getAllUsers = async () => {
  const results = await db
    .select("*")
    .from("users")
    .orderBy([{ column: "id", order: "asc" }]);
  return results;
};

const getUserByEmail = async (email) => {
  const result = await db("users").where({ email }).first();
  return result;
};

const getUserById = async (id) => {
  const result = await db("users").where({ id }).first();

  return result;
};

//POST methods
const addOneUser = async (data) => {
  const { email, first_name, last_name, nickname, email_verified } = data;

  const [newUser] = await db("users")
    .insert({
      email,
      firstname: first_name,
      lastname: last_name,
      nickname: nickname,
      emailverified: email_verified,
    })
    .returning("*");
  return newUser;
};

//DELETE methods
const deleteAUser = async (id) => {
  const result = await db("users").where({ id }).del();
  return result;
};

const updateAUser = async (id, data) => {
  const { email, firstName, lastName, nickname, emailVerified } = data;
  const [updatedUser] = await db("users")
    .where({ id })
    .update({
      email,
      firstname: firstName,
      lastname: lastName,
      nickname: nickname,
      emailverified: emailVerified,
      updated_at: db.fn.now(),
    })
    .returning("*");
  return updatedUser || null;
};

export {
  getAllUsers,
  addOneUser,
  deleteAUser,
  getUserByEmail,
  getUserById,
  updateAUser,
};
