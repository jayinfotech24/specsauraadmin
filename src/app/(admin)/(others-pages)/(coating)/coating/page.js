"use client";
import { Suspense } from 'react';
import AddCoating from "./AddCoating"

export default function Page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <AddCoating />
        </Suspense>
    );
}