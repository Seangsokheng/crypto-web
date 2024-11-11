import User from '../models/User.js';
import express from 'express';
import cors from 'cors';


const app = express();

app.use(cors());
app.use(express.json());

const viewUser = async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            // Since findById is async, await the result
            const user = await User.findById(req.user.id);
            // console.log('this is user',user)
            if (user) {
                res.json({
                    id: user.id,
                    username: user.username,
                    logoUrl: user.image, // Ensure this field exists in your User model
                    email: user.email,   // Any other user details you'd like to send
                    role: user.role
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            console.error('Error fetching user details:', err);
            res.status(500).json({ message: 'Error fetching user details' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

const updateUser = async (req, res) => {
    const userId = req.user.id; // Get user ID from session
    const { username } = req.body; // Get username from request body
    let image = null;
    const users = await User.findById(userId);
    console.log(users)
    // Check if a file is uploaded and set the photo URL
    if (req.file) {
        image = `/uploads/${req.file.filename}`; // Set the photo path for saving
    }
    const updatedUsername = username || users.username;
    const updatedImage = image || users.image;
    console.log(updatedUsername,updatedImage);
    try {
        // Update the user in the database
        await User.updateUser(userId, { updatedUsername, updatedImage });

        res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user details' });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.user.id;

    try {
        await User.deleteUser(userId);
        req.logout(); // Log the user out after deletion
        res.status(200).json({ message: 'User account deleted' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Failed to delete user account' });
    }
};

export default { viewUser, updateUser, deleteUser };