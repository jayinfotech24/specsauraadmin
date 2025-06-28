"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { DeleteCoating, GetCoating } from '@/store/authSlice';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";

export default function ShowCoatingPage() {
    const [coatings, setCoatings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCoating, setSelectedCoating] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();

    const fetchCoatings = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await dispatch(GetCoating()).unwrap();
            if (response.status === 200) {
                setCoatings(response.items);
                toast.success('Coatings loaded successfully!');
            }
        } catch (error) {
            console.error("Error fetching coatings:", error);
            toast.error('Failed to load coatings');
        }
        setIsLoading(false);
    }, [dispatch]);

    useEffect(() => {
        fetchCoatings();
    }, [fetchCoatings]);

    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            const response = await dispatch(DeleteCoating(id)).unwrap();
            if (response.status === 200) {
                fetchCoatings(); // Refresh the list
                setShowDeleteModal(false);
                setSelectedCoating(null);
                toast.success('Coating deleted successfully!');
            }
        } catch (error) {
            console.error("Error deleting coating:", error);
            toast.error('Failed to delete coating');
        }
        setIsLoading(false);
    };

    const openDeleteModal = (coating) => {
        setSelectedCoating(coating);
        setShowDeleteModal(true);
    };

    const handleEdit = (coating) => {
        router.push(`/coating/?id=${coating._id}&title=${encodeURIComponent(coating.title)}`);
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Coatings</h1>
                <Button
                    onClick={() => router.push('/coating')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Add New Coating
                </Button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto p-4">
                    <Table>
                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y bg-gray-50 dark:bg-gray-800/50">
                            <TableRow>
                                <TableCell isHeader className="py-4 px-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Title</TableCell>
                                <TableCell isHeader className="py-4 px-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Description</TableCell>
                                <TableCell isHeader className="py-4 px-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Lens Name</TableCell>
                                <TableCell isHeader className="py-4 px-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Lens Type</TableCell>
                                <TableCell isHeader className="py-4 px-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Price</TableCell>
                                <TableCell isHeader className="py-4 px-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : coatings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No coatings found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                coatings.map((coating) => (
                                    <TableRow key={coating._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <TableCell className="py-4 px-6 font-medium">{coating.title}</TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                {coating.description}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">{coating.lens?.name || 'N/A'}</TableCell>
                                        <TableCell className="py-4 px-6">{coating.lens?.lensMainType || 'N/A'}</TableCell>
                                        <TableCell className="py-4 px-6">₹{coating.price}</TableCell>
                                        <TableCell className="py-4 px-6">
                                            <div className="flex gap-3">
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                                                    onClick={() => handleEdit(coating)}
                                                    disabled={isLoading}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                                                    onClick={() => openDeleteModal(coating)}
                                                    disabled={isLoading}
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
                                Delete Coating
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Are you sure you want to delete &quot;{selectedCoating?.title}&quot;? This action cannot be undone.
                            </p>

                            <div className="flex justify-center space-x-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => handleDelete(selectedCoating._id)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Deleting...' : 'Delete'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
