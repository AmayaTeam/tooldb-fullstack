import React from "react";
import './LogInWindow.css';

const LogInWindow: React.FC = () => {
    return (
        <div className="login-container">
            <div className="login-content">
                <div className="heading">
                    <h1>Log In</h1>
                </div>
                <div className="login-button">
                    <button onClick={() => window.location.href = import.meta.env.VITE_BACKEND_ROOT_URL} className="button-content" style={{textDecoration: 'none'}}>
                        <div className="button-icon">
                            <span className="microsoft-logo"></span>
                        </div>
                        <div className="button-info">
                            <p>Log in via Microsoft</p>
                        </div>
                    </button>
                </div>
                <div className="heading">
                    <p>In order to log in to the app, you need to log in with Microsoft.</p>
                </div>
            </div>
        </div>
    );
};

export default LogInWindow;
