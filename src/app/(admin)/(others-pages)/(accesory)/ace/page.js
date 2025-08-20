"use client"

import { Suspense } from 'react';
import Index from './Acepage';
// Lazy load the actual component


export default function Page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Index />
        </Suspense>
    );
}