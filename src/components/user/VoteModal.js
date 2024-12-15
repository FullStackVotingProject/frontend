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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                                    {poll.title}
                                </Dialog.Title>

                                <div className="mt-2">
                                    <p className="text-gray-600 mb-6">{poll.description}</p>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {poll.questions.map((question, qIndex) => (
                                            <div key={question.id} className="space-y-4">
                                                <h4 className="text-lg font-medium text-gray-900">
                                                    {qIndex + 1}. {question.text}
                                                </h4>
                                                <div className="space-y-2">
                                                    {question.options.map((option) => (
                                                        <div key={option.id} className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                id={`option-${option.id}`}
                                                                name={`question-${question.id}`}
                                                                value={option.id}
                                                                checked={selectedOptions[question.id] === option.id}
                                                                onChange={() => handleOptionSelect(question.id, option.id)}
                                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                            />
                                                            <label
                                                                htmlFor={`option-${option.id}`}
                                                                className="ml-3 block text-gray-700"
                                                            >
                                                                {option.option_text}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        <div className="mt-6 flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
