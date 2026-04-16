"use client";


import UseGetAllVendors from "@/hooks/UseGetAllVendors";
import { IUser } from "@/model/user.model";
import { AppDispatch, RootState } from "@/redux/store";
import { setAllVendorsData } from "@/redux/vendorSlice";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const VendorDetails = () => {
  UseGetAllVendors();

  const dispatch = useDispatch<AppDispatch>()

  const allVendorsData: IUser[] = useSelector((state: RootState) => state.vendor.allVendorsData);

  const approvedVendors = Array.isArray(allVendorsData) ?
    allVendorsData.filter((v) => v.verificationStatus === "approved") : []
  // console.log(pendingVendors)

  const [selectedVendor, setSelectedVendor] = useState<IUser | null>(null)



  return (
    <div className='w-full px-3 sm:px-6 lg:px-10 py-6 text-white'>
      <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center sm:text-left'>
        Approved Vendor Details</h1>

      {/* desktop table */}
      <div className='hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead className='bg-white/10'>
            <tr>
              <th className='p-4'>Vendor Name</th>
              <th className='p-4'>Shop Name</th>
              <th className='p-4'>Shop Address</th>
              <th className='p-4'>Phone</th>
              <th className='p-4'>GSTIN</th>
              <th className='p-4 text-center'>Action</th>

            </tr>
          </thead>
          <tbody>
            {approvedVendors.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No Vendor Approval requests found.
                </td>
              </tr>
            ) : (
              approvedVendors.map((vendor, index) => (
                <tr key={index} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-4 text-xs">{vendor?.name}</td>
                  <td className="p-4 text-xs">{vendor?.shopName || "-"}</td>
                  <td className="p-4 text-xs">{vendor?.shopAddress || "-"}</td>
                  <td className="p-4 text-xs">{vendor?.phone || "-"}</td>
                  <td className="p-4 text-xs">{vendor.gstNumber}</td>
                  <td className="p-4 text-center text-xs">
                    <button className="px-4 py-1 cursor-pointer rounded-md bg-blue-600 hover:bg-blue-700 text-xs text-nowrap"
                      onClick={() => setSelectedVendor(vendor)}>
                      Vendor Products
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>



      {/* mobile ke liye  */}
      <div className="md:hidden flex flex-col gap-4">
        {approvedVendors.length === 0 ? (
          <div className="text-center mt-10 text-gray-400">
            No Vendor Approval requests found.
          </div>
        ) : (
          approvedVendors.map((vendor, index) => (
            <div key={index} className="bg-white/10 border border-white/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{vendor?.name}</h3>
                <span className="px-3 py-1 rounded-full text-xl bg-yellow-500/30">
                  {vendor?.gstNumber}</span>
              </div>
              <p className="text-sm text-gray-300">
                <b>Shop:</b> {vendor.shopName}
              </p>

              <p className="text-sm text-gray-300">
                <b>Shop Address:</b> {vendor.shopAddress}
              </p>


              <p className="text-sm text-gray-300">
                <b>Phone:</b> {vendor.phone}
              </p>

              <button className="mt-3 w-full py-2 cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-700 text-sm"
                onClick={() => setSelectedVendor(vendor)}>
                Vendor Products
              </button>
            </div>
          ))

        )}
      </div>

      <AnimatePresence>
        {selectedVendor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              exit={{ opacity: 0.9 }}
              className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-white/10">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">
                Products of {selectedVendor.shopName}
              </h3>

              {selectedVendor.vendorProducts?.length ? (
                <div className="space-y-4 max-h-90 overflow-y-auto pr-2">
                  {selectedVendor.vendorProducts?.map((p: any, i: number) => (
                    <div key={i} className="bg-white/10 mb-4 p-4 border border-white/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Image src={p.image1} width={70} height={70} alt="img" className="object-cover rounded" />


                        <div>
                          <p className="font-semibold">{p.title}</p>
                          <p className="text-gray-300 text-sm">₹{p.price}</p>
                        </div>
                      </div>

                      <div className="mt-3 text-sm space-y-1">
                        <p><b>Category: {" "}</b>{p.category}</p>
                        <p><b>Description: {" "}</b>{p.description}</p>

                        <p>
                          <b>Verification:</b>{" "}

                          <span className={`px-2 py-1 rounded text-xs ${p.verificationStatus === "approved"
                            ? "bg-green-600/30 text-green-400"
                            : p.verificationStatus === "pending"
                              ? "bg-yellow-600/30 text-yellow-400"
                              : "bg-red-600/30 text-red-400"
                            }`}>
                            {p.verificationStatus}
                          </span>
                        </p>

                        <p>
                          <b>Active:</b>{" "}

                          <span className={`${p.isActive
                            ? "text-green-400"
                            : "text-red-400"
                            }`}>
                            {p.isActive ? "Yes" : "No"}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 mt-6">No Product Found Yet</p>
              )}



              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 w-full mt-4 bg-gray-700 hover:bg-gray-800 py-2 rounded-lg text-sm"
                onClick={() => setSelectedVendor(null)}>
                Close</motion.button>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>



    </div>
  )
}

export default VendorDetails
