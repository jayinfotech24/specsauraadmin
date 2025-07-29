"use client";

import { DeleteGst, GetAllGst } from "@/store/authSlice";
import React, { useEffect, useState } from "react";

import {
    Table, TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import GlobalLoading from "@/components/common/GlobalLoading";
import toast from "react-hot-toast";



const GstDetails = () => {
    const [IsLoading, setIsLoading] = useState(false)
    const [GstData, setGstData] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const dispatch = useDispatch();

    const [selectedRate, setSelectedRate] = useState(null)
    const router = useRouter()
    const GetAllData = () => {
        setIsLoading(true)
        dispatch(GetAllGst()).then((response) => {
            console.log("RRRRR", response);
            if (response.payload.status == 200) {
                setGstData(response.payload.items)
                setIsLoading(false)
            }
        }).catch((error) => {
            console.log("Error", error)
            setIsLoading(false)
        })
    }


    useEffect(() => {
        GetAllData()
    }, [])
    const openDeleteModal = (rate) => {
        setSelectedRate(rate);
        setShowDeleteModal(true);
    };
    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            const response = await dispatch(DeleteGst(id)).unwrap();
            if (response.status === 200) {
                GetAllData()
                setShowDeleteModal(false);
                setSelectedRate(null);
                toast.success('Rate deleted successfully!');
            }
        } catch (error) {
            console.error("Error deleting rate:", error);
            toast.error('Failed to delete rate');
        }
        setIsLoading(false);
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Rates</h1>
                <Button
                    onClick={() => router.push('/addgst')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Add New Rate
                </Button>
            </div>

            {IsLoading && <GlobalLoading />}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[800px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-2 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-[100px]"
                                    >
                                        Type
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-2 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-[200px]"
                                    >
                                        Rate
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-2 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-[100px]"
                                    >
                                        Action
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-2 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-[100px]"
                                    >
                                        Delete
                                    </TableCell>

                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {IsLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-8 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : GstData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                            No rates found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    GstData.map((category, idx) => (
                                        <TableRow
                                            key={category._id}
                                            className={`transition-colors ${idx % 2 === 0 ? "bg-gray-50 dark:bg-white/[0.01]" : "bg-white dark:bg-white/[0.03]"} hover:bg-blue-50 dark:hover:bg-blue-900/30`}
                                        >
                                            <TableCell className="px-2 py-2 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {category?.name}
                                            </TableCell>

                                            <TableCell className="px-2 py-2 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {category?.gst}
                                            </TableCell>
                                            <TableCell className="px-2 py-2 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => router.push(`/addgst/?id=${category._id}`)}
                                                    disabled={IsLoading}
                                                >
                                                    Update
                                                </Button>
                                            </TableCell>
                                            <TableCell className="px-2 py-2 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Button
                                                    size="sm"
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                    onClick={() => openDeleteModal(category)}
                                                    disabled={IsLoading}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
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
                                Delete Category
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Are you sure you want to delete &quot;{selectedRate.name}&quot;? This action cannot be undone.
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
                                    onClick={() => handleDelete(selectedRate._id)}
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
    )
}

export default GstDetails