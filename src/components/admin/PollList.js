import React, { useState } from 'react';
import PollVoteDetails from './PollVoteDetails';

const PollList = ({ polls, onDelete }) => {
    const [selectedPollId, setSelectedPollId] = useState(null);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'active':
                return {
                    badge: 'bg-green-100 text-green-800 ring-1 ring-green-600/20',
                    text: 'Active',
                    icon: (
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            case 'ended':
                return {
                    badge: 'bg-red-100 text-red-800 ring-1 ring-red-600/20',
                    text: 'Ended',
                    icon: (
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            default:
                return {
                    badge: 'bg-gray-100 text-gray-800 ring-1 ring-gray-600/20',
                    text: status,
                    icon: null
                };
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 w-full px-4">
                {polls.map((poll) => {
                    const status = getStatusStyle(poll.status);
                    return (
                        <div
                            key={poll.id}
                            className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6 w-full"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 flex-grow">
                                            {poll.title}
                                        </h3>
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ${status.badge}`}>
                                            {status.icon}
                                            {status.text}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                        {poll.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Start Time</p>
                                    <p className="font-medium text-gray-900">
                                        {formatDate(poll.start_time)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">End Time</p>
                                    <p className="font-medium text-gray-900">
                                        {formatDate(poll.end_time)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">
                                    Questions ({poll.questions ? poll.questions.length : 0})
                                </p>
                                <div className="space-y-2">
                                    {poll.questions && poll.questions.map((question, index) => (
                                        <div key={question.id} className="text-sm text-gray-700 pl-3 border-l-2 border-gray-200">
                                            {index + 1}. {question.question_text}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-4">
                                <button
                                    onClick={() => setSelectedPollId(poll.id)}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Votes
                                </button>
                                <button
                                    onClick={() => onDelete(poll.id)}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedPollId && (
                <PollVoteDetails
                    pollId={selectedPollId}
                    onClose={() => setSelectedPollId(null)}
                />
            )}
        </>
    );
};

export default PollList;
