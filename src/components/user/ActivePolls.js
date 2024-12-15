import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import VoteModal from './VoteModal';
import socketService from '../../services/socketService';

const ActivePolls = () => {
    const [polls, setPolls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

    const handlePollEnded = useCallback((event) => {
        const { pollId, title } = event.detail;
        console.log('Poll ended event received in ActivePolls:', event.detail);
        
        // Mettre à jour la liste des sondages
        setPolls(currentPolls => {
            const updatedPolls = currentPolls.filter(poll => poll.id !== pollId);
            if (currentPolls.length !== updatedPolls.length) {
                toast.info(`Le sondage "${title}" est terminé et a été retiré de la liste.`, {
                    position: "top-right",
                    autoClose: 5000
                });
            }
            return updatedPolls;
        });
    }, []);

    useEffect(() => {
        // Connecter au service WebSocket
        socketService.connect();

        // Écouter les événements de fin de sondage
        window.addEventListener('pollEnded', handlePollEnded);

        // Charger les sondages actifs
        fetchActivePolls();

        // Cleanup
        return () => {
            window.removeEventListener('pollEnded', handlePollEnded);
            socketService.disconnect();
        };
    }, [handlePollEnded]);

    const fetchActivePolls = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/votes/active-polls', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch active polls');
            const data = await response.json();
            setPolls(data);
        } catch (error) {
            toast.error('Error fetching polls: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoteClick = (poll) => {
        setSelectedPoll(poll);
        setIsVoteModalOpen(true);
    };

    const handleVoteSubmit = async (pollId, votes) => {
        try {
            const response = await fetch('http://localhost:5000/api/votes/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ pollId, votes })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to submit vote');
            }

            toast.success('Vote submitted successfully!');
            setIsVoteModalOpen(false);
            fetchActivePolls(); // Refresh the polls list
        } catch (error) {
            toast.error('Error submitting vote: ' + error.message);
        }
    };

    const formatTimeLeft = (endTime) => {
        const end = new Date(endTime);
        const now = new Date();
        const diff = end - now;

        if (diff <= 0) return 'Expired';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m remaining`;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Active Polls</h2>
            
            {polls.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No active polls available.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {polls.map((poll) => (
                        <div
                            key={poll.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900">{poll.title}</h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {formatTimeLeft(poll.end_time)}
                                    </span>
                                </div>
                                
                                <p className="text-gray-600 mb-4">{poll.description}</p>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">
                                        {poll.question_count} questions
                                    </span>
                                    {poll.has_voted ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                                            Already voted
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleVoteClick(poll)}
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Vote Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedPoll && (
                <VoteModal
                    isOpen={isVoteModalOpen}
                    onClose={() => {
                        setIsVoteModalOpen(false);
                        setSelectedPoll(null);
                    }}
                    poll={selectedPoll}
                    onSubmit={handleVoteSubmit}
                />
            )}
        </div>
    );
};

export default ActivePolls;
