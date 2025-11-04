import express from 'express';
import { getUsers, addUsers, deleteUser, getSingleUserById, getSingleUserByEmail, updateUser} from '../controllers/users.js';
import { check } from 'express-validator';

const router = express.Router();

router.get("/", (req, res) => {
    getUsers(req, res);
});

router.post("/add", (req, res) => {
    addUsers(req, res);
});

router.delete("/del/:id", (req, res) => {
    deleteUser(req, res);
});

router.get("/id/:id", (req, res) => {
    getSingleUserById(req, res);
});

router.get("/email/:email", (req, res) => {
    getSingleUserByEmail(req, res);
});

router.put("/update/:id", (req, res) => {
    updateUser(req, res);
});

export default router;