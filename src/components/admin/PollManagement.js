import React, { useState, useEffect } from 'react';
import CreatePollModal from './CreatePollModal';
import PollList from './PollList';
import { toast } from 'react-toastify';

const PollManagement = () => {
    const [polls, setPolls] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchPolls();
        // Set up an interval to check poll status
        const interval = setInterval(checkPollStatus, 1000);
        return () => clearInterval(interval);
    }, []);

    const checkPollStatus = () => {
        const currentTime = new Date();
        setPolls(currentPolls => 
            currentPolls.map(poll => {
                const endTime = new Date(poll.end_time);
                return {
                    ...poll,
                    status: currentTime > endTime ? 'ended' : 'active'
                };
            })
        );
    };

    const fetchPolls = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/polls', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch polls');
            const data = await response.json();
            
            // Check status for each poll immediately after fetching
            const currentTime = new Date();
            const updatedPolls = data.map(poll => ({
                ...poll,
                status: currentTime > new Date(poll.end_time) ? 'ended' : 'active'
            }));
            
            setPolls(updatedPolls);
        } catch (error) {
            toast.error('Error fetching polls: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePoll = async (pollData) => {
        try {
            const response = await fetch('http://localhost:5000/api/polls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(pollData)
            });
            
            if (!response.ok) throw new Error('Failed to create poll');
            
            toast.success('Poll created successfully!');
            setIsCreateModalOpen(false);
            fetchPolls();
        } catch (error) {
            window.location.reload();
            // toast.error('Error creating poll: ' + error.message);
        }
    };

    const handleDeletePoll = async (pollId) => {
        if (!window.confirm('Are you sure you want to delete this poll?')) return;
        
        try {
            const response = await fetch(`http://localhost:5000/api/polls/${pollId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to delete poll');
            
            toast.success('Poll deleted successfully!');
            fetchPolls();
        } catch (error) {
            toast.error('Error deleting poll: ' + error.message);
        }
    };

    const filteredPolls = filter === 'all' 
        ? polls
        : polls.filter(poll => poll.status === filter);

    const getStats = () => {
        const total = polls.length;
        const active = polls.filter(p => p.status === 'active').length;
        const ended = polls.filter(p => p.status === 'ended').length;
        return { total, active, ended };
    };

    const stats = getStats();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Poll Management</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Stats Cards */}
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Total Polls</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Active Polls</p>
                        <p className="text-2xl font-semibold text-green-600">{stats.active}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Ended Polls</p>
                        <p className="text-2xl font-semibold text-red-600">{stats.ended}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-center">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create New Poll
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            filter === 'all' 
                                ? 'bg-gray-100 text-gray-900' 
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        All Polls
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            filter === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilter('ended')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            filter === 'ended'
                                ? 'bg-red-100 text-red-800'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        Ended
                    </button>
                </div>
            </div>

            {/* Poll List */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredPolls.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No polls found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        {filter === 'all' 
                            ? 'Get started by creating your first poll!'
                            : `No ${filter} polls available.`
                        }
                    </p>
                    {filter === 'all' && (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Poll
                        </button>
                    )}
                </div>
            ) : (
                <PollList 
                    polls={filteredPolls} 
                    onDelete={handleDeletePoll}
                />
            )}

            <CreatePollModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreatePoll}
            />
        </div>
    );
};

export default PollManagement;
