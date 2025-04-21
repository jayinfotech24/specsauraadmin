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
import { GetProductDetail } from "@/store/authSlice";
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
    const GetCategoryData = useCallback(() => {
        dispatch(GetProductDetail()).then((response) => {
            console.log("Res", response);
            if (response.payload.status == 200) {
                setData(response.payload.products)
            }
        })
    }, [dispatch])
    useEffect(() => {
        GetCategoryData()
    }, [GetCategoryData])

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-2 py-1 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Category
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-2 py-1 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Gender
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-2 py-1 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    totalItems
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-2 py-1 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    availableItems

                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-2 py-1 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    frameWidth

                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-2 py-1 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    frameHeight

                                </TableCell>
                                {/* <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Team
                                </TableCell> */}
                                {/* <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Action
                                </TableCell> */}
                                <TableCell
                                    isHeader
                                    className="px-2 py-1 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Action
                                </TableCell>

                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {Data.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 overflow-hidden rounded-full">
                                                <Image
                                                    alt={product.name}
                                                    width={40}
                                                    height={40}
                                                    src={product.url}

                                                />
                                            </div>
                                            <div>
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {product.name}
                                                </span>
                                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                    {`${product.price} ₹`}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-2 py-1 text-gray-500 text-start  text-theme-sm dark:text-gray-400">
                                        {product.gender}
                                    </TableCell>
                                    <TableCell className="px-2 py-1 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {product.totalItems}
                                    </TableCell>
                                    <TableCell className="px-2 py-1 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {product.availableItems
                                        }
                                    </TableCell>
                                    <TableCell className="px-2 py-1 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {product.frameWidth
                                        }
                                    </TableCell>
                                    <TableCell className="px-2 py-1 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {product.frameHeight
                                        }
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {/* <div className="flex -space-x-2">
                                            {order.team.images.map((teamImage, index) => (
                                                <div
                                                    key={index}
                                                    className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                                                >
                                                    <Image
                                                        width={24}
                                                        height={24}
                                                        src={teamImage}
                                                        alt={`Team member ${index + 1}`}
                                                        className="w-full"
                                                    />
                                                </div>
                                            ))}
                                        </div> */}

                                        <Button size="sm" variant="primary" onClick={() => router.push(`/pro/?id=${product._id}`)} >
                                            Update
                                        </Button>
                                        {/* <Badge
                                                // onClick={() => router.push("/cat")}
                                                size="sm"
                                                // color={
                                                //     order.status === "Active"
                                                //         ? "success"
                                                //         : order.status === "Pending"
                                                //             ? "warning"
                                                //             : "error"
                                                // }
                                                color="success"
                                            >
                                                Update
                                            </Badge> */}

                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {/* {order.budget} */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
