"use client";

import React, { Suspense } from 'react';

export function withSuspense<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function WithSuspenseComponent(props: P) {
        return (
            <Suspense
                fallback={
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                }
            >
                <WrappedComponent {...props} />
            </Suspense>
        );
    };
} 