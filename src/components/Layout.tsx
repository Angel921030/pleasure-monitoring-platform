import React from 'react';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 font-pixel text-gray-900">
            <header className="bg-white border-b-4 border-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-4xl font-bold">失樂感監測平台</h1>
                    {/* Navigation will go here */}
                </div>
            </header>
            <main className="container mx-auto p-4">
                <Outlet />
            </main>
        </div>
    );
};
