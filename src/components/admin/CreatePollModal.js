




import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const CreatePollModal = ({ isOpen, onClose, onCreate }) => {
    const [pollData, setPollData] = useState({
        title: '',
        description: '',
        questions: [{ text: '', options: [{ text: '', image: null }, { text: '', image: null }] }],
        durationMinutes: 60
    });

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...pollData.questions];
        newQuestions[index] = { ...newQuestions[index], text: value };
        setPollData({ ...pollData, questions: newQuestions });
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...pollData.questions];
        newQuestions[questionIndex].options[optionIndex].text = value;
        setPollData({ ...pollData, questions: newQuestions });
    };

    const handleImageChange = (questionIndex, optionIndex, file) => {
        const newQuestions = [...pollData.questions];
        newQuestions[questionIndex].options[optionIndex].image = URL.createObjectURL(file);
        setPollData({ ...pollData, questions: newQuestions });
    };

    const addQuestion = () => {
        setPollData({
            ...pollData,
            questions: [...pollData.questions, { text: '', options: [{ text: '', image: null }, { text: '', image: null }] }]
        });
    };

    const addOption = (questionIndex) => {
        const newQuestions = [...pollData.questions];
        newQuestions[questionIndex].options.push({ text: '', image: null });
        setPollData({ ...pollData, questions: newQuestions });
    };

    const removeQuestion = (index) => {
        const newQuestions = pollData.questions.filter((_, i) => i !== index);
        setPollData({ ...pollData, questions: newQuestions });
    };

    const removeOption = (questionIndex, optionIndex) => {
        const newQuestions = [...pollData.questions];
        newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
        setPollData({ ...pollData, questions: newQuestions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(pollData);
        setPollData({
            title: '',
            description: '',
            questions: [{ text: '', options: [{ text: '', image: null }, { text: '', image: null }] }],
            durationMinutes: 60
        });
        onClose();
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
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                                    Create New Poll
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            value={pollData.title}
                                            onChange={(e) => setPollData({ ...pollData, title: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            value={pollData.description}
                                            onChange={(e) => setPollData({ ...pollData, description: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            rows="3"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                                        <input
                                            type="number"
                                            value={pollData.durationMinutes}
                                            onChange={(e) => setPollData({ ...pollData, durationMinutes: parseInt(e.target.value) })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        {pollData.questions.map((question, qIndex) => (
                                            <div key={qIndex} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="text-lg font-medium">Question {qIndex + 1}</h3>
                                                    {pollData.questions.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeQuestion(qIndex)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            Remove Question
                                                        </button>
                                                    )}
                                                </div>

                                                <input
                                                    type="text"
                                                    value={question.text}
                                                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-2"
                                                    placeholder="Enter question"
                                                    required
                                                />

                                                <div className="space-y-2">
                                                    {question.options.map((option, oIndex) => (
                                                        <div key={oIndex} className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={option.text}
                                                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                                placeholder={`Option ${oIndex + 1}`}
                                                                required
                                                            />
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(qIndex, oIndex, e.target.files[0])}
                                                                className="block w-1/4 text-sm"
                                                            />
                                                            {option.image && (
                                                                <img
                                                                    src={option.image}
                                                                    alt={`Option ${oIndex + 1}`}
                                                                    className="w-12 h-12 object-cover ml-2 border rounded"
                                                                />
                                                            )}
                                                            {question.options.length > 2 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeOption(qIndex, oIndex)}
                                                                    className="text-red-600 hover:text-red-800"
                                                                >
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => addOption(qIndex)}
                                                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    + Add Option
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        + Add Question
                                    </button>

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
                                            Create Poll
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default CreatePollModal;
