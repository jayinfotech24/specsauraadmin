"use client";
import { Suspense } from 'react';
import AddLens from './Addlens';

export default function Page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <AddLens />
        </Suspense>
    );
}