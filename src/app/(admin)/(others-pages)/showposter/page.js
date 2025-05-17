import React, { Suspense } from "react";
import ShowPoster from "./ShowPoster";

export default function CatPage() {
    return (
        <Suspense fallback={<div>Loading category...</div>}>
            <ShowPoster />
        </Suspense>
    );
}
