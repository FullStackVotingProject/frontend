import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login, resendVerification } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [resendingVerification, setResendingVerification] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setResendingVerification(false);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setNeedsVerification(false);
        setLoading(true);

        try {
            const response = await login(formData.email, formData.password);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            if (response.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            if (err.needsVerification) {
                setNeedsVerification(true);
            }
            setError(err.message || 'Une erreur est survenue lors de la connexion');
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setResendingVerification(true);
        setError('');

        try {
            await resendVerification(formData.email);
            setError('Email de vérification renvoyé avec succès');
            setCountdown(300); // 5 minutes in seconds
        } catch (err) {
            if (err.cooldown) {
                setError(err.message);
                setResendingVerification(true);
                setCountdown(300); // 5 minutes in seconds
            } else {
                setError(err.message || 'Erreur lors du renvoi de l\'email');
                setResendingVerification(false);
            }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-voting-pattern flex flex-col justify-center py-12 sm:px-6 lg:px-8"
        >
            <div className="background-container">
                <span className="floating-checkmark checkmark-1">✓</span>
                <span className="floating-checkmark checkmark-2">✓</span>
                <span className="floating-checkmark checkmark-3">✓</span>
            </div>
            <div className="content-container">
                <motion.div 
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                    className="sm:mx-auto sm:w-full sm:max-w-md"
                >
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Connexion
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ou{' '}
                        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                            créez un compte
                        </Link>
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                    className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
                >
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="rounded-md bg-red-50 p-4 mt-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-red-800">
                                                {error}
                                            </p>
                                            {needsVerification && (
                                                <button
                                                    onClick={handleResendVerification}
                                                    disabled={resendingVerification}
                                                    className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                >
                                                    {resendingVerification 
                                                        ? `Veuillez attendre ${formatTime(countdown)}...`
                                                        : 'Renvoyer l\'email de vérification'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="input-field"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mot de passe
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="input-field"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    <motion.span
                                        animate={loading ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
                                        transition={loading ? { duration: 1, repeat: Infinity } : {}}
                                    >
                                        {loading ? 'Connexion...' : 'Se connecter'}
                                    </motion.span>
                                </button>
                            </motion.div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Login;
