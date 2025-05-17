import React, { Suspense } from "react";
import ShowCat from "./ShowCat";

export default function CatPage() {
    return (
        <Suspense fallback={<div>Loading category...</div>}>
            <ShowCat />
        </Suspense>
    );
}
