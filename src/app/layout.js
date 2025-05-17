import GlobalLoading from '../components/common/GlobalLoading'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function RootLayout({ children }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {

        const startLoading = () => { setIsLoading(true) }
        const stopLoading = () => {
            setIsLoading(false);
        }

        router.events.on("routeChangeStart", startLoading);
        router.events.on("routeChangeComplete", stopLoading);
        router.events.on("routeChangeError", stopLoading);


        return () => {
            router.events.off("routeChangeStart", startLoading);
            router.events.off("routeChangeComplete", stopLoading);
            router.events.off("routeChangeError", stopLoading);
        }
    }, [router.events])
    return (
        <html lang="en">
            <body>
                {
                    isLoading && (
                        <GlobalLoading />
                    )

                }

                <main>
                    {children}
                </main>
            </body>
        </html>
    )
} 