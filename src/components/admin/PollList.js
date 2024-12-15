import React from 'react';

const PollList = ({ polls, onDelete }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'ended':
                return 'bg-red-100 text-red-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
                {polls.map((poll) => (
                    <li key={poll.id}>
                        <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-medium text-gray-900 truncate">
                                        {poll.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {poll.description}
                                    </p>
                                </div>
                                <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(poll.status)}`}>
                                        {poll.status}
                                    </span>
                                    <button
                                        onClick={() => onDelete(poll.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                        Duration: {poll.duration_minutes} minutes
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                    <p>
                                        Start: {formatDate(poll.start_time)}
                                    </p>
                                    <p className="ml-4">
                                        End: {formatDate(poll.end_time)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-900">Questions:</h4>
                                <ul className="mt-2 divide-y divide-gray-200">
                                    {poll.questions?.map((question, index) => (
                                        <li key={question.id} className="py-2">
                                            <p className="text-sm text-gray-600">
                                                {index + 1}. {question.question_text}
                                            </p>
                                            <ul className="mt-1 pl-6 list-disc">
                                                {question.options?.map((option) => (
                                                    <li key={option.id} className="text-sm text-gray-500">
                                                        {option.option_text}
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PollList;
