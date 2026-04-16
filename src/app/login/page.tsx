"use client"

import axios from 'axios';
import { AnimatePresence, motion } from 'motion/react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { ClipLoader } from 'react-spinners';


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const session = useSession();
  console.log(session.data?.user)

  const handleSignIn = async (e: React.FormEvent) => {
          e.preventDefault();
          setLoading(true);
  
          try {
              const result = await signIn("credentials", {
               email,
               password,
               redirect: false
              });
              console.log(result)
              setLoading(false);
              alert("Login successful");
  
              setEmail("");
              setPassword("");
              router.push("/");
              
          } catch (error) {
              console.log(error);
              setLoading(false);
              alert(error);
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
      className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">

      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-100">
      Welcome Back to {""}
      <span className="text-blue-400">Multicart</span></h1>

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
           
            <input type="email" 
             required
             placeholder="Email"
             value={email}
             onChange={(e)=>setEmail(e.target.value)}
             className="bg-white/20 placeholder:text-gray-400 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3"
             />

           
             <div className="relative w-full">

              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/20 placeholder:text-gray-400 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3 pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
              </button>

            </div>


      <motion.button
        disabled={loading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="mt-4 px-8 py-3 flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 rounded-xl font-medium">
      {loading ? <ClipLoader size={20} color="white"/> : "Login"}
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
            Login with Google</span>
      </motion.button>

      <p className="text-center text-sm mt-0 text-gray-400">
        Don't have an account? <Link href="/register" className="text-blue-500 hover:underline">Sign Up</Link></p>
           
        </form>

      </motion.div>
     </AnimatePresence>
    </div>
  )
}

export default SignIn
