import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CryptoDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [coins, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");  // Add this line
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
    useEffect(() => {
        fetchUser();
    }, []);

    // useEffect(() => {
    //     fetchData();
    // }, []);
    console.log('this is auth',isAuthenticated);
    console.log('this is user ', user);

    // Fetch the authenticated user details
    const fetchUser = async () => {
        try {
            const response = await fetch('/auth/user', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setIsAuthenticated(false);
        }
    };
    useEffect(() => {
        setLoading(true); // Start loading when the component mounts
      
        fetchData().then(() => {
          setLoading(false); // Stop loading when the data is fetched
        }).catch(() => {
          setLoading(false); // Stop loading in case of an error
        });
      }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/cryptos');
            setCryptos(response.data);
        } catch (error) {
            console.error("Error fetching crypto data: ", error);
        }
    };

    const filteredCryptos = coins.filter(coin =>
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );

    useEffect(() => {
        const interval = setInterval(fetchData, 10000);  // Poll every minute
        return () => clearInterval(interval);
    }, []);
    const handleLogout = async () => {
        await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
        window.location.reload();
    };
    
    const handleLogin = () => {
        window.location.href = '/login';
    };

    const handleClick = (coin) => {
      navigate(`/coinDetails/${coin.symbol}`, {
        state: {
          price: parseFloat(coin.lastPrice).toFixed(2),
          changePercent24h: coin.priceChangePercent,
          logo: `/img/${coin.symbol.replace('USDT', '').toLowerCase()}.png`,
            // maxSupply: coin.maxSupply,
            // popularity: coin.popularity,
            // marketCap: coin.marketCap,
        }
      });
    };


  return (
    <div className="container mt-4">
    <header className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center head">Top Cryptocurrencies</h2>
        <div className="auth-info d-flex align-items-center">
        {isAuthenticated ? (
        <>
          <div className="d-flex align-items-center">
            {user?.role !== 'admin' && (
              <>
                <Link to="/userDetails" className="d-flex align-items-center">
                <img src={user?.logoUrl} alt="User Logo" className="user-logo" />
                </Link>
                <Link to="/wallet" className="btn btn-outline-light ms-3 d-flex align-items-center">
                <i className="fas fa-wallet me-2"></i> Wallet
                </Link>
              </>
            )}
            {/* Conditional Admin Dashboard Link */}
            {user?.role === 'admin' && (
              <Link to="/admin" className="btn btn-outline-warning ms-3 d-flex align-items-center">
                <i className="fas fa-chart-line me-2"></i> Admin Dashboard
              </Link>
            )}
            <button className="btn btn-outline-light ms-3" onClick={handleLogout}>Logout</button>
          </div>
        </>
        ) : (
          <button className="btn btn-outline-light" onClick={handleLogin}>Sign In</button>
        )}

        </div>
    </header>
    
   {loading ? (
      <div className="loading-spinner">
        {/* You can add an animated spinner */}
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    ) : (
      <>
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
   
        <div className="row">
          {filteredCryptos.map((coin) => (
            <div key={coin.symbol} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div  onClick={() => handleClick(coin)} className='noBlue'>
                <div className="cardd">
                  <div className="card-body">
                  <img src={`/img/${coin.symbol.replace('USDT', '').toLowerCase()}.png`} alt={coin.symbol} className="coin-logo" />
                    <h5 className="card-title">{coin.symbol.replace('USDT', '')}</h5>
                    <p className="card-text">
                      <strong>Price:</strong> ${parseFloat(coin.lastPrice).toFixed(2)} <br />
                      <strong>Volume:</strong> ${parseFloat(coin.volume).toFixed(2)} <br />
                      <strong>Price Change:</strong> 
                      <span className={coin.priceChangePercent >= 0 ? 'price-change-up' : 'price-change-down'}>
                        {parseFloat(coin.priceChangePercent).toFixed(2)}%
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </>
    )}
</div>
  );
};

export default CryptoDashboard;
