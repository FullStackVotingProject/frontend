import React from 'react';
import LogoutButton from './LogoutButton';

const UserDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <LogoutButton className="ml-4" />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-10">
                <main>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* Add your user dashboard content here */}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;
