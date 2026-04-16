"use client";


import UseGetAllOrdersData from "@/hooks/UseGetAllOrdersData";
import UseGetCurrentUser from "@/hooks/UseGetCurrentUser";
import { AppDispatch, RootState } from "@/redux/store";
import { setAllOrdersData } from "@/redux/userSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


const VendorOrders = () => {
  UseGetAllOrdersData();
  UseGetCurrentUser();

  const dispatch = useDispatch<AppDispatch>()
  const [otpModel, setOtpModel] = useState<any | null>(null)
  const [otp, setOtp] = useState("")

  const { userData } = useSelector((state: RootState) => state.user);
  const { allOrdersData } = useSelector((state: RootState) => state.user);

  // all orders find //
  const orders = Array.isArray(allOrdersData)
    ? allOrdersData.filter(
      (o) => String(o.productVendor._id) === String(userData?._id)
    )
    : [];
  // console.log(orders)

  const statusOptions = ["pending", "confirmed", "shipped", "delivered", "returned"];



  const updateStatus = async (orderId: string, status: string) => {
    try {
      await axios.post("/api/order/update-status", {
        orderId, status
      })
      dispatch(setAllOrdersData(
        allOrdersData.map((o: any) => (
          o._id === orderId ? { ...o, orderStatus: status } : o
        ))
      ))


    } catch (error) {
      console.log(error)
      alert("orderStatus error")

    }
  }


  const verifyOtp = async () => {
    try {
      await axios.post("/api/order/verify-delivery-otp", {
        orderId: otpModel._id,
        otp: otp
      })
      dispatch(setAllOrdersData(
        allOrdersData.map((o: any) => (
          o._id === otpModel._id ? { ...o, orderStatus: "delivered" } : o
        ))
      ))
      alert("Order Delivered Successfully ✅")
      setOtpModel(null)
      setOtp("")

    } catch (error) {
      console.log(error)
      alert("order delivery error")
    }
  }




  return (
    <div className='w-full px-3 sm:px-6 lg:px-10 py-6 text-white'>
      <div className="flex justify-between">
        <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center sm:text-left'>
          Vendor Orders</h1>
        <p className="text-gray-300">{orders.length} Orders</p>
      </div>

      {/* desktop table */}
      <div className='hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead className='bg-white/10'>
            <tr>
              <th className='p-4'>Order</th>
              <th className='p-4'>Buyer</th>
              <th className='p-4'>Products</th>
              <th className='p-4'>Payment</th>
              <th className='p-4'>Status</th>
              <th className='p-4 text-center'>Update</th>

            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  No Orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={index} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-4">#{String(order._id!).slice(-8)}</td>
                  <td className="p-4 text-nowrap">{order.address.name}
                    <div className="text.xs text-gray-400">{order.address.phone}</div></td>
                  <td className="p-4">
                    {order.products.map((p, i) => (
                      <div key={i} className="text-gray-300">
                        {p.product.title.slice(0, 40) + "..."} ×{p.quantity}
                      </div>
                    ))}
                  </td>

                  <td className="p-4">{order.paymentMethod.toUpperCase()}
                    <div className="text.xs text-gray-400">{order.isPaid ? "paid" : "Pending"}</div>
                  </td>

                  <td className="p-4">{order.orderStatus.toUpperCase()}</td>
                  <td className="p-4">

                    {/* after delivered or camcel time show only this condition */}

                    {order.orderStatus === "cancelled" && (
                      <span className="text-red-400 font-semibold capitalize">
                        Cancelled
                      </span>
                    )}

                    {order.orderStatus === "delivered" && (
                      <span className="text-green-400 font-semibold capitalize">
                        Delivered
                      </span>
                    )}

                    {order.orderStatus === "returned" && (
                      <span className="text-orange-400 font-semibold capitalize">
                        Returned
                      </span>
                    )}

                    {order.orderStatus !== "cancelled" &&
                      order.orderStatus !== "delivered" &&
                      order.orderStatus !== "returned" &&
                      <select
                        onChange={async (e) => {
                          if (e.target.value === "delivered") {
                            updateStatus(String(order._id), "delivered")
                            setOtpModel(order)
                          } else {

                            updateStatus(String(order._id), e.target.value)
                          }
                        }}
                        value={order.orderStatus} className="bg-white/10 capitalize border border-white/20 rounded px-2 py-1">
                        {statusOptions.map((s, i) => (
                          <option key={i} className="bg-black capitalize">{s}</option>
                        ))}
                      </select>}</td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* mobile ke liye  */}
      <div className="md:hidden flex flex-col gap-6">
        {orders.length === 0 ? (
          <div className="text-center mt-10 text-gray-400">
            No Orders found.
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="bg-white/10 border border-white/20 rounded-xl p-4 space-y-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm">#{String(order._id!).slice(-8)}</span>
                <span className="text-green-400 font-bold">₹{order.totalAmount}</span>
              </div>
              <p className="text-sm">
                <b>Buyer: {" "}</b> {order.address?.name}
              </p>
              <p className="text-xs text-gray-400">{order.address?.phone}</p>

              <div className="mt-4 text-sm">
                {order.products.map((p, i) => (
                  <p key={i} className="text-gray-300">
                    {p.product.title} ×{p.quantity}
                  </p>
                ))}
              </div>

              <div className="mt-3 text-sm">
                <b>Status:</b>{" "}
                <span className="capitalize">{order.orderStatus}</span>
              </div>

              {/* after delivered or camcel time show only this condition */}


              {order.orderStatus === "cancelled" && (
                <span className="text-red-400 font-semibold capitalize">
                  Cancelled
                </span>
              )}

              {order.orderStatus === "delivered" && (
                <span className="text-green-400 font-semibold capitalize">
                  Delivered
                </span>
              )}

              {order.orderStatus === "returned" && (
                <span className="text-orange-400 font-semibold capitalize">
                  Returned
                </span>
              )}

              {order.orderStatus !== "cancelled" &&
                order.orderStatus !== "delivered" &&
                order.orderStatus !== "returned" &&
                <select
                  onChange={async (e) => {
                    if (e.target.value === "delivered") {
                      updateStatus(String(order._id), "delivered")
                      setOtpModel(order)
                    } else {

                      updateStatus(String(order._id), e.target.value)
                    }
                  }}
                  value={order.orderStatus} className="bg-white/10 capitalize border border-white/20 rounded px-2 py-1">
                  {statusOptions.map((s, i) => (
                    <option key={i} className="bg-black capitalize">{s}</option>
                  ))}
                </select>}

            </div>
          ))

        )}
      </div>


      {otpModel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#061526] p-6 rounded-xl w-full max-w-md">
            <h2 className="text-lg mb-3 font-semibold"></h2>
            <input type="text" className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded mb-4" placeholder="Enter OTP"
              value={otp} onChange={(e) => setOtp(e.target.value)} />

            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 py-2 rounded flex items-center justify-center gap-2">Verify & Deliver</button>
          </div>
        </div>
      )}




    </div>
  )
}

export default VendorOrders
