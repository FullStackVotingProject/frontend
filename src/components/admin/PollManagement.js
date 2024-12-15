import React, { useState, useEffect } from 'react';
import CreatePollModal from './CreatePollModal';
import PollList from './PollList';
import { toast } from 'react-toastify';

const PollManagement = () => {
    const [polls, setPolls] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/polls', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch polls');
            const data = await response.json();
            setPolls(data);
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
            toast.error('Error creating poll: ' + error.message);
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

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Poll Management</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                >
                    Create New Poll
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <PollList 
                    polls={polls} 
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
