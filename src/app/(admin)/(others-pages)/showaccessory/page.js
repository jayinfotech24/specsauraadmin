"use client"

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
    Table, TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useDispatch } from "react-redux";
import { GetAllAccessories, DeleteAccessory } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function ShowAccessory() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [Data, setData] = useState([])
    const [IsLoading, setIsLoading] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedAccessory, setSelectedAccessory] = useState(null)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")

    const GetAccessoryData = useCallback(() => {
        dispatch(GetAllAccessories()).then((response) => {
            console.log("Res", response);
            if (response.payload.status == 200) {
                setData(response.payload.accessories
                    || response.payload.data || [])
            }
        })
    }, [dispatch])

    const showSuccessAlert = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }

    const handleDelete = (id) => {
        setIsLoading(true);
        dispatch(DeleteAccessory(id)).then((response) => {
            if (response.payload.status === 200) {
                GetAccessoryData();
                setShowDeleteModal(false);
                showSuccessAlert("Accessory deleted successfully!");
            }
            setIsLoading(false);
        }).catch((error) => {
            console.error("Delete failed:", error);
            setIsLoading(false);
        });
    }

    const openDeleteModal = (accessory) => {
        setSelectedAccessory(accessory);
        setShowDeleteModal(true);
    }

    useEffect(() => {
        GetAccessoryData()
    }, [GetAccessoryData])

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
                    <div className="min-w-[800px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-1.5 py-1.5 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Accessory
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-1.5 py-1.5 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Category
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-1.5 py-1.5 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Stock
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-1.5 py-1.5 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Available
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-1.5 py-1.5 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Price
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-1.5 py-1.5 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Action
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-1.5 py-1.5 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Delete
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {Data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                        No Accessories Found
                                                    </h3>
                                                    <p className="text-gray-500 dark:text-gray-400">
                                                        Get started by adding your first accessory to the catalog.
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={() => router.push('/ace')}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                >
                                                    Add New Accessory
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    Data.map((accessory) => (
                                        <TableRow key={accessory._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors duration-150">
                                            <TableCell className="px-1.5 py-1.5 text-start">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-6 h-6 overflow-hidden rounded-full">
                                                        <Image
                                                            alt={accessory.name || accessory.title}
                                                            width={24}
                                                            height={24}
                                                            src={accessory.url || accessory.image || accessory.thumbnail || "/images/product/product-01.jpg"}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                            {accessory.name || accessory.title}
                                                        </span>
                                                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                            {accessory.description || accessory.shortDescription || "No description"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-1.5 py-1.5 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {accessory.category?.title || accessory.type || "N/A"}
                                            </TableCell>
                                            <TableCell className="px-1.5 py-1.5 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {accessory.totalItems || accessory.stock || accessory.quantity || 0}
                                            </TableCell>
                                            <TableCell className="px-1.5 py-1.5 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {accessory.availableItems || accessory.availableStock || accessory.availableQuantity || 0}
                                            </TableCell>
                                            <TableCell className="px-1.5 py-1.5 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {`${accessory.price || 0} ₹`}
                                            </TableCell>
                                            <TableCell className="px-1.5 py-1.5 text-start">
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => router.push(`/ace/?id=${accessory._id}`)}
                                                    className="px-1.5 py-0.5 text-xs"
                                                >
                                                    Update
                                                </Button>
                                            </TableCell>
                                            <TableCell className="px-1.5 py-1.5 text-start">
                                                <Button
                                                    size="sm"
                                                    className="bg-red-600 hover:bg-red-700 text-white px-1.5 py-0.5 text-xs"
                                                    onClick={() => openDeleteModal(accessory)}
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
                                Delete Accessory
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Are you sure you want to delete &quot;{selectedAccessory?.name || selectedAccessory?.title}&quot;? This action cannot be undone.
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
                                    onClick={() => handleDelete(selectedAccessory._id)}
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
