"use client"

import axios from "axios";
import { AnimatePresence, motion, scale } from "motion/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineShop, AiOutlineTool, AiOutlineUser } from "react-icons/ai"
import { ClipLoader } from "react-spinners";

const EditRoleandPhone = () => {
    const [role, setRole] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const router = useRouter()

    const roles = [
        { label: "Admin", value: "admin", icon: <AiOutlineTool size={40}/>},
        { label: "Vendor", value: "vendor", icon: <AiOutlineShop size={40}/>},
        { label: "User", value: "user", icon: <AiOutlineUser size={40}/>}
    ];

    const [adminExist, setAdminExist] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const checkAdmin = async () => {
            try {
                const res = await axios.get("/api/admin/check-admin");
                setAdminExist(res.data.exists);
               
            } catch (error) {
                console.log(error)
                setAdminExist(false);
            }

        };
        checkAdmin();
    }, [])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!role || !phone){
            alert("Please select a role and enter your phone number.");
            setLoading(false);
            return;
        }
        setLoading(true);

        try {
            const result = await axios.post("/api/user/edit-role-phone", {
                role, phone
            });
            console.log(result.data)
            setLoading(false);
            router.push("/")

            
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }

  return (
     <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 text-white p-6">
    <AnimatePresence>
     <motion.div
       initial={{ opacity: 0, y: 40 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -40 }}
       transition={{duration:0.5}}
       className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-10 border border-white/10">
        <h1 className="text-4xl text-center mb-4 font-semibold">Choose Your Role</h1>
        <p className="text-center text-sm mb-8 text-gray-300">
        Select your role and enter your mobile number to continue.</p>
     
       <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <input 
        type="text"
        maxLength={10}
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="bg-white/10 placeholder:text-gray-400 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-4"
        placeholder="Enter your mobile number"
         />


         <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {
                roles.map((rol)=>{
                    const isAdminBlocked = rol.value == "admin" && adminExist;
                    return (
                        <motion.div key={rol.value}
                        whileHover={!isAdminBlocked ? {scale: 1.07} : {}}
                        onClick={()=>{
                            if(isAdminBlocked){
                                alert("⚠️ Admin already exists. You cannot select admin role.")
                                return;
                            }
                            setRole(rol.value);
                        }}
                        className={`p-6 cursor-pointer text-center rounded-2xl border transition text-lg font-medium
                        ${
                            role === rol.value
                            ? "bg-blue-500/40 border-blue-500 text-white"
                            : "border-white/20 bg-white/10 hover:bg-white/20"
                        }
                        ${isAdminBlocked && "opacity-40 cursor-not-allowed"}

                        `}
                        >
                         <div className="flex justify-center mb-6">
                            {rol.icon}
                         </div>
                         <p>{rol.value}</p>

                         {isAdminBlocked && <p className="text-xs text-red-400 mt-2">
                            Admin role is already taken.</p>}
                        </motion.div>
                    )
                })
            }
         </div>

         <motion.button
                 disabled={loading}
                 whileHover={{ scale: 1.03 }}
                 whileTap={{ scale: 0.95 }}
                 type="submit"
                 className="mt-4 px-8 py-3 flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 rounded-xl font-medium">
               {loading ? <ClipLoader size={20} color="white"/> : "Submit Now"}
        </motion.button>
       </form>

     </motion.div>
    </AnimatePresence>
    </div>
  )
}

export default EditRoleandPhone
