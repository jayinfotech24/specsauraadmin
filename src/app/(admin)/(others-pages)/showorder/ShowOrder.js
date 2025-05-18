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
import { GetAllOrders, UpdateOrderStatus } from "@/store/authSlice";
import Button from "@/components/ui/button/Button";
import GlobalLoading from "@/components/common/GlobalLoading";
import toast from "react-hot-toast";

export default function BasicTableOne() {
    const dispatch = useDispatch()
    const [Data, setData] = useState([])
    const [expandedOrder, setExpandedOrder] = useState(null)
    const [IsLoading, setIsLoading] = useState(false)

    const GetOrderData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await dispatch(GetAllOrders()).unwrap();
            if (response.status === 200) {
                setData(response.items);
                toast.success('Orders loaded successfully!');
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error('Failed to load orders');
        }
        setIsLoading(false);
    }, [dispatch])

    const toggleOrderDetails = (orderId) => {
        const selectedOrder = Data.find(order => order._id === orderId);
        setExpandedOrder(expandedOrder?._id === orderId ? null : selectedOrder);
    }

    const handlePrint = () => {
        if (!expandedOrder) return;

        const orderData = {
            orderId: expandedOrder._id,
            date: new Date(expandedOrder.createdAt).toLocaleDateString(),
            status: expandedOrder.status,
            items: expandedOrder.items.map(item => ({
                productID: {
                    name: item.product?.name || 'N/A',
                    price: item.product?.price || 0
                }
            })),
            totalAmount: expandedOrder.totalAmount
        };

        const subtotal = expandedOrder.totalAmount;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Order Invoice - ${orderData.orderId}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
                    body {
                        font-family: 'Poppins', sans-serif;
                        margin: 0;
                        padding: 20px;
                        color: #333;
                    }
                    .invoice {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                    }
                    .header {
                        margin-top: 20px;
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #ddd;
                        padding-bottom: 20px;
                        position: relative;
                    }
                    .header img {
                        max-width: 150px;
                        height: auto;
                        margin-bottom: 10px;
                    }
                    .header p {
                        color: #666;
                        margin: 5px 0;
                    }
                    .title {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        text-align: right;
                        font-size: 14px;
                        color: #333;
                        font-weight: 500;
                    }
                    .orderId {
                        position: absolute;
                        top: 0;
                        right: 0;
                        text-align: right;
                        font-size: 16px;
                        color: #333;
                        font-weight: 500;
                    }
                    .invoiceNumber {
                        position: absolute;
                        top: 0;
                        right: 0;
                        text-align: right;
                        font-size: 14px;
                        color: #666;
                    }
                    .invoiceNumber strong {
                        display: block;
                        color: #333;
                        font-size: 16px;
                    }
                    .details {
                        margin-bottom: 30px;
                    }
                    .details-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
                        margin-bottom: 20px;
                    }
                    .detail-item {
                        margin-bottom: 10px;
                    }
                    .detail-item strong {
                        display: block;
                        color: #666;
                        font-size: 14px;
                    }
                    .items {
                        margin-bottom: 30px;
                        overflow-x: auto;
                    }
                    .items table {
                        width: 100%;
                        border-collapse: collapse;
                        min-width: 300px;
                    }
                    .items th, .items td {
                        padding: 12px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    .items th {
                        background-color: #f8f9fa;
                        font-weight: 500;
                    }
                    .summary {
                        margin-top: 30px;
                        border-top: 2px solid #ddd;
                        padding-top: 20px;
                    }
                    .summary-item {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                    }
                    .total {
                        font-weight: 600;
                        font-size: 18px;
                        margin-top: 20px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        color: #666;
                        font-size: 14px;
                    }

                    @media (max-width: 768px) {
                        body {
                            padding: 10px;
                        }
                        .invoice {
                            padding: 15px;
                        }
                        .header {
                            margin-top: 10px;
                            margin-bottom: 20px;
                        }
                        .header img {
                            max-width: 120px;
                        }
                        .title {
                            position: static;
                            text-align: center;
                            margin-bottom: 15px;
                        }
                        .details-grid {
                            grid-template-columns: 1fr;
                            gap: 15px;
                        }
                        .items th, .items td {
                            padding: 8px;
                            font-size: 14px;
                        }
                        .summary-item, .total {
                            font-size: 16px;
                        }
                    }

                    @media (max-width: 480px) {
                        body {
                            padding: 5px;
                        }
                        .invoice {
                            padding: 10px;
                        }
                        .header img {
                            max-width: 100px;
                        }
                        .items th, .items td {
                            padding: 6px;
                            font-size: 13px;
                        }
                        .summary-item, .total {
                            font-size: 15px;
                        }
                        .footer {
                            font-size: 12px;
                        }
                    }

                    @media print {
                        body {
                            padding: 0;
                        }
                        .invoice {
                            border: none;
                            padding: 0;
                        }
                        .header {
                            margin-top: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="header">
                        <img src="/images/logo/logo2.png" alt="SpecsAura Logo" />
                        <p>Your Vision, Our Priority</p>
                    </div>
                    
                    <div class="details">
                        <div class="details-grid">
                            <div class="detail-item">
                                <strong>Order Number</strong>
                                ${orderData.orderId}
                            </div>
                            <div class="detail-item">
                                <strong>Date</strong>
                                ${orderData.date}
                            </div>
                            <div class="detail-item">
                                <strong>Status</strong>
                                ${orderData.status}
                            </div>
                        </div>
                    </div>

                    <div class="items">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orderData.items.map(item => `
                                    <tr>
                                        <td>${item.productID?.name || 'Product Name'}</td>
                                        <td>₹${item.productID?.price?.toLocaleString('en-IN') || '0'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="summary">
                        <div class="summary-item">
                            <span>Subtotal</span>
                            <span>₹${subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div class="summary-item">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div class="total">
                            <span>Total Amount</span>
                            <span>₹${subtotal.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Thank you for shopping with us!</p>
                        <p>For any queries, please contact our customer support.</p>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleStatusUpdate = async (order, newStatus) => {
        try {
            setIsLoading(true);
            const response = await dispatch(UpdateOrderStatus({
                order,
                newStatus
            })).unwrap();

            if (response.status === 200) {
                // Update the local state
                setData(prevData =>
                    prevData.map(item =>
                        item._id === order._id
                            ? {
                                ...item,
                                status: newStatus,
                                // paymentStatus: newStatus === 'Delivered' ? 'Paid' : 'Pending'
                            }
                            : item
                    )
                );
                // Update expanded order if it's the current one
                if (expandedOrder?._id === order._id) {
                    setExpandedOrder(prev => ({
                        ...prev,
                        status: newStatus,
                        // paymentStatus: newStatus === 'Delivered' ? 'Paid' : 'Pending'
                    }));
                }
                toast.success('Order status updated successfully!');
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error('Failed to update order status');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        GetOrderData()
    }, [GetOrderData])

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Orders</h1>
            </div>

            {IsLoading && <GlobalLoading />}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[800px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02]">
                                <TableRow>
                                    <TableCell isHeader className="px-1.5 py-1.5 font-medium text-gray-500 text-start text-theme-xs">
                                        Order ID
                                    </TableCell>
                                    <TableCell isHeader className="px-1.5 py-1.5 font-medium text-gray-500 text-start text-theme-xs">
                                        Customer
                                    </TableCell>
                                    <TableCell isHeader className="px-1.5 py-1.5 font-medium text-gray-500 text-start text-theme-xs">
                                        Total Amount
                                    </TableCell>
                                    <TableCell isHeader className="px-1.5 py-1.5 font-medium text-gray-500 text-start text-theme-xs">
                                        Status
                                    </TableCell>
                                    <TableCell isHeader className="px-1.5 py-1.5 font-medium text-gray-500 text-start text-theme-xs">
                                        Payment
                                    </TableCell>
                                    <TableCell isHeader className="px-1.5 py-1.5 font-medium text-gray-500 text-start text-theme-xs">
                                        Date
                                    </TableCell>
                                    <TableCell isHeader className="px-1.5 py-1.5 font-medium text-gray-500 text-start text-theme-xs">
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {IsLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-8 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : Data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                            No orders found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    Data.map((order) => (
                                        <React.Fragment key={order._id}>
                                            <TableRow className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors duration-150">
                                                <TableCell className="px-1.5 py-1.5 text-start">
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {order._id.slice(-6)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-1.5 py-1.5 text-start">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {order.shippingAddress.fullName}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {order.user.email}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-1.5 py-1.5 text-start">
                                                    <span className="text-sm font-medium text-gray-800">
                                                        ₹{order.totalAmount}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-1.5 py-1.5 text-start">
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                            ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                                    'bg-blue-100 text-blue-800'}`}>
                                                            {order.status}
                                                        </span>
                                                        <div className="relative group">
                                                            <button
                                                                onClick={() => handleStatusUpdate(
                                                                    order,
                                                                    order.status === 'Pending' ? 'Delivered' : 'Pending'
                                                                )}
                                                                disabled={IsLoading}
                                                                className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
                                                            >
                                                                <svg
                                                                    className="w-4 h-4 text-gray-500 hover:text-gray-700"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                                                                <div className="px-4 py-2 text-sm text-gray-700">
                                                                    Click to toggle status between Pending and Delivered
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-1.5 py-1.5 text-start">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                        ${order.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'}`}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-1.5 py-1.5 text-start">
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-1.5 py-1.5 text-start">
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        onClick={() => toggleOrderDetails(order._id)}
                                                        className="px-2 py-1 text-xs"
                                                        disabled={IsLoading}
                                                    >
                                                        {expandedOrder?._id === order._id ? 'Hide Details' : 'View Details'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {expandedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 mt-10 rounded-xl">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
                                <div className="flex items-center space-x-3">
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={handlePrint}
                                        className="px-3 py-1.5 text-xs"
                                        disabled={IsLoading}
                                    >
                                        Print Invoice
                                    </Button>
                                    <button
                                        onClick={() => setExpandedOrder(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                        disabled={IsLoading}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                {/* Left Column */}
                                <div className="space-y-3">
                                    {/* Order Summary */}
                                    <div className="bg-gray-50 rounded-lg p-2.5">
                                        <h3 className="text-base font-medium text-gray-900 mb-1.5">Order Summary</h3>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-600">
                                                <span className="font-medium">Order ID:</span> {expandedOrder?._id || 'N/A'}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                <span className="font-medium">Date:</span> {expandedOrder?.createdAt ? new Date(expandedOrder.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                            <div className="flex items-center space-x-2">
                                                <p className="text-xs text-gray-600">
                                                    <span className="font-medium">Status:</span>
                                                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                                        ${expandedOrder?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            expandedOrder?.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                                'bg-blue-100 text-blue-800'}`}>
                                                        {expandedOrder?.status || 'N/A'}
                                                    </span>
                                                </p>
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => handleStatusUpdate(
                                                        expandedOrder,
                                                        expandedOrder.status === 'Pending' ? 'Delivered' : 'Pending'
                                                    )}
                                                    className="px-2 py-1 text-xs"
                                                    disabled={IsLoading}
                                                >
                                                    {expandedOrder.status === 'Pending' ? 'Mark as Delivered' : 'Mark as Pending'}
                                                </Button>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                <span className="font-medium">Total Amount:</span> ₹{expandedOrder?.totalAmount || '0'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="bg-gray-50 rounded-lg p-2.5">
                                        <h3 className="text-base font-medium text-gray-900 mb-1.5">Shipping Address</h3>
                                        <div className="space-y-1">
                                            {expandedOrder?.shippingAddress ? (
                                                <>
                                                    <p className="text-xs text-gray-600 break-words">{expandedOrder.shippingAddress.fullName || 'N/A'}</p>
                                                    <p className="text-xs text-gray-600 break-words">{expandedOrder.shippingAddress.address || 'N/A'}</p>
                                                    <p className="text-xs text-gray-600 break-words">
                                                        {expandedOrder.shippingAddress.city || 'N/A'}, {expandedOrder.shippingAddress.state || 'N/A'}
                                                    </p>
                                                    <p className="text-xs text-gray-600 break-words">
                                                        {expandedOrder.shippingAddress.zipCode || 'N/A'}, {expandedOrder.shippingAddress.country || 'N/A'}
                                                    </p>
                                                    <p className="text-xs text-gray-600">Phone: {expandedOrder.shippingAddress.phone || 'N/A'}</p>
                                                </>
                                            ) : (
                                                <p className="text-xs text-gray-600">No shipping address available</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Payment Information */}
                                    <div className="bg-gray-50 rounded-lg p-2.5">
                                        <h3 className="text-base font-medium text-gray-900 mb-1.5">Payment Information</h3>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-600">
                                                <span className="font-medium">Method:</span> {expandedOrder?.paymentMethod || 'N/A'}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                <span className="font-medium">Status:</span>
                                                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                                    ${expandedOrder?.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        expandedOrder?.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'}`}>
                                                    {expandedOrder?.paymentStatus || 'N/A'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Order Items */}
                                <div>
                                    <div className="bg-gray-50 rounded-lg p-2.5">
                                        <h3 className="text-base font-medium text-gray-900 mb-1.5">Order Items</h3>
                                        <div className="space-y-2">
                                            {expandedOrder?.items && expandedOrder.items.length > 0 ? (
                                                expandedOrder.items.map((item) => (
                                                    <div key={item._id} className="bg-white rounded-lg p-2 shadow-sm">
                                                        <div className="flex items-start space-x-2">
                                                            <div className="w-14 h-14 relative flex-shrink-0">
                                                                <Image
                                                                    src={item.product?.url || '/placeholder.png'}
                                                                    alt={item.product?.name || 'Product'}
                                                                    fill
                                                                    className="object-cover rounded-lg"
                                                                />
                                                            </div>
                                                            <div className="flex-grow min-w-0">
                                                                <h4 className="text-xs font-medium text-gray-900 truncate">{item.product?.name || 'N/A'}</h4>
                                                                <div className="mt-0.5 space-y-0.5">
                                                                    <p className="text-xs text-gray-600">Quantity: {item.quantity || 0}</p>
                                                                    <p className="text-xs text-gray-600">Price: ₹{item.product?.price || 0}</p>
                                                                    <p className="text-xs text-gray-600">
                                                                        Subtotal: ₹{(item.quantity || 0) * (item.product?.price || 0)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-600">No items in this order</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
