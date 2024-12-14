import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

const LogoutButton = ({ className }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${className}`}
        >
            <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414l-4.293 4.293a1 1 0 01-1.414 0L4 7.414V15h12V7.414zm0-2.828V5H4v1.586l4.293 4.293a1 1 0 001.414 0L14 6.586z" clipRule="evenodd" />
            </svg>
            Déconnexion
        </button>
    );
};

export default LogoutButton;
