
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const VoteModal = ({ isOpen, onClose, poll, onSubmit }) => {
    const [selectedOptions, setSelectedOptions] = useState({});

    const handleOptionSelect = (questionId, optionId) => {
        setSelectedOptions(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate that all questions have been answered
        const unansweredQuestions = poll.questions.filter(
            question => !selectedOptions[question.id]
        );

        if (unansweredQuestions.length > 0) {
            alert('Please answer all questions before submitting.');
            return;
        }

        // Format votes for submission
        const votes = Object.entries(selectedOptions).map(([questionId, optionId]) => ({
            questionId: parseInt(questionId),
            optionId: optionId
        }));

        onSubmit(poll.id, votes);
    };

    // Vérification si les questions existent
    if (!poll || !poll.questions || poll.questions.length === 0) {
        return <div>Loading...</div>; // Si pas de données, affiche "Loading"
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900">
                                            {poll.title}
                                        </Dialog.Title>
                                        <p className="text-gray-600 mt-2">{poll.description}</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {poll.questions.map((question, qIndex) => (
                                            <div key={question.id} className="bg-gray-50 rounded-lg p-6 space-y-4">
                                                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-3">
                                                        {qIndex + 1}
                                                    </span>
                                                    {question.question_text}
                                                </h4>
                                                <div className="space-y-3 ml-11">
                                                    {question.options.map((option) => (
                                                        <label
                                                            key={option.id}
                                                            className={`flex items-center p-3 rounded-lg transition-all cursor-pointer
                                                                ${selectedOptions[question.id] === option.id 
                                                                    ? 'bg-blue-50 border-2 border-blue-200' 
                                                                    : 'hover:bg-gray-100 border-2 border-transparent'}`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                id={`option-${option.id}`}
                                                                name={`question-${question.id}`}
                                                                value={option.id}
                                                                checked={selectedOptions[question.id] === option.id}
                                                                onChange={() => handleOptionSelect(question.id, option.id)}
                                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                            />
                                                            <span className="ml-3 text-gray-700">{option.option_text}</span>

                                                            {option.image && (
                                                                <img
                                                                    src={option.image}
                                                                    alt={`Option ${option.id}`}
                                                                    className="w-10 h-10 object-cover rounded ml-4"
                                                                />
                                                            )}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                            >
                                                Submit Vote
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default VoteModal;


