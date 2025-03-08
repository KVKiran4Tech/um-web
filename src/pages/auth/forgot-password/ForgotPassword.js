import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = ({ onClose, onSubmit }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email) {
            setMessage('');
            setErrorMessage('Please enter a valid email address.')
            return;
        }
        setErrorMessage('');
        setMessage('A password reset link has been sent to your email.');
        
    };

  return (
    <div className="forgot-password-popup">
        <div className="popup-container">
            <div className="popup-header">
                <h2>Forgot Password</h2>
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>
            </div>
            <div className="popup-content">
                <label htmlFor="forgot-password-email">Enter your email address to reset your password:</label>
                <input id="forgot-password-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    autoComplete="off"
                />
                {message && <p className="message">{message}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            <div className="popup-footer">
                <button className="btn btn-sm btn-primary" onClick={onClose}>Close</button>                
                <button className="btn btn-sm btn-success" type="submit" onClick={handleSubmit}>Send Reset Link</button>
            </div>
        </div>
    </div>
  );
};
export default ForgotPassword;