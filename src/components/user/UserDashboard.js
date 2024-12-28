import React, { useState, useEffect } from 'react';
import LogoutButton from '../LogoutButton';
import ActivePolls from './ActivePolls';
import PollResults from './PollResults';
import Profile from './Profile';
import socketService from '../../services/socketService';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('active');

    useEffect(() => {
        // Initialiser la connexion socket
        const socket = socketService.connect();

        // Cleanup lors du démontage du composant
        return () => {
            socketService.disconnect();
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-2xl font-bold text-gray-900">Vote Platform</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
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
        </div>
    );
};

export default UserDashboard;
