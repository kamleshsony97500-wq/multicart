"use client";

import UseGetAllOrdersData from "@/hooks/UseGetAllOrdersData";
import UseGetCurrentUser from "@/hooks/UseGetCurrentUser";
import { AppDispatch, RootState } from "@/redux/store";
import { setAllOrdersData } from "@/redux/userSlice";
import axios from "axios";
import { motion, number } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { FiTruck } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

const Orders = () => {
    UseGetAllOrdersData();
    UseGetCurrentUser();

    const { userData } = useSelector((state: RootState) => state.user);
    const { allOrdersData } = useSelector((state: RootState) => state.user);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
    const [trackOrderModel, setTrackOrderModel] = useState<any | null>(null)

    // all orders find //
    const orders = Array.isArray(allOrdersData)
        ? allOrdersData.filter(
            (o) => String(o.buyer._id) === String(userData?._id)
        )
        : [];


    const dispatch = useDispatch<AppDispatch>()

    // ✅ FIXED loading state
    if (!allOrdersData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 text-white text-xl">
                Loading Orders...
            </div>
        );
    }

    // ✅ Empty state
    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 text-white text-center">
                <div className="text-5xl mb-4">📦</div>
                <h2 className="text-2xl font-semibold">No Orders Yet</h2>
                <p className="text-gray-400 mt-2">
                    You haven’t placed any orders yet.
                </p>
            </div>
        );
    }

    const formatDate = (date: string) => {
        if (!date) return;
        const d = new Date(date);
        return d.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isCancelDisabled = (order: any) => order.isPaid === true && order.paymentMethod === "stripe"

    const status = ["pending", "confirmed", "shipped", "delivered"];


    const randerTrackStep = (currentStatus: string) => {
        return (
            <div className="relative pl-6">
                <div className="absolute top-0 left-8 w-full bg-gray-600"></div>
                {status.map((s, i) => {
                    const active = currentStatus === s
                    return (
                        <div key={i} className="mb-6 relative flex items-start">
                            {/* dot */}
                            <div className={`w-4 h-4 rounded-full ${active ? "bg-blue-500 shadow-lg shadow-blue-500/50" : "bg-gray-500"}`}></div>
                            <div className="ml-4 text-sm">{s.toUpperCase()}</div>
                        </div>
                    )
                })}
            </div>
        )
    }


    const handleCancelOrder = async (orderId: string) => {
        try {
            await axios.post("/api/order/cancelOrder", { orderId })
            const updatedOrder = allOrdersData.map((o: any) => o._id === orderId ? { ...o, orderStatus: "cancelled" } : o)
            dispatch(setAllOrdersData(updatedOrder))
            alert("Order Cancelled Successfully!")
            setSelectedOrder(null)

        } catch (error) {
            console.log(error)
            alert("Order Cancel error")
        }
    }


    // impotant concept here for ecommerce //

    const isEligibleReturn = (deliveryDate: string, replacementDays: number) => {
        if (!deliveryDate || !replacementDays) return false;

        const deliveredAt = new Date(deliveryDate).getTime();
        const expiry = deliveredAt + replacementDays * 24 * 60 * 60 * 1000;

        return Date.now() <= expiry;

    }

    const remainingDays = (deliveryDate: string, replacementDays: number) => {
        if (!deliveryDate || !replacementDays) return 0;

        const deliveredAt = new Date(deliveryDate).getTime();
        const expiry = deliveredAt + replacementDays * 24 * 60 * 60 * 1000;

        const diff = expiry - Date.now();
        if (diff <= 0) return 0;

        return Math.ceil(diff / (24 * 60 * 60 * 1000));
    };

    const returnEndDate = (deliveryDate: string, replacementDays: number) => {
        if (!deliveryDate || !replacementDays) return false;

        const deliveredAt = new Date(deliveryDate);
        deliveredAt.setDate(deliveredAt.getDate() + replacementDays);

        return deliveredAt;

    }


    const returnOrder = async (orderId: string) => {
        try {
            const result = await axios.post("/api/order/return", { orderId })
            const updatedOrder = allOrdersData.map((o: any) => o._id === orderId ? { ...o, orderStatus: "returned", returnedAmount: result.data.returnedAmount } : o)
            dispatch(setAllOrdersData(updatedOrder))
            alert("Order Returned Successfully!")
            setSelectedOrder(null)

        } catch (error) {
            console.log(error)
            alert("Order return error")
        }
    }


    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    {/* Left side: Back + Home */}
                    <div className="flex items-center gap-3">

                        {/* Home Button */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-white/10 rounded-xl text-sm backdrop-blur-md transition"
                        >
                            🏠 Home
                        </Link>



                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            My Orders
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            All orders placed by you
                        </p>
                    </div>

                    <div className="bg-white/10 px-4 py-2 rounded-lg text-sm backdrop-blur-md">
                        {orders.length} Orders
                    </div>
                </div>

                {/* Table fr large desktop laptop*/}
                <div className="hidden lg:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left">

                        {/* Head */}
                        <thead className="text-xs bg-white/10 text-gray-300 uppercase tracking-wider">
                            <tr>
                                <th className="px-5 py-4">Order ID</th>
                                <th className="px-5 py-4">Date</th>
                                <th className="px-5 py-4">Products</th>
                                <th className="px-5 py-4">Vendor</th>
                                <th className="px-5 py-4">Payment</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4 text-right">Total</th>
                                <th className="px-5 py-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            {orders.map((order, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-white/5 hover:bg-white/5 transition"
                                >
                                    <td className="px-5 py-4 text-sm font-medium">
                                        #{String(order._id).slice(-8)}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-300">
                                        {formatDate(String(order.createdAt))}
                                    </td>

                                    <td className="px-5 py-4 text-sm space-y-1">
                                        {order.products.map((p, i) => (
                                            <div key={i} className="text-gray-300">
                                                {p.product.title.slice(0, 40) + "..."} ×{p.quantity}
                                            </div>
                                        ))}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-200">
                                        {order.productVendor.shopName}
                                    </td>

                                    {/* Payment */}
                                    <td className="px-5 py-4 text-sm">
                                        <div className="font-medium">
                                            {order.paymentMethod.toUpperCase()}
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${order.isPaid
                                                ? "bg-green-500/20 text-green-300"
                                                : "bg-yellow-500/20 text-yellow-300"
                                                }`}
                                        >
                                            {order.isPaid ? "Paid" : "Pending"}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4 text-sm">
                                        <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                                            {order.orderStatus.toUpperCase()}
                                        </span>
                                    </td>

                                    <td className="px-5 text-nowrap py-4 text-right text-green-400 font-semibold">
                                        ₹{order.totalAmount}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4 justify-center flex">
                                        {order.orderStatus === "returned" && (
                                            <span className="text-orange-400 flex flex-col gap-1 font-semibold">
                                                Returned {" "}
                                                <span className="text-white">Amount: ₹{order.returnedAmount}</span>

                                            </span>
                                        )}

                                        {order.orderStatus === "cancelled" && (
                                            <span className="text-red-400 font-semibold">
                                                Cancelled

                                            </span>
                                        )}
                                        {order.orderStatus !== "cancelled" &&
                                            order.orderStatus !== "returned" && <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="px-3 py-1 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition text-nowrap">
                                                    Check Details
                                                </button>

                                                <button
                                                    disabled={order.orderStatus === "delivered"}
                                                    onClick={() => setTrackOrderModel(order)}
                                                    className={`flex text-nowrap items-center gap-1 px-3 py-1 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition ${order.orderStatus === "delivered"
                                                        ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                                                        : "bg-white/10 hover:bg-white/20"
                                                        }`}><FiTruck size={14} />
                                                    {order.orderStatus === "delivered" ?
                                                        "Delivered" : "Track Order"}
                                                </button>
                                            </div>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>




                {/* for mobile ke liye */}
                <div className="lg:hidden space-y-4">
                    {orders.length !== 0 ? (
                        orders.map((order, index) => (
                            <motion.div key={index} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                <div className="flex justify-between">
                                    <div>
                                        <div className="text-sm text-gray-300">
                                            #{String(order._id).slice(-8)}
                                        </div>
                                        <div className="font-semibold">
                                            {formatDate(String(order.createdAt))}</div>
                                        <div className="text-sm text-gray-300 mt-1">
                                            {order.productVendor.shopName}
                                        </div>
                                    </div>

                                    <div className="text-green-400 font-bold text-right">
                                        ₹{order.totalAmount}
                                    </div>
                                </div>

                                <div className="mt-3 flex justify-between">
                                    <div>
                                        <div className="text-xs text-gray-300">
                                            Payment Method: {" "} {order.paymentMethod.toUpperCase()}
                                        </div>
                                        <div
                                            className={`text-sm px-2 py-1  ${order.isPaid
                                                ? "text-green-300"
                                                : "text-yellow-300"
                                                }`}
                                        >
                                            {order.isPaid ? "Paid" : "Pending"}
                                        </div>
                                    </div>


                                    <div className="text-right">
                                        <div className="text-xs text-gray-400">Status:</div>
                                        <div className="text-sm font-semibold">{order.orderStatus.toUpperCase()}</div>
                                    </div>
                                </div>

                                <div className="mt-3 space-y-1">
                                    {order.products.map((p, i) => (
                                        <div key={i} className="text-gray-300 text-xs">
                                            {p.product.title} ×{p.quantity}
                                        </div>
                                    ))}
                                </div>



                                <div className="px-5 py-4 justify-center flex">
                                    {order.orderStatus === "cancelled" && (
                                        <span className="text-red-400 font-semibold">
                                            Cancelled

                                        </span>
                                    )}

                                    {order.orderStatus === "returned" && (
                                        <span className="text-orange-400 flex flex-col gap-1 font-semibold">
                                            Returned
                                            <span className="text-white">Amount: ₹{order.returnedAmount}</span>


                                        </span>
                                    )}

                                    {order.orderStatus !== "cancelled" &&
                                        order.orderStatus !== "returned" && <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="px-3 py-1 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition text-nowrap">
                                                Check Details
                                            </button>

                                            <button
                                                disabled={order.orderStatus === "delivered"}
                                                onClick={() => setTrackOrderModel(order)}
                                                className={`flex text-nowrap items-center gap-1 px-3 py-1 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition ${order.orderStatus === "delivered"
                                                    ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                                                    : "bg-white/10 hover:bg-white/20"
                                                    }`}><FiTruck size={14} />
                                                {order.orderStatus === "delivered" ?
                                                    "Delivered" : "Track Order"}
                                            </button>
                                        </div>}
                                </div>
                            </motion.div>

                        ))
                    ) : (
                        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 text-white text-center">
                            <div className="text-5xl mb-4">📦</div>
                            <h2 className="text-2xl font-semibold">No Orders Yet</h2>
                            <p className="text-gray-400 mt-2">
                                You haven’t placed any orders yet.
                            </p>
                        </div>
                    )
                    }
                </div>

            </div>

            {
                selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center gap-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="relative z-10 w-full max-w-3xl bg-[#061526] border border-white/10 p-6 rounded-xl shadow-black/40 shadow-xl">
                            <h2 className="text-lg font-semibold">Order Details: #{String(selectedOrder._id).slice(-8)}</h2>
                            <p className="text-sm text-gray-300">{formatDate(String(selectedOrder.createdAt))}</p>
                            <hr className="my-4 border-white/10" />
                            <h3 className="font-semibold mb-2">Product</h3>
                            {selectedOrder.products.map((p: any, i: any) => (
                                <div key={i} className="flex justify-between bg-white/5 p-2 rounded mb-2">
                                    <div>
                                        <div className="font-medium">{p.product.title}</div>
                                        <div>Qty: {p.quantity} * Price: {p.price}</div>
                                    </div>
                                </div>
                            ))}
                            <hr className="my-4 border-white/10" />
                            <h3 className="font-semibold mb-2">Invoice</h3>
                            <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                    <span>Product Total</span>
                                    <span>₹{selectedOrder.productsTotal}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Delivery Charge</span>
                                    <span>₹{selectedOrder.deliveryCharge}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Service Charge</span>
                                    <span>₹{selectedOrder.serviceCharge}</span>
                                </div>
                            </div>
                            <hr className="my-4 border-white/10" />
                            <div className="flex justify-between font-semibold text-green-300">
                                <span>Final Total</span>
                                <span>₹{selectedOrder.totalAmount}</span>
                            </div>

                            {selectedOrder.orderStatus === "delivered" &&
                                selectedOrder.deliveryDate && (
                                    <div className="mt-3 text-sm text-green-400">
                                        Delivered on: {" "}
                                        {new Date(selectedOrder.deliveryDate).toLocaleString("en-IN")}
                                        {/* toLocaleDateString (day,and month and year only)*/}
                                    </div>
                                )}
                            {/* after paid show only  */}
                            {selectedOrder.isPaid == true && selectedOrder.paymentMethod == "stripe" && <div
                                className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs rounded-lg p-3 mt-4">
                                <p className="font-semibold mb-1">Important Note:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>
                                        Orders cancellation feature is <b>not available if payment is done using Online Payment (Stripe)</b>
                                    </li>
                                    <li>You can only <b>return the product {" "}</b>after delivery.</li>
                                    <li>No return, You will receive only the <b>product amount</b></li>
                                    <li>Delivery & Service charges not non-refundable.</li>
                                </ul>
                            </div>}

                            <div className="mt-3 flex justify-end gap-3">
                                <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-white/10 rounded">Cancel</button>


                                <button
                                    disabled={selectedOrder.orderStatus === "delivered"}
                                    onClick={() => setTrackOrderModel(selectedOrder)}
                                    className={`flex text-nowrap items-center gap-1 px-3 py-1 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition ${selectedOrder.orderStatus === "delivered"
                                        ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                                        : "bg-white/10 hover:bg-white/20"
                                        }`}><FiTruck size={14} />
                                    {selectedOrder.orderStatus === "delivered" ?
                                        "Delivered" : "Track Order"}
                                </button>

                                {selectedOrder.orderStatus !== "delivered" ? (
                                    <button
                                        onClick={() => handleCancelOrder(selectedOrder._id)}
                                        disabled={isCancelDisabled(selectedOrder)}
                                        className={`px-4 py-2 rounded ${isCancelDisabled(selectedOrder)
                                            ? "bg-white/10 text-gray-400 cursor-not-allowed"
                                            : "bg-red-600 hover:bg-red-700"
                                            }`}
                                    >
                                        Cancel Order
                                    </button>
                                ) : (
                                    selectedOrder.products.map((p: any, i: number) => {
                                        const replacementDays = p.product?.replacementDays || 0;
                                        const eligible = isEligibleReturn(
                                            selectedOrder.deliveryDate,
                                            replacementDays
                                        );
                                        const remaining = remainingDays(
                                            selectedOrder.deliveryDate,
                                            replacementDays
                                        );
                                        const endDate = returnEndDate(
                                            selectedOrder.deliveryDate,
                                            replacementDays
                                        );

                                        return (
                                            <div
                                                key={i}
                                                className="md:flex-row flex flex-col justify-between items-center bg-white/5 px-3 py-2 rounded ml-2"
                                            >
                                                <div>
                                                    <p className="text-sm text-gray-300">
                                                        {p.product?.title?.slice(0, 25) + (".....")}
                                                    </p>

                                                    {eligible ? (
                                                        <>
                                                            <p className="text-sm text-yellow-400">
                                                                Return available for {remaining} day{" "}
                                                                {remaining > 1 ? "s" : ""}
                                                            </p>

                                                            {endDate && (
                                                                <p className="text-[11px] text-gray-400">
                                                                    Return Till: {endDate.toLocaleDateString("en-IN")}
                                                                </p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p className="text-xs text-red-400">
                                                            Return window closed
                                                        </p>
                                                    )}
                                                </div>

                                                {eligible && (
                                                    <button
                                                        onClick={() => returnOrder(selectedOrder._id)}
                                                        className="px-3 py-1 bg-yellow-600 rounded text-sm">
                                                        Return
                                                    </button>)
                                                }
                                            </div>
                                        );
                                    })
                                )}


                            </div>
                        </motion.div>
                    </div>
                )
            }

            {
                trackOrderModel && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center gap-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="relative z-10 w-full max-w-md bg-[#061526] border border-white/10 p-6 rounded-xl shadow-black/40 shadow-xl space-y-2">
                            <h2 className="text-xl font-semibold">Track Order</h2>

                            <div className="text-gray-300 mb-4 text-sm leading-relaxed">
                                <h2 className="text-md font-bold mb-2">Complete Delivery Address</h2>
                                <div className="flex justify-start gap-2">
                                    <span className="font-semibold">Buyer Name: </span>
                                    <span>{trackOrderModel.address.name}</span>
                                </div>

                                <div className="flex justify-start gap-2">
                                    <span className="font-semibold">Deliver Address: </span>
                                    <span>{trackOrderModel.address.address}</span>
                                </div>

                                <div className="flex justify-start gap-2">
                                    <span className="font-semibold">City: </span>
                                    <span>{trackOrderModel.address.city}</span>
                                </div>

                                <div className="flex justify-start gap-2">
                                    <span className="font-semibold">Pincode: </span>
                                    <span>{trackOrderModel.address.pincode}</span>
                                </div>

                                <div className="flex justify-start gap-2">
                                    <span className="font-semibold">Mobile No: </span>
                                    <span>{trackOrderModel.address.phone}</span>
                                </div>
                            </div>

                            {randerTrackStep(trackOrderModel.orderStatus)}
                            <button onClick={() => setTrackOrderModel(null)} className="px-4 py-2 bg-white/10 rounded">Cancel</button>
                        </motion.div>
                    </div>
                )
            }
        </div >
    );
};

export default Orders;