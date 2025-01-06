import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [updatedInfo, setUpdatedInfo] = useState({ email: '', role: '' });

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await axios.get('/admin/users');
            setUsers(response.data);
        };
        fetchUsers();
    }, []);

    const startEditing = (user) => {
        setEditingUser(user.id);
        setUpdatedInfo({ email: user.email, role: user.role });
    };

    const stopEditing = () => {
        setEditingUser(null);
    };

    const handleSave = async (userId) => {
        try {
            await axios.patch(`/admin/users/${userId}`, updatedInfo);
            setUsers(users.map(user => (user.id === userId ? { ...user, ...updatedInfo } : user)));
            stopEditing();
            alert('User updated successfully');
        } catch (error) {
            alert('Error updating user');
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`/admin/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));  // Update state to remove deleted user
            alert('User deleted successfully');
        } catch (error) {
            alert('Error deleting user');
        }
    };

    return (
        <div className="container mt-4">
            <li className="nav-item mb-3">
                    <Link className="nav-link text-light" to="/admin">
                        <i className="fas fa-arrow-left me-2"></i>Back to Home
                    </Link>
            </li>
            <h1 className="text-warning">User Management</h1>
            <table className="table table-dark table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Balance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td><img src={user?.image} alt="User Logo" className="coin-logo" 
                            style={{ 
                                    width: '80px', 
                                    height: '80px', // Set the height to match the width for a square shape
                                    objectFit: 'cover', // This will ensure the image covers the container without distortion
                                    borderRadius: '50%' // This makes the image circular, if that's what you want
                                }} /></td>
                            <td>{user.username}</td>
                            <td>
                                {editingUser === user.id ? (
                                    <input
                                        type="text"
                                        value={updatedInfo.email}
                                        onChange={(e) => setUpdatedInfo({ ...updatedInfo, email: e.target.value })}
                                    />
                                ) : (
                                    user.email
                                )}
                            </td>
                            <td>
                                {editingUser === user.id ? (
                                    <input
                                        type="text"
                                        value={updatedInfo.role}
                                        onChange={(e) => setUpdatedInfo({ ...updatedInfo, role: e.target.value })}
                                    />
                                ) : (
                                    user.role
                                )}
                            </td>
                            <td>${user.money}</td>
                            <td>
                                {editingUser === user.id ? (
                                    <>
                                        <button
                                            className="btn btn-success me-2"
                                            onClick={() => handleSave(user.id)}
                                        >
                                            Save
                                        </button>
                                        <button className="btn btn-secondary" onClick={stopEditing}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-warning me-2"
                                            onClick={() => startEditing(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
