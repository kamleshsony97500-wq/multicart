"use client";


import UseGetAllVendors from "@/hooks/UseGetAllVendors";
import { IUser } from "@/model/user.model";
import { AppDispatch, RootState } from "@/redux/store";
import { setAllVendorsData } from "@/redux/vendorSlice";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const VendorApproval = () => {
  UseGetAllVendors();

  const dispatch = useDispatch<AppDispatch>()

  const  allVendorsData:IUser[]  = useSelector((state: RootState) => state.vendor.allVendorsData);
 
  const pendingVendors = Array.isArray(allVendorsData)?
  allVendorsData.filter((v)=>v.verificationStatus === "pending") : []
  // console.log(pendingVendors)

  const [selectedVendor, setSelectedVendor] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [rejectMode, setRejectMode] = useState(false)
   const [rejectedReason, setRejectedReason] = useState("")

   const openRejectReasonArea = async () => {
     setRejectMode(true)
     setRejectedReason("")
   }

  // for approved ke liye //
  const handleApproved = async () =>{
    if(!selectedVendor) return;
    setLoading(true)

     try {
        await axios.post("/api/admin/update-vendor-status", {
        vendorId: selectedVendor._id,
        status:"approved"
      })

      const updated = allVendorsData.filter((v)=>v._id !== selectedVendor._id)
      dispatch(setAllVendorsData(updated))
      setSelectedVendor(null)
      setLoading(false)
      alert("Vendor Approved")
      
     } catch (error) {
      console.log(error)
       setLoading(false)
       alert("Approval failed")
     }
  }

   // for rejected  ke liye //
  const handleRejected = async () =>{
    if(!selectedVendor) return;
    setLoading(true)

     try {
        await axios.post("/api/admin/update-vendor-status", {
        vendorId: selectedVendor._id,
        status:"rejected",
        rejectedReason
      })

      const updated = allVendorsData.filter((v)=>v._id !== selectedVendor._id)
      dispatch(setAllVendorsData(updated))
      setSelectedVendor(null)
      setLoading(false)
      alert("Vendor Rejected")
      
     } catch (error) {
      console.log(error)
       setLoading(false)
       alert("Rejection failed")
     }
  }


  return (
    <div className='w-full px-3 sm:px-6 lg:px-10 py-6 text-white'>
     <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center sm:text-left'>
      Vendor Approval Requests</h1>

      {/* desktop table */}
      <div className='hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10'>
      <table className='w-full text-left'>
        <thead className='bg-white/10'>
          <tr>
            <th className='p-4'>Vendor Name</th>
            <th className='p-4'>Shop Name</th>
             <th className='p-4'>Phone</th>
              <th className='p-4'>Status</th>
               <th className='p-4 text-center'>Action</th>

          </tr>
        </thead>
        <tbody>
          {pendingVendors.length === 0 ? (
            <tr>
             <td colSpan={5} className="p-6 text-center text-gray-400">
              No Vendor Approval requests found.
            </td>
            </tr>
          ) : (
            pendingVendors.map((vendor, index)=>(
              <tr key={index} className="border-t border-white/10 hover:bg-white/5">
               <td className="p-4">{vendor?.name}</td>
                <td className="p-4">{vendor?.shopName || "-"}</td>
                 <td className="p-4">{vendor?.phone || "-"}</td>
                 <td className="p-4"><span className="px-3 py-1 rounded-full text-xl bg-yellow-500/30 text-yellow-300">
                 {vendor?.verificationStatus}</span></td>
                 <td className="p-4 text-center">
                  <button className="px-4 py-1 cursor-pointer rounded-md bg-blue-600 hover:bg-blue-700 text-sm"
                  onClick={()=>setSelectedVendor(vendor)}>
                    Check Details
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
        {pendingVendors.length === 0 ? (
          <div className="text-center mt-10 text-gray-400">
            No Vendor Approval requests found.
          </div>
        ) : (
          pendingVendors.map((vendor, index)=>(
            <div key={index} className="bg-white/10 border border-white/20 rounded-xl p-4 space-y-2">
             <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{vendor?.name}</h3>
              <span className="px-3 py-1 rounded-full text-xl bg-yellow-500/30 text-yellow-300">
              {vendor?.verificationStatus}</span>
             </div>
             <p className="text-sm text-gray-300">
              <b>Shop:</b> {vendor.shopName}
             </p>

             <p className="text-sm text-gray-300">
              <b>Phone:</b> {vendor.phone}
             </p>

             <button className="mt-3 w-full py-2 cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-700 text-sm"
             onClick={()=>setSelectedVendor(vendor)}>
                Check Details
              </button>
          </div>
          ))

        )}
      </div>

      <AnimatePresence>
        {selectedVendor && (
          <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.3}}
          exit={{opacity: 0}}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <motion.div  
          initial={{scale: 0.9}}
          animate={{scale: 1}}
          transition={{duration: 0.6}}
          exit={{opacity: 0.9}}
         className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-white/10">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">Selected Vendor Details</h3>

          <div className="text-sm space-y-2">
            <p><b>Name:</b>{""} {selectedVendor.name}</p>
            <p><b>Email:</b>{""} {selectedVendor.email}</p>
            <p><b>Phone:</b>{""} {selectedVendor.phone}</p>
             <p><b>ShopName:</b>{""} {selectedVendor.shopName}</p>
             <p><b>ShopAddress:</b>{""} {selectedVendor.shopAddress}</p>
              <p><b>GSTIN:</b>{""} {selectedVendor.gstNumber}</p>
          </div>

          <div className="flex flex-col sm:flex-row mt-6 gap-3">
            <button className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm"
            onClick={handleApproved} disabled={loading}>
              {loading? <ClipLoader size={20} color="white"/> : "Approve"}
              </button>
            <button className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm"
            onClick={openRejectReasonArea}>
              Reject</button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-800 py-2 rounded-lg text-sm"
            onClick={()=>setSelectedVendor(null)}>
              Cancel</button>
          </div>
         </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* for reject ke liye  */}
       <AnimatePresence>
        {rejectMode && (
          <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.3}}
          exit={{opacity: 0}}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <motion.div  
          initial={{scale: 0.9}}
          animate={{scale: 1}}
          transition={{duration: 0.6}}
          exit={{opacity: 0.9}}
         className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-white/10">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">
            Enter Rejected Reason
          </h3>

          <textarea 
          placeholder="Enter rejection reason..."
          rows={3}
          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-sm"
          value={rejectedReason}
          onChange={(e)=>setRejectedReason(e.target.value)}
          />

          
            <div className="flex flex-col sm:flex-row mt-6 gap-3">
          <button type="button" className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm"
            onClick={() => {
            handleRejected();   // ✅ CALL the function
            setRejectMode(false);
            }} disabled={loading}>
            {loading ? <ClipLoader size={20} color="white"/> : "Confirm Reject"}
            </button>
            
          <button className="flex-1 bg-gray-700 hover:bg-gray-800 py-2 rounded-lg text-sm"
            onClick={()=>setRejectMode(false)}>Cancel</button>
              
      </div>
         </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default VendorApproval
