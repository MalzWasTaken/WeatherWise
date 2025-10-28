import db from '../db/db.js';

const getAllUsers = async () => {
    const results = await db
        .select('*')
        .from('users')
        .orderBy([{ column: 'lastname', order: 'asc' }]);
    console.log(results);
    return results;
};

const addOneUser = async (data) => {
    console.log(data);
    const { firstname, lastname, email } = data;

    const [id] = await db('users')
        .insert({
            firstname,
            lastname,
            email
        })
        .returning('id');
    return id;
};  

const deleteAUser = async (id) => {
    const result = await db('users')
        .where({ id })
        .del();
    return result;
}

const getAUser = async (id) => {
    const result = await db('users')
        .where({ id })
        .first();
    return result;
};

export { getAllUsers, addOneUser, deleteAUser, getAUser };