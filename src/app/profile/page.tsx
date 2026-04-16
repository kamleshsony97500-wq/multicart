"use client";


import UseGetCurrentUser from "@/hooks/UseGetCurrentUser";
import { AppDispatch, RootState } from "@/redux/store";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userImage from "@/assets/user.png"
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { setUserData } from "@/redux/userSlice";


const Profile = () => {
    UseGetCurrentUser();
    const router = useRouter()

    const user = useSelector((state:RootState)=>state?.user?.userData);

    const [showEditProfile, setShowEditProfile] = useState(false)
    const [showEditShop, setShowEditShop] = useState(false)

    const [previewImage, setPreviewImage] = useState(user?.image || userImage)
     const [profileImage, setProfileImage] = useState<File | null>(null)

     const [name, setName] = useState(user?.name || "")
     const [phone, setPhone] = useState(user?.phone || "")

     const [shopName, setShopName] = useState(user?.shopName || "")
     const [shopAddress, setShopAddress] = useState(user?.shopAddress || "")
     const [gstNumber, setGstNumber] = useState(user?.gstNumber || "")
     const [loading, setLoading] = useState(false)
     const dispatch = useDispatch<AppDispatch>()

    const handlePreviewImage = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0]
        if(!file) return;
        setProfileImage(file)
        setPreviewImage(URL.createObjectURL(file))
    }


    const handleVerifyAgain = async () => {
    if(!shopName || !shopAddress || !gstNumber){
      alert("Fill all fields")
      return;
    }
    setLoading(true)

    try {
      const result = await axios.post("/api/vendor/verifyagain", {
        shopName,
        shopAddress,
        gstNumber
      })
    //   console.log(result.data)
      setLoading(false)
      alert("Shop Details Updated ✅")
      router.push("/")

    } catch (error) {
      console.log(error)
      setLoading(false)
      alert("Failed to update shop Details ❌")
    }

  }


  const handleUpdateProfile = async () =>{
      const formData = new FormData()
      formData.append("name", name)
      formData.append("phone", phone)
      if(profileImage){
        formData.append("image", profileImage)
      }
      setLoading(true)

       try {
        const result = await axios.post("/api/user/update-profile", formData)
        console.log(result)
        dispatch(setUserData(result?.data))
         router.push("/")
        setProfileImage(null)
        setLoading(false)
        alert("Profile Updated Successfully ✅")
        
       } catch (error) {
         console.log(error)
          setLoading(false)
         alert("Profile Updated error ❌")
       }
  }


  return (
   <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white px-4 pt-24 pb-10">
        <motion.div 
        initial={{scale: 0.95, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.4}}
        className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-6 sm:p-10 rounded-2xl border border-white/20 shadow-xl">
         <div className="flex flex-col items-center text-center">
          <motion.div
          whileHover={{scale: 1.05}}
           className="w-24 h-24 sm:h-28 cursor-pointer sm:w-28 rounded-full overflow-hidden border-2 border-white/20 hover:bg-blue-400">
             <Image src={previewImage}
              alt="profile"
              height={120}
              width={120}
              className="w-full h-full object-cover"/>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl font-bold mt-4 capitalize">{user?.name}</h2>
          <p className="text-gray-300 text-sm sm:text-base">{user?.email}</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Role:{" "} 
            <span className="text-blue-400 uppercase">{user?.role}</span></p>

         </div>


         <div className="mt-5 space-y-3 text-sm sm:text-base">
            <p><b>Phone: </b>{user?.phone || "-"}</p>

            {user?.role == "vendor" && (
                <>
                <p><b>ShopName: </b>{user?.shopName || "-"}</p>
                 <p><b>ShopAddress: </b>{user?.shopAddress || "-"}</p>
                  <p><b>GSTIN: </b>{user?.gstNumber || "-"}</p>
                </>
            )}
         </div>

         <div className="grid grid-cols-1 gap-4 mt-8">
            {user?.role == "user" && (
                <motion.button
                whileHover={{scale: 1.02}}
                onClick={()=>router.push("/orders")}
                 className="bg-gray-600 cursor-pointer hover:bg-gray-700 py-3 rounded-lg font-semibold">
                    My Orders
                </motion.button>
            )}


            <motion.button
                whileHover={{scale: 1.02}}
                onClick={()=>{
                setShowEditProfile(!showEditProfile);
                setShowEditShop(false)
                }}               
                 className="bg-blue-600 cursor-pointer hover:bg-blue-700 py-3 rounded-lg font-semibold">
                    Edit Profile
            </motion.button>


            {user?.role == "vendor" && (
                <motion.button
                 onClick={()=>{
                setShowEditShop(!showEditShop);
                setShowEditProfile(false)
                }}    
                whileHover={{scale: 1.02}}
                 className="bg-gray-600 cursor-pointer hover:bg-gray-700 py-3 rounded-lg font-semibold">
                    Edit Shop Details
                </motion.button>
            )}

         </div>
        

        <AnimatePresence>
            {showEditProfile && (
                <motion.div
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 30}}
                 className="mt-10 p-5 sm:p-6 bg-white/5 rounded-xl border border-white/20">
                 <h3 className="text-xl font-bold mb-5">
                    Edit Profile
                 </h3>

                 <div className="flex items-center mb-6 flex-col">
                    <motion.div 
                    whileHover={{scale: 1.05}}
                    className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/30 hover:bg-blue-400 mb-3">
                     <Image src={previewImage} 
                     alt="select Image"
                     width={120}
                     height={120}
                     className="w-full h-full object-cover"
                     />
                    </motion.div>

                    <label className="cursor-pointer bg-blue-600 px-4 py-2 rounded-lg text-sm">
                      Select Image
                    <input type="file" hidden accept="image/*" onChange={handlePreviewImage} />
                    </label>
                 </div>

                 <div className="space-y-4">
                    <input type="text" className="w-full p-3 bg-white/10 border border-white/20 rounded"
                    placeholder="Full Name"
                    onChange={(e)=>setName(e.target.value)} value={name}/>

                    <input type="text" className="w-full p-3 bg-white/10 border border-white/20 rounded"
                    placeholder="Phone"
                    onChange={(e)=>setPhone(e.target.value)} value={phone}/>

                <motion.button
                onClick={handleUpdateProfile}
                 whileHover={{scale: 1.02}}
                 className="bg-blue-600 w-full cursor-pointer hover:bg-blue-700 py-3 rounded-lg font-semibold" disabled={loading}>
                    {loading ? <ClipLoader size={20} color="white"/> : "Update Profile"}
                </motion.button>
                 </div>


                </motion.div>
            )}
        </AnimatePresence>

        {/* for shopdetails ke liye */}
        <AnimatePresence>
            {showEditShop && (
                <motion.div
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 30}}
                 className="mt-10 p-5 sm:p-6 bg-white/5 rounded-xl border border-white/20">
                 <h3 className="text-xl font-bold mb-5">
                    Edit Shop Details
                 </h3>

                 <div className="space-y-4">
                    <input type="text" className="w-full p-3 bg-white/10 border border-white/20 rounded"
                    placeholder="Shop Name"
                    onChange={(e)=>setShopName(e.target.value)} value={shopName}/>

                    <div className="space-y-4">
                    <input type="text" className="w-full p-3 bg-white/10 border border-white/20 rounded"
                    placeholder="Shop Address"
                    onChange={(e)=>setShopAddress(e.target.value)} value={shopAddress}/>

                    <input type="text" className="w-full p-3 bg-white/10 border border-white/20 rounded"
                    placeholder="GSTIN"
                    onChange={(e)=>setGstNumber(e.target.value)} value={gstNumber}/>
                 </div>
                <motion.button
                onClick={handleVerifyAgain}
                 whileHover={{scale: 1.02}}
                 className="bg-blue-600 w-full cursor-pointer hover:bg-blue-700 py-3 rounded-lg font-semibold" disabled={loading}>
                   {loading ? <ClipLoader size={20} color="white"/> : "Update Shop Details"}
                </motion.button>
                 </div>
                </motion.div>
            )}
            
        </AnimatePresence>
    </motion.div>
    </div>
  )
}

export default Profile
