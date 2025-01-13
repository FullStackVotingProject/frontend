export const checkPollStatus = (poll) => {
    const currentTime = new Date();
    const endTime = new Date(poll.end_time);
    return currentTime > endTime ? 'ended' : 'active';
};

export const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
};
