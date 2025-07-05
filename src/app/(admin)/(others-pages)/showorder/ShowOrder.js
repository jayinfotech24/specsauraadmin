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
import * as XLSX from 'xlsx';

export default function BasicTableOne() {
    const dispatch = useDispatch()
    const [Data, setData] = useState([])
    const [expandedOrder, setExpandedOrder] = useState(null)
    const [IsLoading, setIsLoading] = useState(false)

    const GetOrderData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await dispatch(GetAllOrders()).unwrap();
            console.log("Res", response)
            if (response.status == 200) {
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

        const calculateItemTotal = (item) => {
            const productPrice = item.product?.price || 0;
            const lensPrice = item.cart?.lensType?.price || 0;
            const coatingPrice = item.cart?.lensCoating?.price || 0;
            const quantity = item.quantity || 1;

            const subtotal = productPrice + lensPrice + coatingPrice;
            return {
                productPrice,
                lensPrice,
                coatingPrice,
                subtotal,
                total: subtotal * quantity
            };
        };

        const formatPrice = (price) => {
            return `₹${price?.toLocaleString() || 0}`;
        };

        const orderData = {
            orderId: expandedOrder._id,
            date: new Date(expandedOrder.createdAt).toLocaleDateString(),
            status: expandedOrder.status,
            paymentStatus: expandedOrder.paymentStatus,
            paymentMethod: expandedOrder.paymentMethod,
            shippingAddress: expandedOrder.shippingAddress,
            items: expandedOrder.items.map(item => {
                const pricing = calculateItemTotal(item);
                return {
                    product: {
                        name: item.product?.name || 'N/A',
                        price: item.product?.price || 0,
                        url: item.product?.url || ''
                    },
                    lensType: item.cart?.lensType ? {
                        name: item.cart.lensType.name,
                        type: item.cart.lensType.lensMainType,
                        price: item.cart.lensType.price,
                        description: item.cart.lensType.description
                    } : null,
                    lensCoating: item.cart?.lensCoating ? {
                        title: item.cart.lensCoating.title,
                        price: item.cart.lensCoating.price,
                        description: item.cart.lensCoating.description
                    } : null,
                    quantity: item.quantity || 1,
                    pricing: pricing
                };
            }),
            totalAmount: expandedOrder.totalAmount
        };

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Order Invoice - ${orderData.orderId}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Poppins', sans-serif;
                        margin: 0;
                        padding: 20px;
                        color: #333;
                        background: #fff;
                    }
                    .invoice {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 30px;
                        border: 2px solid #ddd;
                        background: #fff;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 3px solid #2563eb;
                        padding-bottom: 20px;
                        position: relative;
                    }
                    .header h1 {
                        color: #2563eb;
                        font-size: 28px;
                        font-weight: 700;
                        margin-bottom: 10px;
                    }
                    .header p {
                        color: #666;
                        margin: 5px 0;
                        font-size: 14px;
                    }
                    .order-info {
                        position: absolute;
                        top: 0;
                        right: 0;
                        text-align: right;
                        font-size: 14px;
                    }
                    .order-id {
                        font-size: 18px;
                        font-weight: 600;
                        color: #2563eb;
                        margin-bottom: 5px;
                    }
                    .order-date {
                        color: #666;
                        margin-bottom: 5px;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 500;
                        margin-bottom: 5px;
                    }
                    .status-pending { background: #fef3c7; color: #92400e; }
                    .status-delivered { background: #d1fae5; color: #065f46; }
                    .status-processing { background: #dbeafe; color: #1e40af; }
                    
                    .details-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 30px;
                        margin-bottom: 30px;
                    }
                    .detail-section {
                        background: #f8fafc;
                        padding: 20px;
                        border-radius: 8px;
                        border: 1px solid #e2e8f0;
                    }
                    .detail-section h3 {
                        color: #1e293b;
                        font-size: 16px;
                        font-weight: 600;
                        margin-bottom: 15px;
                        border-bottom: 2px solid #e2e8f0;
                        padding-bottom: 8px;
                    }
                    .detail-item {
                        margin-bottom: 8px;
                        font-size: 14px;
                    }
                    .detail-label {
                        font-weight: 500;
                        color: #475569;
                        display: inline-block;
                        width: 120px;
                    }
                    .detail-value {
                        color: #1e293b;
                        font-weight: 400;
                    }
                    
                    .items-section {
                        margin-bottom: 30px;
                    }
                    .items-section h3 {
                        color: #1e293b;
                        font-size: 18px;
                        font-weight: 600;
                        margin-bottom: 20px;
                        border-bottom: 2px solid #e2e8f0;
                        padding-bottom: 10px;
                    }
                    .item {
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 8px;
                        padding: 20px;
                        margin-bottom: 15px;
                    }
                    .item-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 15px;
                    }
                    .item-info {
                        flex: 1;
                    }
                    .item-name {
                        font-size: 16px;
                        font-weight: 600;
                        color: #1e293b;
                        margin-bottom: 5px;
                    }
                    .item-quantity {
                        font-size: 14px;
                        color: #64748b;
                    }
                    .item-pricing {
                        text-align: right;
                        min-width: 200px;
                    }
                    .price-breakdown {
                        background: #fff;
                        border: 1px solid #e2e8f0;
                        border-radius: 6px;
                        padding: 12px;
                        font-size: 13px;
                    }
                    .price-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 4px;
                    }
                    .price-row.total {
                        border-top: 1px solid #e2e8f0;
                        padding-top: 8px;
                        margin-top: 8px;
                        font-weight: 600;
                        font-size: 14px;
                        color: #2563eb;
                    }
                    
                    .lens-details, .coating-details {
                        background: #fff;
                        border: 1px solid #e2e8f0;
                        border-radius: 6px;
                        padding: 10px;
                        margin-top: 10px;
                        font-size: 12px;
                    }
                    .lens-details h4, .coating-details h4 {
                        font-weight: 600;
                        color: #1e293b;
                        margin-bottom: 5px;
                    }
                    .lens-details { border-left: 4px solid #64748b; }
                    .coating-details { border-left: 4px solid #2563eb; }
                    
                    .summary {
                        background: #f8fafc;
                        border: 2px solid #e2e8f0;
                        border-radius: 8px;
                        padding: 20px;
                        text-align: right;
                    }
                    .summary h3 {
                        color: #1e293b;
                        font-size: 18px;
                        font-weight: 600;
                        margin-bottom: 15px;
                        text-align: center;
                    }
                    .total-amount {
                        font-size: 24px;
                        font-weight: 700;
                        color: #2563eb;
                        border-top: 2px solid #e2e8f0;
                        padding-top: 15px;
                        margin-top: 15px;
                    }
                    
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        color: #64748b;
                        font-size: 12px;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 20px;
                    }
                    
                    @media print {
                        body { padding: 0; }
                        .invoice { border: none; max-width: none; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="header">
                        <img src="/images/logo/logo2.png" alt="SpecsAura Logo" style="max-width: 150px; height: auto; margin-bottom: 10px;" />
                        <p>Professional Eyewear Solutions</p>
                        <p>Your Vision, Our Priority</p>
                        
                        <div class="order-info">
                            <div class="order-id">Order #${orderData.orderId.slice(-8)}</div>
                            <div class="order-date">Date: ${orderData.date}</div>
                       
                        </div>
                    </div>

                    <div class="details-grid">
                        <div class="detail-section">
                            <h3>Shipping Address</h3>
                            <div class="detail-item">
                                <span class="detail-label">Name:</span>
                                <span class="detail-value">${orderData.shippingAddress?.fullName || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Address:</span>
                                <span class="detail-value">${orderData.shippingAddress?.address || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">City:</span>
                                <span class="detail-value">${orderData.shippingAddress?.city || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">State:</span>
                                <span class="detail-value">${orderData.shippingAddress?.state || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">ZIP:</span>
                                <span class="detail-value">${orderData.shippingAddress?.zipCode || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Country:</span>
                                <span class="detail-value">${orderData.shippingAddress?.country || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Phone:</span>
                                <span class="detail-value">${orderData.shippingAddress?.phone || 'N/A'}</span>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h3>Payment Information</h3>
                            <div class="detail-item">
                                <span class="detail-label">Method:</span>
                                <span class="detail-value">${orderData.paymentMethod}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value">${orderData.paymentStatus}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Order Status:</span>
                                <span class="detail-value">${orderData.status}</span>
                            </div>
                        </div>
                    </div>

                    <div class="items-section">
                        <h3>Order Items</h3>
                        ${orderData.items.map(item => `
                            <div class="item">
                                <div class="item-header">
                                    <div class="item-info">
                                        <div class="item-name">${item.product.name}</div>
                                        <div class="item-quantity">Quantity: ${item.quantity}</div>
                                        
                                        ${item.lensType ? `
                                            <div class="lens-details">
                                                <h4>Lens: ${item.lensType.name} (${item.lensType.type})</h4>
                                            </div>
                                        ` : ''}
                                        
                                      
                                    </div>
                                    
                                    <div class="item-pricing">
                                        <div class="price-breakdown">
                                            <div class="price-row">
                                                <span>Product:</span>
                                                <span>${formatPrice(item.pricing.productPrice)}</span>
                                            </div>
                                            <div class="price-row">
                                                <span>Lens:</span>
                                                <span>${formatPrice(item.pricing.lensPrice)}</span>
                                            </div>
                                            <div class="price-row">
                                                <span>Coating:</span>
                                                <span>${formatPrice(item.pricing.coatingPrice)}</span>
                                            </div>
                                            <div class="price-row">
                                                <span>Subtotal:</span>
                                                <span>${formatPrice(item.pricing.subtotal)}</span>
                                            </div>
                                            <div class="price-row total">
                                                <span>Total (Qty: ${item.quantity}):</span>
                                                <span>${formatPrice(item.pricing.total)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="summary">
                        <h3>Order Summary</h3>
                        <div class="total-amount">
                            Total Amount: ${formatPrice(orderData.totalAmount)}
                        </div>
                    </div>

                    <div class="footer">
                        <p>Thank you for choosing SpecsAura!</p>
                        <p>For any queries, please contact our customer support.</p>
                        <p>This is a computer-generated invoice.</p>
                    </div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
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

    const calculateItemTotal = (item) => {
        const productPrice = item.product?.price || 0;
        const lensPrice = item.cart?.lensType?.price || 0;
        const coatingPrice = item.cart?.lensCoating?.price || 0;
        const quantity = item.quantity || 1;

        const subtotal = productPrice + lensPrice + coatingPrice;
        return {
            productPrice,
            lensPrice,
            coatingPrice,
            subtotal,
            total: subtotal * quantity
        };
    };

    const formatPrice = (price) => {
        return `₹${price?.toLocaleString() || 0}`;
    };

    const exportToExcel = () => {
        if (Data.length === 0) {
            toast.error('No data to export');
            return;
        }

        try {
            // Prepare data for Excel export
            const excelData = Data.map(order => {
                const netAmount = order.totalAmount - (order.totalAmount * 0.02);
                const items = order.items?.map(item => {
                    const productPrice = item.product?.price || 0;
                    const lensPrice = item.cart?.lensType?.price || 0;
                    const coatingPrice = item.cart?.lensCoating?.price || 0;
                    const subtotal = productPrice + lensPrice + coatingPrice;
                    const total = subtotal * (item.quantity || 1);

                    return `${item.product?.name || 'N/A'} (Qty: ${item.quantity || 1}) - Product: ₹${productPrice}, Lens: ${item.cart?.lensType?.name || 'N/A'} (₹${lensPrice}), Coating: ${item.cart?.lensCoating?.title || 'N/A'} (₹${coatingPrice}), Total: ₹${total}`;
                }).join(' | ') || 'N/A';

                return {
                    'Order ID': order._id.slice(-8),
                    'Customer Name': order.shippingAddress?.fullName || 'N/A',
                    'Customer Email': order.user?.email || 'N/A',
                    'Customer Phone': order.shippingAddress?.phone || 'N/A',
                    'Shipping Address': `${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''}, ${order.shippingAddress?.zipCode || ''}, ${order.shippingAddress?.country || ''}`.trim(),
                    'Order Items': items,
                    'Total Amount': order.totalAmount,
                    'Net Amount (after 2% fee)': netAmount.toFixed(2),
                    'Order Status': order.status,
                    'Payment Status': order.paymentStatus,
                    'Payment Method': order.paymentMethod,
                    'Order Date': new Date(order.createdAt).toLocaleDateString(),
                    'Order Time': new Date(order.createdAt).toLocaleTimeString()
                };
            });

            // Create workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(excelData);

            // Auto-size columns
            const columnWidths = [
                { wch: 12 }, // Order ID
                { wch: 20 }, // Customer Name
                { wch: 25 }, // Customer Email
                { wch: 15 }, // Customer Phone
                { wch: 40 }, // Shipping Address
                { wch: 50 }, // Order Items
                { wch: 15 }, // Total Amount
                { wch: 20 }, // Net Amount
                { wch: 15 }, // Order Status
                { wch: 15 }, // Payment Status
                { wch: 15 }, // Payment Method
                { wch: 12 }, // Order Date
                { wch: 12 }  // Order Time
            ];
            worksheet['!cols'] = columnWidths;

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

            // Generate filename with current date
            const currentDate = new Date().toISOString().split('T')[0];
            const filename = `orders_export_${currentDate}.xlsx`;

            // Save the file
            XLSX.writeFile(workbook, filename);
            toast.success('Orders exported to Excel successfully!');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            toast.error('Failed to export orders to Excel');
        }
    };

    useEffect(() => {
        GetOrderData()
    }, [GetOrderData])

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Orders</h1>
                <Button
                    onClick={exportToExcel}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={IsLoading || Data.length === 0}
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export to Excel
                </Button>
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
                                        Net Amount (after fee)
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
                                                    <span className="text-sm font-bold text-green-700">
                                                        {formatPrice(order.totalAmount - (order.totalAmount * 0.02))}
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
                                                expandedOrder.items.map((item, index) => {
                                                    const pricing = calculateItemTotal(item);
                                                    return (
                                                        <div key={item._id || index} className="bg-white rounded-lg p-2 shadow-sm">
                                                            <div className="flex items-start space-x-2">
                                                                <div className="w-14 h-14 relative flex-shrink-0">
                                                                    <Image
                                                                        src={item.product?.url || '/placeholder.png'}
                                                                        alt={item.product?.name || 'Product'}
                                                                        fill
                                                                        className="object-cover rounded-md"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                                        {item.product?.name || 'N/A'}
                                                                    </h4>
                                                                    <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>

                                                                    {/* Lens Details */}
                                                                    {item.cart?.lensType && (
                                                                        <div className="mt-1 p-1 bg-gray-50 rounded text-xs">
                                                                            <p className="font-medium text-gray-700">
                                                                                Lens: {item.cart.lensType.name} ({item.cart.lensType.lensMainType})
                                                                            </p>
                                                                            <p className="text-gray-500">{item.cart.lensType.description}</p>
                                                                        </div>
                                                                    )}

                                                                    {/* Coating Details */}
                                                                    {item.cart?.lensCoating && (
                                                                        <div className="mt-1 p-1 bg-blue-50 rounded text-xs">
                                                                            <p className="font-medium text-blue-700">
                                                                                Coating: {item.cart.lensCoating.title}
                                                                            </p>
                                                                            <p className="text-blue-500">{item.cart.lensCoating.description}</p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Pricing Breakdown */}
                                                                <div className="text-right min-w-[120px]">
                                                                    <div className="bg-gray-50 p-2 rounded text-xs space-y-1">
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-600">Product:</span>
                                                                            <span className="font-medium">{formatPrice(pricing.productPrice)}</span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-600">Lens:</span>
                                                                            <span className="font-medium">{formatPrice(pricing.lensPrice)}</span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-600">Coating:</span>
                                                                            <span className="font-medium">{formatPrice(pricing.coatingPrice)}</span>
                                                                        </div>
                                                                        <div className="border-t border-gray-200 pt-1">
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-700 font-medium">Subtotal:</span>
                                                                                <span className="font-semibold">{formatPrice(pricing.subtotal)}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-700">Qty: {item.quantity}</span>
                                                                                <span className="font-bold text-blue-600">
                                                                                    {formatPrice(pricing.total)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-xs text-gray-600">No items found</p>
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
