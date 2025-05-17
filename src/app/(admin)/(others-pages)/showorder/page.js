import React, { Suspense } from "react";
import ShowOrder from "./ShowOrder";

export default function CatPage() {
    return (
        <Suspense fallback={<div>Loading category...</div>}>
            <ShowOrder />
        </Suspense>
    );
}
