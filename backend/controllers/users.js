import { getAllUsers,addOneUser,deleteAUser, getUserByEmail, getUserById, updateAUser } from "../models/users.js";

async function getUsers(req, res) {
    try {
        const results = await getAllUsers();
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

async function addUsers(req, res) {
    try {
        const results = await addOneUser(req.body);
        return res.status(200).json(results);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

async function deleteUser(req, res) {
  try {
    const results = await deleteAUser(req.body.id);
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

async function getSingleUserByEmail(req, res) {
  try {
      const results = await getUserByEmail(req.params.email);
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

async function getSingleUserById(req, res) {
    try {
        const results = await getUserById(req.params.id);
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

async function updateUser(req, res) {
    try {
        const results = await updateAUser(req.params.id, req.body);
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}


export { getUsers, addUsers, deleteUser, getSingleUserByEmail, getSingleUserById, updateUser};