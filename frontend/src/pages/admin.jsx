import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const [earnings, setEarnings] = useState(0);
    const [totalUser, setTotalUser] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    useEffect(() => {
        // Fetch earnings
        const fetchEarnings = async () => {
            const response = await axios.get('/admin/earnings');
            setEarnings(response.data.total_earnings);
        };

        // Fetch user count
        const fetchUsers = async () => {
            const response = await axios.get('/admin/users');
            setTotalUser(response.data.length);
        };

        fetchEarnings();
        fetchUsers();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="d-flex">
        {/* Sidebar */}
        <nav className={`bg-dark text-light p-3 vh-100 ${isSidebarOpen ? '' : 'collapsed'}`} style={{ width: isSidebarOpen ? '250px' : '80px', transition: 'width 0.3s' }}>
            <button className="btn btn-outline-light mb-3 w-100" onClick={toggleSidebar}>
                {isSidebarOpen ? <i className="fas fa-angle-double-left"></i> : <i className="fas fa-angle-double-right"></i>}
            </button>
            <ul className="navbar-nav">
                <li className="nav-item mb-3">
                    <Link className="nav-link text-light" to="/admin/users">
                        <i className="fas fa-users me-2"></i> {isSidebarOpen && 'User Management'}
                    </Link>
                </li>
                <li className="nav-item mb-3">
                    <Link className="nav-link text-light" to="/admin/wallet">
                        <i className="fas fa-wallet me-2"></i> {isSidebarOpen && 'Wallet Management'}
                    </Link>
                </li>
                <li className="nav-item mb-3">
                    <Link className="nav-link text-light" to="/">
                        <i className="fas fa-arrow-left me-2"></i> {isSidebarOpen && 'Back to Home'}
                    </Link>
                </li>
            </ul>
        </nav>

        {/* Main Content */}
        <div className="" style={{ transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '20px' : '80px' }}>
                <h1 className="text-warning">Admin Dashboard</h1>
                <div className="card bg-warning text-dark p-4 mb-4">
                    <h2>Total Earnings from Fees: ${earnings}</h2>
                </div>
                <div className="card bg-info text-light p-4 mb-4">
                    <h2>Total Registered Users: {totalUser}</h2>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
