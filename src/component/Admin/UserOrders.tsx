"use client";


import UseGetAllOrdersData from "@/hooks/UseGetAllOrdersData";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";


const UserOrders = () => {
  UseGetAllOrdersData();


  const { allOrdersData } = useSelector((state: RootState) => state.user);


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


  return (
    <div className='w-full px-3 sm:px-6 lg:px-10 py-6 text-white'>
      <div className="flex justify-between">
        <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center sm:text-left'>
          Vendor Orders</h1>
        <p className="text-gray-300">{allOrdersData.length} Orders</p>
      </div>

      {/* desktop table */}
      <div className='hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead className='bg-white/10'>
            <tr>
              <th className='p-4'>Order</th>
              <th className='p-4'>Buyer</th>
              <th className='p-4'>Vendor</th>
              <th className='p-4'>Product</th>
              <th className='p-4'>Amount</th>
              <th className='p-4'>Payment</th>
              <th className='p-4'>Status</th>
              <th className='p-4 text-center'>Date</th>

            </tr>
          </thead>
          <tbody>
            {allOrdersData.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  No Orders found.
                </td>
              </tr>
            ) : (
              allOrdersData.map((order, index) => (
                <tr key={index} className="border-t text-sm border-white/10 hover:bg-white/5">
                  <td className="p-4 text-sm">#{String(order._id!).slice(-8)}</td>
                  <td className="p-4 text-sm">{order.address.name}
                    <div className="text-xs text-gray-400">{order.address.phone}</div></td>

                  <td className="p-4 text-sm">{order.productVendor.shopName}</td>

                  <td className="p-4 text-sm">
                    {order.products.map((p, i) => (
                      <div key={i} className="text-gray-300">
                        {p.product.title} ×{p.quantity}
                      </div>
                    ))}
                  </td>

                  <td className="p-4 text-sm">₹{order.totalAmount}</td>

                  <td className="p-4 text-sm">{order.paymentMethod.toUpperCase()}
                    <div className="text-xs text-gray-400">{order.isPaid ? "paid" : "Pending"}</div>
                  </td>


                  <td className="p-4 text-sm">
                    {/* after delivered or camcel time show only this condition */}

                    {order.orderStatus === "cancelled" && (
                      <span className="text-red-400 font-semibold capitalize">
                        Cancelled
                      </span>
                    )}

                    {/* here all status show start */}
                    {order.orderStatus === "pending" && (
                      <span className="text-yellow-400 font-semibold capitalize">
                        Pending
                      </span>
                    )}

                    {order.orderStatus === "confirmed" && (
                      <span className="text-indigo-300 font-semibold capitalize">
                        Confirmed
                      </span>
                    )}



                    {order.orderStatus === "shipped" && (
                      <span className="text-indigo-300 font-semibold capitalize">
                        Shipped
                      </span>
                    )}

                    {order.orderStatus === "delivered" && (
                      <span className="text-green-400 font-semibold capitalize">
                        Delivered
                      </span>
                    )}

                    {/* here all status show end */}

                    {order.orderStatus === "returned" && (
                      <span className="text-orange-400 font-semibold capitalize">
                        Returned
                      </span>
                    )}

                  </td>

                  <td className="p-4 text-sm">{formatDate(String(order.createdAt))}</td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>



      {/* mobile ke liye  */}
      <div className="md:hidden flex flex-col gap-6">
        {allOrdersData.length === 0 ? (
          <div className="text-center mt-10 text-gray-400">
            No Orders found.
          </div>
        ) : (
          allOrdersData.map((order, index) => (
            <div key={index} className="bg-white/10 border border-white/20 rounded-xl p-4 space-y-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm">#{String(order._id!).slice(-8)}</span>
                <span className="text-green-400 font-bold">₹{order.totalAmount}</span>
              </div>
              <p className="text-sm">
                <b>Buyer: {" "}</b> {order.address?.name}
              </p>

              <p className="text-sm">
                <b>Vendor: {" "}</b> {order.productVendor.shopName}
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

              {order.orderStatus === "pending" && (
                <span className="text-yellow-300 font-semibold capitalize">
                  Pending
                </span>
              )}

              {order.orderStatus === "confirmed" && (
                <span className="text-indigo-300 font-semibold capitalize">
                  Confirmed
                </span>
              )}



              {order.orderStatus === "shipped" && (
                <span className="text-indigo-300 font-semibold capitalize">
                  Shipped
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

              <div className="mt-2 text-sm">{formatDate(String(order.createdAt))}</div>

            </div>
          ))

        )}
      </div>

    </div>
  )
}

export default UserOrders
