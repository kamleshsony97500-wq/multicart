"use client"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { TbPlayerTrackNext } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { signIn } from "next-auth/react";


const Register = () => {
    const [step, setStep] = useState<1 | 2 >(1);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await axios.post("/api/auth/register", {
                name, email, password
            });
            console.log(result.data)
            setLoading(false);

            setName("");
            setEmail("");
            setPassword("");
            router.push("/login");
            
        } catch (error) {
            console.log(error);
            setLoading(false);
             alert(error);
        }

    }


  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      
      <AnimatePresence mode="wait">
      {/* for step 1 ui */}
      {step == 1 && 
      <motion.div
       initial={{ opacity: 0, y: 40 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -40 }}
       transition={{duration:0.5}}
       className="w-full max-w-lg text-center bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-white/20">
        <h1 className="text-4xl font-bold mb-4 text-blue-400">Welcome to Multicart</h1>
        <p className="mb-6 text-gray-300">Register with one of the following account types:</p>

        {/* grid box  */}
 <div className="grid grid-cols-3 gap-4 mb-6">
  {[
    { label: "User", icon: "👤", value: "user" },
    { label: "Vendor", icon: "🏪", value: "vendor" },
    { label: "Admin", icon: "👑", value: "admin" },
  ].map((item) => (
    <motion.div
      key={item.value}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      className="p-4 bg-white/5 hover:bg-white/20 cursor-pointer rounded-xl border border-white/30 shadow-lg flex flex-col items-center transition"
    >
      <span className="text-4xl">{item.icon}</span>
      <span className="mt-2 text-sm font-semibold">{item.label}</span>
    </motion.div>
  ))}
</div>

<motion.button
onClick={()=>setStep(2)}
 whileHover={{ scale: 1.1 }}
 whileTap={{ scale: 0.95 }}
 className="mt-4 px-8 py-3 flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 rounded-xl font-medium">
  Next <TbPlayerTrackNext size={18}/>
</motion.button>

      </motion.div>}




      {/* for step 2 ui */}
      {step == 2 && 
      <motion.div 
       initial={{ opacity: 0, y: 40 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -40 }}
       transition={{duration:0.5}}
      className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-2xl font-semibold mb-6 text-center text-blue-300">
        Create your Account</h1>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <input type="text" 
             required
             placeholder="Full Name"
             value={name}
             onChange={(e)=>setName(e.target.value)}
             className="bg-white/20 placeholder:text-gray-400 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3"
             />

            <input type="email" 
             required
             placeholder="Email"
             value={email}
             onChange={(e)=>setEmail(e.target.value)}
             className="bg-white/20 placeholder:text-gray-400 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3"
             />

           
             <input type={showPassword ? "text" : "password"}
             required
             placeholder="Password"
             value={password}
             onChange={(e)=>setPassword(e.target.value)}
             className="bg-white/20 relative placeholder:text-gray-400 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3"
             />
             <button 
             type="button"
             onClick={() => setShowPassword(!showPassword)}
             className="absolute right-12 top-61 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
             >
               {showPassword ? <FaEye size={18}/> : <FaEyeSlash size={18}/> }
             </button>


      <motion.button
        disabled={loading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="mt-4 px-8 py-3 flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 rounded-xl font-medium">
      {loading ? <ClipLoader size={20} color="white"/> : "Register Now"}
      </motion.button>


      <div className="flex items-center my-2">
        <div className="flex-1 h-px bg-gray-600"></div>
        <span className="px-3 text-sm text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-600"></div>
      </div>

      <motion.button
        onClick={()=>signIn("google", {callbackUrl:"/"})}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center gap-3 border border-white/30 hover:bg-white/20 rounded-xl font-medium px-4 py-3 bg-white/10">
        <FcGoogle className="w-5 h-5"/>
        <span className="font-medium">
            Continue with Google</span>
      </motion.button>

      <p className="text-center text-sm mt-0 text-gray-400">
        Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login</Link></p>
           
        </form>

      </motion.div>}

      </AnimatePresence>
    </div>
  )
}

export default Register
