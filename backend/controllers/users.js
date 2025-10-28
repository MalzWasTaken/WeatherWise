import { getAllUsers,addOneUser,deleteAUser, getAUser } from "../models/users.js";

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
    // console.log(`req.body... ${JSON.stringify(req.body)}...`);
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

async function getSingleUser(req, res) {
  try {
      const results = await getAUser(req.params.id);
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

export { getUsers, addUsers, deleteUser, getSingleUser };