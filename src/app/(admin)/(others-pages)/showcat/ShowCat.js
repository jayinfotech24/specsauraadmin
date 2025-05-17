"use client"

import React, { useCallback, useEffect, useState } from "react";
import { DeleteCategory, GetCategory } from "@/store/authSlice";


import Image from "next/image";
import {
    Table, TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

// interface Order {
//     id: number;
//     user: {
//         image: string;
//         name: string;
//         role: string;
//     };
//     projectName: string;
//     team: {
//         images: string[];
//     };
//     status: string;
//     budget: string;
// }

// Define the table data using the interface




export default function BasicTableOne() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [Data, setData] = useState([])
    const [IsLoading, setIsLoading] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")

    const showSuccessAlert = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }

    const GetCategoryData = useCallback(() => {
        dispatch(GetCategory()).then((response) => {
            console.log("Res", response);
            if (response.payload.status == 200) {
                setData(response.payload.items)
            }
        })
    }, [dispatch])

    const handleDelete = (id) => {
        setIsLoading(true);
        dispatch(DeleteCategory(id)).then((response) => {
            if (response.payload.status === 200) {
                GetCategoryData();
                setShowDeleteModal(false);
                showSuccessAlert("Category deleted successfully!");
            }
            setIsLoading(false);
        }).catch((error) => {
            console.error("Delete failed:", error);
            setIsLoading(false);
        });
    }

    const openDeleteModal = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    }

    useEffect(() => {
        GetCategoryData()
    }, [GetCategoryData])

    return (
        <>
            {/* Alert Notification */}
            {showAlert && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{alertMessage}</span>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-1 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Category
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-1 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Category Name
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-1 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Action
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-1 py-2 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Delete
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {Data.map((category, idx) => (
                                    <TableRow
                                        key={category._id}
                                        className={`transition-colors ${idx % 2 === 0 ? "bg-gray-50 dark:bg-white/[0.01]" : "bg-white dark:bg-white/[0.03]"} hover:bg-blue-50 dark:hover:bg-blue-900/30`}
                                    >
                                        <TableCell className="px-1 py-2 text-start">
                                            <div className="flex items-center gap-1">
                                                <div className="w-9 h-9 overflow-hidden rounded-full border border-gray-200">
                                                    <Image
                                                        alt={category.title}
                                                        width={36}
                                                        height={36}
                                                        src={category.url}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-1 py-2 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {category.title}
                                        </TableCell>
                                        <TableCell className="px-1 py-2 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => router.push(`/cat/?id=${category._id}`)}
                                            >
                                                Update
                                            </Button>
                                        </TableCell>
                                        <TableCell className="px-1 py-2 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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
                                ))}
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
                                Are you sure you want to delete &quot;{selectedCategory?.title}&quot;? This action cannot be undone.
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
                                    onClick={() => handleDelete(selectedCategory._id)}
                                    disabled={IsLoading}
                                >
                                    {IsLoading ? 'Deleting...' : 'Delete'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
