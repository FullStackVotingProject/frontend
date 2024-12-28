import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const PollVoteDetails = ({ pollId, onClose }) => {
    const [pollData, setPollData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPollVotes();
    }, [pollId]);

    const fetchPollVotes = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Please log in to view poll details');
            }

            const response = await fetch(`http://localhost:5000/api/polls/${pollId}/votes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                throw new Error('Session expired. Please log in again.');
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch poll votes');
            }
            
            const data = await response.json();
            if (!data.success || !data.poll) {
                throw new Error('Invalid response format from server');
            }
            setPollData(data.poll);
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
            if (error.message.includes('log in')) {
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 w-full max-w-4xl">
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="text-red-500 mb-4">{error}</div>
                        <button
                            onClick={fetchPollVotes}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={onClose}
                            className="mt-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!pollData || !pollData.questions || pollData.questions.length === 0) {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 w-full max-w-4xl">
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="text-gray-500 mb-4">No data available for this poll</div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = pollData.questions[selectedQuestion] || pollData.questions[0];
    const totalVotesForQuestion = currentQuestion.options.reduce((sum, option) => sum + (option.vote_count || 0), 0);

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{pollData.title}</h2>
                        <p className="text-sm text-gray-500 mt-1">{pollData.description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500">Total Questions</p>
                        <p className="text-2xl font-semibold text-gray-900">{pollData.statistics.total_questions}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500">Total Voters</p>
                        <p className="text-2xl font-semibold text-gray-900">{pollData.statistics.total_voters}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                            pollData.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {pollData.status.charAt(0).toUpperCase() + pollData.status.slice(1)}
                        </span>
                    </div>
                </div>

                {/* Question Selector */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Question
                    </label>
                    <select
                        value={selectedQuestion}
                        onChange={(e) => setSelectedQuestion(Number(e.target.value))}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        {pollData.questions.map((q, index) => (
                            <option key={q.id} value={index}>
                                {q.question_text}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Question Details */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Vote Distribution
                        </h3>
                        <div className="space-y-4">
                            {currentQuestion.options.map((option) => {
                                const percentage = totalVotesForQuestion > 0
                                    ? ((option.vote_count / totalVotesForQuestion) * 100).toFixed(1)
                                    : 0;
                                
                                return (
                                    <div key={option.id} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-900">
                                                {option.option_text}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {option.vote_count || 0} votes ({percentage}%)
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                                                <div
                                                    style={{ width: `${percentage}%` }}
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Voters List */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Voters ({pollData.voters.length})
                        </h3>
                        <div className="space-y-4">
                            {pollData.voters.map((voter) => (
                                <div key={voter.id} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{voter.username}</h4>
                                            <p className="text-sm text-gray-500">{voter.email}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        {voter.votes.map((vote, index) => (
                                            <div key={index} className="text-sm text-gray-600">
                                                <span className="font-medium">{vote.question_text}:</span>
                                                {' '}{vote.option_text}
                                                {' '}
                                                <span className="text-gray-400">
                                                    ({formatDate(vote.vote_time)})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PollVoteDetails;
