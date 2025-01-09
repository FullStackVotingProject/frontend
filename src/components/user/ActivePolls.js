import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import VoteModal from './VoteModal';
import CountdownTimer from './CountdownTimer';
import socketService from '../../services/socketService';

const ActivePolls = () => {
    const [polls, setPolls] = useState([]);
    const [filteredPolls, setFilteredPolls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('active');

    // Fetch polls with useCallback to prevent unnecessary re-renders
    const fetchPolls = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/polls', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch polls');
            const data = await response.json();
            setPolls(data);
            filterPolls(filterStatus);
        } catch (error) {
            toast.error('Error fetching polls: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }, [filterStatus]);

    useEffect(() => {
        // Connect to WebSocket service
        socketService.connect();

        // Listen for poll ended events
        const handlePollEnded = (event) => {
            const { pollId } = event.detail;
            setPolls(currentPolls => 
                currentPolls.map(poll => 
                    poll.id === pollId 
                        ? { ...poll, status: 'ended' }
                        : poll
                )
            );
        };

        // Listen for new poll events
        const handleNewPoll = () => {
            fetchPolls();
        };

        window.addEventListener('pollEnded', handlePollEnded);
        window.addEventListener('newPoll', handleNewPoll);

        // Load polls
        fetchPolls();

        // Cleanup
        return () => {
            window.removeEventListener('pollEnded', handlePollEnded);
            window.removeEventListener('newPoll', handleNewPoll);
            socketService.disconnect();
        };
    }, [fetchPolls]);

    useEffect(() => {
        filterPolls(filterStatus);
    }, [polls, filterStatus]);

    const filterPolls = (status) => {
        if (status === 'all') {
            setFilteredPolls(polls);
        } else {
            setFilteredPolls(polls.filter(poll => poll.status === status));
        }
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleVoteClick = (poll) => {
        if (poll.status === 'ended') {
            toast.error('This poll has ended');
            return;
        }
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
            fetchPolls(); // Refresh the polls list
        } catch (error) {
            toast.error('Error submitting vote: ' + error.message);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        return status === 'active' 
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Polls</h2>
                <div className="relative">
                    <select
                        value={filterStatus}
                        onChange={handleFilterChange}
                        className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option value="all">All Polls</option>
                        <option value="active">Active Polls</option>
                        <option value="ended">Ended Polls</option>
                    </select>
                </div>
            </div>
            
            {filteredPolls.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mt-4 text-gray-600 text-lg">No {filterStatus === 'all' ? '' : filterStatus} polls available.</p>
                    <p className="text-gray-400">Check back later for new polls!</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPolls.map((poll) => (
                        <div
                            key={poll.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{poll.title}</h3>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            {poll.status === 'active' ? (
                                                <CountdownTimer 
                                                    endDate={poll.end_time} 
                                                    onExpire={() => {
                                                        setPolls(currentPolls =>
                                                            currentPolls.map(p =>
                                                                p.id === poll.id ? { ...p, status: 'ended' } : p
                                                            )
                                                        );
                                                        filterPolls(filterStatus);
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>Ended {new Date(poll.end_time).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(poll.status)}`}>
                                        {poll.status === 'active' ? 'Active' : 'Ended'}
                                    </span>
                                </div>
                                 
                                <p className="text-gray-600 mb-6">{poll.description}</p>
                                 
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2 text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{poll.questions.length} Questions</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span>{poll.totalVotes || 0} Votes</span>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleVoteClick(poll)}
                                        className={`w-full font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2
                                            ${poll.status === 'active' 
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                        disabled={poll.status === 'ended'}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{poll.status === 'active' ? 'Cast Your Vote' : 'Poll Ended'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedPoll && (
                <VoteModal
                    isOpen={isVoteModalOpen}
                    onClose={() => setIsVoteModalOpen(false)}
                    poll={selectedPoll}
                    onSubmit={handleVoteSubmit}
                />
            )}
        </div>
    );
};

export default ActivePolls;
