import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import CrytoDashboard from './CryptoDashboard';
import PrivateRoute from './PrivteRoute';
import UserDetails from './UserDetail';
import CoinDetails from '../pages/coinDetail';
import Wallet from '../pages/walletPage';
import Test from '../pages/testing';
import Transfer from '../pages/transfer';
import History from '../pages/history';
import AdminDashboard from '../pages/admin';
import UserManagement from '../pages/userManagement';
import WalletManagement from '../pages/walletManagement';
function App() {
    
    return (
        <Router>
    <div className="App">
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/" element={<CrytoDashboard />} />

            {/* Regular user routes */}
            <Route path="/userDetails" element={<PrivateRoute><UserDetails /></PrivateRoute>} />
            <Route path="/coinDetails/:symbol" element={<PrivateRoute><CoinDetails /></PrivateRoute>} />
            <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
            <Route path="/test" element={<PrivateRoute><Test /></PrivateRoute>} />
            <Route path="/wallet/transfer" element={<PrivateRoute><Transfer /></PrivateRoute>} />
            <Route path="/history/:walletId" element={<PrivateRoute><History /></PrivateRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<PrivateRoute adminRoute={true}><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute adminRoute={true}><UserManagement /></PrivateRoute>} />
            <Route path="/admin/wallet" element={<PrivateRoute adminRoute={true}><WalletManagement /></PrivateRoute>} />
            {/* <Route path="/admin/manage-users" element={<PrivateRoute adminRoute={true}><ManageUsers /></PrivateRoute>} />
            <Route path="/admin/manage-wallets" element={<PrivateRoute adminRoute={true}><ManageWallets /></PrivateRoute>} /> */}
        </Routes>
    </div>
</Router>
    );
}

export default App;
