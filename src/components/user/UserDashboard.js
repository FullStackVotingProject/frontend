import React, { useState, useEffect } from 'react';
import LogoutButton from '../LogoutButton';
import ActivePolls from './ActivePolls';
import PollResults from './PollResults';
import Profile from './Profile';
import socketService from '../../services/socketService';
import CreatePollModal from '../admin/CreatePollModal';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast from react-toastify

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        const socket = socketService.connect();
        return () => {
            socketService.disconnect();
        };
    }, []);

    const handleCreatePoll = async (pollData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/polls', pollData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.data) {
                setIsCreateModalOpen(false);
                window.dispatchEvent(new CustomEvent('newPoll'));
                toast.success('Poll created successfully!');
            }
        } catch (error) {
            console.error('Error creating poll:', error);
            toast.error(error.response?.data?.message || 'Failed to create poll. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <img
                                    src="vote.png"
                                    alt="Clickvote Logo"
                                    className="h-10 w-10 mr-3"
                                />
                                <h1 className="text-2xl font-bold text-gray-900">Clickvote</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Create Poll
                            </button>
                            <LogoutButton className="ml-4" />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`${
                                    activeTab === 'active'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Active Polls
                            </button>
                            <button
                                onClick={() => setActiveTab('results')}
                                className={`${
                                    activeTab === 'results'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Poll Results
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`${
                                    activeTab === 'profile'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Profile Settings
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div>
                        {activeTab === 'active' && <ActivePolls />}
                        {activeTab === 'results' && <PollResults />}
                        {activeTab === 'profile' && <Profile />}
                    </div>
                </div>
            </div>
            <CreatePollModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreatePoll}
            />
        </div>
    );
};

export default UserDashboard;
