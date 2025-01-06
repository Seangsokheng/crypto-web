import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const LoginForm = () => {
    const [input, setInput] = useState({
        email : "",
        password : "",
    });
    const [err, setError] = useState('');
    const navigate = useNavigate();
    const handleChange = e =>{
        setInput(prev=>({...prev, [e.target.name] : e.target.value}))
    }
    console.log(input)
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login', input);
            navigate("/");
            console.log(res.data);
            // Handle successful login, save user data, redirect, etc.
        } catch (err) {
            setError(err.response.data);
            // Handle error
        }
    };

    return ( 

        <section className="vh-100" style={{ backgroundColor: '#508bfc' }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                <div className="card-body p-5 text-center">
  
                  <h3 className="mb-5">Sign in</h3>
  
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="typeEmailX-2">Email</label>
                    <input
                      type="email"
                      id="typeEmailX-2"
                      className="form-control form-control-lg"
                      name="email"
                      placeholder="Enter your email"
                      onChange={handleChange}
                      required
                    />
                  </div>
  
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="typePasswordX-2">Password</label>
                    <input
                      type="password"
                      id="typePasswordX-2"
                      className="form-control form-control-lg"
                      name="password"
                      placeholder="Enter your password"
                      onChange={handleChange}
                      required
                    />
                  </div>
  
                  <div className="form-check d-flex justify-content-start mb-4">
                   {err && <p className="text-danger mt-3">{err}</p>}
                  </div>
  
                  <button
                    className="btn btn-primary btn-lg btn-block"
                    type="submit"
                    onClick={onSubmit}
                  >
                    Login
                  </button>
                    <div>
                    <p className="mb-0">Don't have an account? <Link to="/register" className="text-blue-50">Register</Link></p>
                    </div>
                  <hr className="my-4" />
                    <Link to="/auth/google">
                  <button
                    className="btn btn-lg btn-block btn-primary"
                    style={{ backgroundColor: '#dd4b39' }}
                    type="submit" >
                        <i className="fab fa-google me-2"></i>
                        Sign In with Google
                  </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default LoginForm;
