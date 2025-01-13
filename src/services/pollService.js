import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
});

export const fetchPolls = async () => {
    try {
        const response = await fetch(`${API_URL}/polls`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch polls');
        return await response.json();
    } catch (error) {
        toast.error('Error fetching polls: ' + error.message);
        throw error;
    }
};

export const createPoll = async (pollData) => {
    try {
        const response = await fetch(`${API_URL}/polls`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(pollData)
        });
        if (!response.ok) throw new Error('Failed to create poll');
        return await response.json();
    } catch (error) {
        toast.error('Error creating poll: ' + error.message);
        throw error;
    }
};

export const deletePoll = async (pollId) => {
    try {
        const response = await fetch(`${API_URL}/polls/${pollId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete poll');
        return await response.json();
    } catch (error) {
        toast.error('Error deleting poll: ' + error.message);
        throw error;
    }
};

export const updatePoll = async (pollId, pollData) => {
    try {
        const response = await fetch(`${API_URL}/polls/${pollId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(pollData)
        });
        if (!response.ok) throw new Error('Failed to update poll');
        return await response.json();
    } catch (error) {
        toast.error('Error updating poll: ' + error.message);
        throw error;
    }
};
