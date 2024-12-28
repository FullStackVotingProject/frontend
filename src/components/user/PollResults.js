import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const PollResults = () => {
    const [completedPolls, setCompletedPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [pollResults, setPollResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCompletedPolls();
    }, []);

    useEffect(() => {
        if (selectedPoll) {
            fetchPollResults(selectedPoll.id);
        }
    }, [selectedPoll]);

    const fetchCompletedPolls = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/votes/completed-polls', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch completed polls');
            const data = await response.json();
            setCompletedPolls(data);
        } catch (error) {
            toast.error('Error fetching completed polls: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPollResults = async (pollId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/votes/results/${pollId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch poll results');
            const data = await response.json();
            setPollResults(data);
        } catch (error) {
            toast.error('Error fetching poll results: ' + error.message);
        }
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
            <h2 className="text-2xl font-semibold text-gray-800">Poll Results</h2>

            {completedPolls.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No completed polls available.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {completedPolls.map((poll) => (
                        <div
                            key={poll.id}
                            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-200 ${
                                selectedPoll?.id === poll.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setSelectedPoll(poll)}
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{poll.title}</h3>
                                <p className="text-gray-600 mb-4">{poll.description}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>{poll.total_votes} total votes</span>
                                    <span>Ended {new Date(poll.end_time).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {pollResults && (
                <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">{pollResults.title} - Results</h3>
                    <div className="space-y-8">
                        {pollResults.questions.map((question, index) => (
                            <div key={question.id} className="border-t pt-6 first:border-t-0 first:pt-0">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">
                                    {index + 1}. {question.question_text}
                                </h4>
                                <div className="space-y-4">
                                    {question.options.map(option => (
                                        <div key={option.id} className="relative">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-700">
                                                    {option.option_text}
                                                </span>
                                                <span className="text-gray-600">
                                                    {option.vote_count} votes ({option.percentage}%)
                                                </span>
                                            </div>
                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                                <div
                                                    style={{ width: `${option.percentage}%` }}
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PollResults;
