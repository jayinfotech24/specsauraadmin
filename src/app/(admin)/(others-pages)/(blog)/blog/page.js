"use client";
import { Suspense } from 'react';
import BlogClientPage from './BlogClientPage';

export default function Page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <BlogClientPage />
        </Suspense>
    );
}