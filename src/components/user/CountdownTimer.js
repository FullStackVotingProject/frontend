import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ endDate, onExpire }) => {
    const calculateTimeLeft = () => {
        const difference = new Date(endDate) - new Date();
        
        if (difference <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                expired: true
            };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            expired: false
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        // Check if already expired on mount
        const initialTimeLeft = calculateTimeLeft();
        setTimeLeft(initialTimeLeft);
        if (initialTimeLeft.expired && onExpire) {
            onExpire();
        }
        
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            
            if (newTimeLeft.expired) {
                clearInterval(timer);
                if (onExpire) {
                    onExpire();
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate, onExpire]);

    if (timeLeft.expired) {
        return (
            <div className="text-red-600 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Poll ended
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-2 text-sm">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="font-medium text-blue-600">
                {timeLeft.days > 0 && `${timeLeft.days}d `}
                {timeLeft.hours > 0 && `${timeLeft.hours}h `}
                {timeLeft.minutes > 0 && `${timeLeft.minutes}m `}
                {`${timeLeft.seconds}s`}
            </div>
        </div>
    );
};

export default CountdownTimer;
