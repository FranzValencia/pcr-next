import React from 'react';

export default function NavbarSkeleton() {
    return (
        <div className="navbar bg-base-100 shadow-md no-print animate-pulse">
            <div className="flex flex-1">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-2"></div>
                <div className="w-32 h-10 bg-gray-200 rounded mr-2"></div>
                <div className="w-32 h-10 bg-gray-200 rounded mr-2"></div>
                <div className="w-32 h-10 bg-gray-200 rounded mr-2"></div>
            </div>
            <div className="mr-10 w-24 h-6 bg-gray-200 rounded"></div>
            <div className="flex-none">
                <div className="w-20 h-12 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
