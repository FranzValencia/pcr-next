import React from 'react';

export default function PcrSkeleton() {
    return (
        <div className="w-full animate-pulse">
            <div className="bg-white h-screen m-5 text-sm no-margin">
                {/* Header Skeleton */}
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-5"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                <div className="float-right mt-2 mr-10 w-40">
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>

                {/* Signatories Skeleton */}
                <div className="mt-20 w-full">
                    <div className="h-24 bg-gray-200 rounded w-full"></div>
                </div>

                {/* Table Skeleton */}
                <div className="mt-5">
                    <div className="h-10 bg-gray-300 rounded w-full mb-2"></div>

                    {/* Strategic Function Skeleton */}
                    <div className="h-8 bg-amber-100 rounded w-full mb-2"></div>
                    <div className="h-16 bg-gray-100 rounded w-full mb-2"></div>

                    {/* Core Functions Skeleton */}
                    <div className="h-8 bg-amber-100 rounded w-full mb-2"></div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded w-full mb-1"></div>
                    ))}

                    {/* Support Functions Skeleton */}
                    <div className="h-8 bg-amber-100 rounded w-full mb-2"></div>
                    <div className="h-12 bg-gray-100 rounded w-full mb-2"></div>
                </div>
            </div>
        </div>
    );
}
