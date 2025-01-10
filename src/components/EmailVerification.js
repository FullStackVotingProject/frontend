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

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus('error');
                setError('Token de vérification manquant');
                return;
            }

            try {
                setStatus('verifying');
                const response = await verifyEmail(token);
                
                if (response.status === 'verified' || response.status === 'already_verified') {
                    setStatus('success');
                    setTimeout(() => {
                        navigate('/login', { 
                            state: { message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.' }
                        });
                    }, 2000);
                } else {
                    setStatus('error');
                    setError(response.message);
                }
            } catch (err) {
                setStatus('error');
                setError(err.response?.data?.message || 'Une erreur est survenue lors de la vérification');
            }
        };

        verifyToken();
    }, [token, navigate]);

    const handleResendEmail = async () => {
        if (!email) {
            setError('Veuillez entrer votre email');
            return;
        }
        
        setResending(true);
        try {
            const response = await resendVerification(email);
            setError('');
            setStatus('resent');
            setEmail('');
        } catch (err) {
            if (err.response?.status === 429) {
                setError(err.response.data.message);
            } else {
                setError(err.response?.data?.message || 'Erreur lors de l\'envoi de l\'email de vérification');
            }
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {status === 'verifying' && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Vérification de votre email en cours...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="mt-4 text-green-600">Email vérifié avec succès! Redirection...</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <p className="mt-4 text-red-600">{error}</p>
                            
                            <div className="mt-6">
                                <p className="text-gray-600 mb-4">Vous n'avez pas reçu l'email? Renvoyez-le:</p>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Entrez votre email"
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4"
                                />
                                <button
                                    onClick={handleResendEmail}
                                    disabled={resending}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                        resending ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                >
                                    {resending ? 'Envoi en cours...' : 'Renvoyer l\'email de vérification'}
                                </button>
                            </div>
                        </div>
                    )}

                    {status === 'resent' && (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="mt-4 text-green-600">Email de vérification renvoyé! Veuillez vérifier votre boîte de réception.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
