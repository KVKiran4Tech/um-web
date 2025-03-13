import React, { useState } from 'react';
import './Login.css';
import useLoginForm from "./useLoginForm";
import validate from "./LoginFormValidationRules";
import { Navigate  } from 'react-router-dom';
import imageContent from '../../../assets/img/Login_UM_Logo.jpg';
import ForgotPassword from '../forgot-password/ForgotPassword';
import "bulma/css/bulma.css";

const Login = (props) => {
    
  const { values, errors, handleChange, handleSubmit } = useLoginForm(
      login,
      validate
  );

  const [loggedIn, setLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  function login() {
      setLoggedIn(true);
      props.parentCallback(true);
      return <Navigate replace to="/home" />;
  }

  const handleForgotPasswordSubmit = async (email) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@example.com") {
          resolve();
        } else {
          reject(new Error("Email not found."));
        }
      }, 1000);
    });
  }

  const handleForgotPassword = () => {
    setShowPopup(true);
  }

  return (
    <div className="section is-fullheight">
    {loggedIn && <Navigate replace to="/home" />}
    {
      !showPopup ? (
        <div className="ps-md-0">
          <div className="row g-0">
            <div className="col-md-8 bg-image">
              <h1>Sign into </h1>
              <h3>United Moviers</h3>
              <p>If you don’t have an account, then please contact your administrator.</p>
            </div>
            <div className="col-md-4 b-white">
              <div className="login d-flex align-items-center py-5">
                <div className="container">
                  <div className="row">
                    <div className="col-md-9 col-lg-8 mx-auto">
                      <img src={imageContent} alt="dummy img"></img>
                      <h3 className="login-heading mb-4">Login</h3>
                      <form>
                        <div className="form-group mb-3 control">
                          <label htmlFor="email">Email address</label>
                          <input
                            id="email"
                            autoComplete="off"
                            className= {`form-control input ${errors.email && "is-danger"}`}
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={values.email || ""}
                            required
                          />
                          {errors.email && (
                            <p className="help is-danger">{errors.email}</p>
                          )}
                        </div>
                        <div className="form-group mb-3 control">
                          <label htmlFor="password">Password</label>
                          <input
                            id="password"
                            className={`form-control input ${errors.password && "is-danger"}`}
                            type="password"
                            name="password"
                            onChange={handleChange}
                            autoComplete="off"
                            value={values.password || ""}
                            required
                          />              
                          {errors.password && (
                            <p className="help is-danger">{errors.password}</p>
                          )}             
                        </div>
                      
                        <div className="form-check mb-3">
                          <input className="form-check-input" type="checkbox" value="" id="rememberPasswordCheck"/>
                          <label className="form-check-label" htmlFor="rememberPasswordCheck" >
                            Remember password
                          </label>
                        </div>

                        <div className="d-grid">
                          <div className="text-end" noValidate>
                            <button className="btn btn-primary btn-sm btn-login text-uppercase fw-bold mb-3" style={{"width": "100px"}} onClick={handleSubmit} type="submit" >Sign in</button>
                          </div>
                          <div className="text-begin">
                            <a className="small" onClick={() => setShowPopup(true)} >Forgot password?</a>
                          </div>
                        </div>
                      </form>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) :
      (
        <ForgotPassword onClose={() => setShowPopup(false)} onSubmit={handleForgotPasswordSubmit} />
      )
    }
      
    </div>
  );

};
  
export default Login;