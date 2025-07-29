"use client";
import { Suspense } from 'react';
import AddGst from "./AddGst"


export default function Page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <AddGst />
        </Suspense>
    );
}