import React from 'react';

export default function RsmSkeleton() {
    return (
        <div className="relative animate-pulse">
            {/* Header Skeleton */}
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-5"></div>

            {/* Table Skeleton */}
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <div className="h-10 bg-gray-200 w-full mb-1"></div>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 w-full mb-1 border-b border-gray-200"></div>
                ))}
            </div>

            {/* Add Button Skeleton */}
            <div className="fixed bottom-5 left-5 h-12 w-32 bg-gray-300 rounded-lg"></div>
        </div>
    );
}
