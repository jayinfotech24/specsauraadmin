import React, { Suspense } from "react";
import VideoPage from "./VideoPage";

export default function CatPage() {
    return (
        <Suspense fallback={<div>Loading category...</div>}>
            <VideoPage />
        </Suspense>
    );
}