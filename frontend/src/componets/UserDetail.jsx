import React, { useEffect, useState } from 'react';

const UserDetails = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [photo, setPhoto] = useState(null);
    useEffect(() => {
        const fetchUserDetails = async () => {
            const response = await fetch('/auth/user');
            const data = await response.json();
            setUser(data);
            setUsername(data.username);
            setPhoto(data.logoUrl);
        };

        fetchUserDetails();
    }, []);
    
    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]); // Get the selected file
    };

     // Update user information (except email)
     const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('username', username); // Append username
        formData.append('photo', photo); // Append photo file
        try {
            const response = await fetch('/auth/updateuser', {
                method: 'PATCH',
                body: formData, // Send formData
                credentials: 'include',
            });
            if (response.ok) {
                alert('User information updated successfully.');
            } else {
                alert('Failed to update user information.');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    // Delete user account
    const handleDelete = async () => {
        try {
            const response = await fetch('/auth/delete-account', {
                method: 'DELETE',
                credentials: 'include',
            });
            if (response.ok) {
                alert('Account deleted.');
                // Redirect or log the user out after deletion
            } else {
                alert('Failed to delete account.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
        <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col col-lg-6 mb-4 mb-lg-0">
                    <div className="card mb-3" style={{ borderRadius: '.5rem' }}>
                        <div className="row g-0">
                        <div className="col-md-4 gradient-custom text-center text-white"
                            style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                            <img 
                                src={photo || 'https://via.placeholder.com/150'} 
                                alt="Avatar" 
                                className="img-fluid my-5" 
                                style={{ 
                                    width: '80px', 
                                    height: '80px', // Set the height to match the width for a square shape
                                    objectFit: 'cover', // This will ensure the image covers the container without distortion
                                    borderRadius: '50%' // This makes the image circular, if that's what you want
                                }} 
                            />
                            <h5>{user?.username}</h5>
                        </div>
                            <div className="col-md-8">
                                <div className="card-body p-4">
                                    <h6>Update Information</h6>
                                    <hr className="mt-0 mb-4" />
                                    <div className="mb-3">
                                        <label>Username</label>
                                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Upload Photo</label>
                                        <input type="file" onChange={handleFileChange} className="form-control" />
                                    </div>
                                    <button className="btn btn-primary" onClick={handleUpdate}>Update Info</button>
                                    <button className="btn btn-danger" onClick={handleDelete}>Delete Account</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
};

export default UserDetails;
