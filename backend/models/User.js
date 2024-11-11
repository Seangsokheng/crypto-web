import db from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = {
    create: async (email, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        return result.rows[0];
    },

    findByEmail: async (email) => {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result;
    },
     findById: async (id) => {
        const result = await db.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },
    updateUser : async (id, { updatedUsername, updatedImage }) => {
        console.log("db",updatedUsername,updatedImage,id);
        const query = 'UPDATE users SET username = $1, image = $2 WHERE id = $3';
        const values = [updatedUsername, updatedImage, id];
        return await db.query(query, values);
    },
    deleteUser :  async (id) => {
        return await db.query('DELETE FROM users WHERE id = $1', [id]);
    },

};

export default User;
