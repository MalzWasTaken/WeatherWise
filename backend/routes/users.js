import express from 'express';
import { getUsers, addUsers, deleteUser, getSingleUser } from '../controllers/users.js';
import { check } from 'express-validator';

const router = express.Router();

router.get("/", (req, res) => {
    getUsers(req, res);
});

router.post("/add", (req, res) => {
    addUsers(req, res);
});

router.delete("/", (req, res) => {
    deleteUser(req, res);
});

router.get("/:id", (req, res) => {
    getSingleUser(req, res);
});

export default router;