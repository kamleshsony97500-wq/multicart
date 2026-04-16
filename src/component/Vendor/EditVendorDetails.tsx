"use client";

import axios from "axios";
import { AnimatePresence, motion} from "motion/react"
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineFileText, AiOutlineHome, AiOutlineShop } from "react-icons/ai";
import { ClipLoader } from "react-spinners";


const EditVendorDetails = () => {
    const [shopName, setShopName] = useState("")
    const [shopAddress, setShopAddress] = useState("")
    const [gstNumber, setGstNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()


    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault()
        if(!shopName || !shopAddress || !gstNumber){
            alert("Fill all field")
        }
        setLoading(true)

        try {
            const result = await axios.post("/api/vendor/editDetails", {
                shopName,
                shopAddress,
                gstNumber
            })
            console.log(result.data)
             setLoading(false)
            alert("Vendor Shop Details added Successfully")
            router.push("/")
            
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }


  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white">
      <AnimatePresence>
        <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{duration:0.5}}
        className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border  border-white/10">
         <h3 className="text-3xl font-semibold text-center mb-4">
            Complete Your Shop Details</h3>
        
        <p className="text-gray-300 text-center mb-6 text-sm">
         Enter your business information to activate your vendor account.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
         <div className="relative">
            <AiOutlineShop size={22} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"/>
            <input type="text"
            required
            placeholder="Shop Name"
             className="w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
             value={shopName}
             onChange={(e)=>setShopName(e.target.value)}
              />
         </div>

         <div className="relative">
            <AiOutlineHome size={22} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"/>
            <input type="text"
            required
            placeholder="Shop Address"
             className="w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
             value={shopAddress}
             onChange={(e)=>setShopAddress(e.target.value)}
              />
         </div>


         <div className="relative">
            <AiOutlineFileText size={22} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"/>
            <input type="text"
            required
            placeholder="GSTIN"
             className="w-full bg-white/10 border border-white/30 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
             value={gstNumber}
             onChange={(e)=>setGstNumber(e.target.value)}
              />
         </div>


          <motion.button
           disabled={loading}
           whileHover={{ scale: 1.03 }}
           whileTap={{ scale: 0.95 }}
           type="submit"
           className="mt-4 px-8 py-3 flex items-center justify-center gap-2 w-   bg-blue-500 hover:bg-blue-600 rounded-xl font-medium">
          {loading ? <ClipLoader size={20} color="white"/> : "Submit Now"}
          </motion.button>
        </form>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default EditVendorDetails
