import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerification } from '../services/api';
import { motion } from 'framer-motion';

const EmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [resending, setResending] = useState(false);

    const handleResendEmail = async () => {
        if (!email) return;
        setResending(true);
        try {
            const response = await resendVerification(email);
            setError(response.message);
            // Clear email input after successful resend
            setEmail('');
        } catch (err) {
            if (err.response && err.response.status === 429) {
                // Cooldown error
                setError(err.response.data.message);
            } else {
                setError(err.response?.data?.message || 'Erreur lors de l\'envoi de l\'email de vérification');
            }
        } finally {
            setResending(false);
        }
    };

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await verifyEmail(token);
                if (response.status === 'verified' || response.status === 'already_verified') {
                    navigate('/login');
                } else {
                    setStatus('error');
                    setError(response.message);
                }
            } catch (err) {
                setStatus('error');
                setError(err.message || 'Une erreur est survenue lors de la vérification');
            }
        };

        if (token) {
            verifyToken();
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8"
            >
                {status === 'error' && (
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4"
                        >
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                            Erreur de vérification
                        </h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <div className="mt-4 space-y-2">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Entrez votre email pour renvoyer le lien"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <button
                                onClick={handleResendEmail}
                                disabled={resending || !email}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {resending ? 'Envoi en cours...' : 'Renvoyer l\'email de vérification'}
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Retour à la connexion
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default EmailVerification;
