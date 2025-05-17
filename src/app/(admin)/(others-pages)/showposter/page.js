"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GetAllPosters, DeletePoster } from "@/store/authSlice";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function ShowPoster() {
    const [IsLoading, setIsLoding] = useState(false)
    const dispatch = useDispatch();
    const router = useRouter();
    const [posters, setPosters] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPoster, setSelectedPoster] = useState(null);

    const fetchPosters = async () => {
        setIsLoading(true);
        try {
            const response = await dispatch(GetAllPosters()).unwrap();
            if (response.status === 200) {
                setPosters(response.items);
            }
        } catch (error) {
            console.error("Error fetching posters:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchPosters();
    }, [dispatch]);

    const handleDelete = async (id) => {
        setIsLoding(true);
        try {
            const response = await dispatch(DeletePoster(id)).unwrap();
            if (response.status === 200) {
                fetchPosters(); // Refresh the list
                setShowDeleteModal(false);
                setSelectedPoster(null);
            }
        } catch (error) {
            console.error("Error deleting poster:", error);
        }
        setIsLoding(false);
    };

    const openDeleteModal = (poster) => {
        setSelectedPoster(poster);
        setShowDeleteModal(true);
    };

    const handleUpdate = (id) => {
        router.push(`/poster/${id}`);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Posters</h1>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto p-4">
                    <Table>
                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y bg-gray-50 dark:bg-gray-800/50">
                            <TableRow>
                                <TableCell isHeader className="py-4 px-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Image
                                </TableCell>
                                <TableCell isHeader className="py-4 px-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Title
                                </TableCell>
                                <TableCell isHeader className="py-4 px-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Description
                                </TableCell>
                                <TableCell isHeader className="py-4 px-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-8 text-center">
                                        <div className="spinnerContainer">
                                            <div className="spinner"></div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : posters.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No posters found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                posters.map((poster) => (
                                    <TableRow key={poster._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <TableCell className="py-4 px-6">
                                            <div className="h-[80px] w-[120px] overflow-hidden rounded-lg shadow-sm">
                                                <Image
                                                    width={120}
                                                    height={80}
                                                    src={poster.url}
                                                    className="h-full w-full object-cover"
                                                    alt={poster.title}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span className="text-sm font-medium text-gray-800 dark:text-white">
                                                {poster.title}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                {poster.description}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <div className="flex gap-3">
                                                <Button
                                                    size="sm"
                                                    className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                                                    onClick={() => openDeleteModal(poster)}
                                                    disabled={IsLoading}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Delete Poster
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Are you sure you want to delete "{selectedPoster?.title}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={IsLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => handleDelete(selectedPoster._id)}
                                    disabled={IsLoading}
                                >
                                    {IsLoading ? 'Deleting...' : 'Delete'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
