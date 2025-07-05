"use client";
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from "next/image";

export default function GlobalLoading() {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleStart = () => {
            setIsLoading(true);
        };

        // const handleComplete = () => {
        //     setTimeout(() => {
        //         setIsLoading(false);
        //     }, 500);
        // };

        // Show loading when pathname or searchParams change
        handleStart();
        // handleComplete();

        return () => {
            setIsLoading(false);
        };
    }, [pathname, searchParams]);

    if (!isLoading) return null;

    return (
        <div className="preloader">
            <div className="logo">
                <Image width={100} height={50} src="/images/logo/logo2.png" alt="Logo" />
            </div>
            <div className="line"></div>
        </div>
    );
} 