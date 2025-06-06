import { Suspense } from 'react';
import PosterPage from './PosterPage';
// Lazy load the actual component


export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        }>
            <PosterPage />
        </Suspense>
    );
}