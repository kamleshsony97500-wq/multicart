"use client"

import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { FaBox, FaCheckCircle } from 'react-icons/fa'


const OrderSuccess = () => {
    const router = useRouter()
    return (
        <div className='min-h-screen bg-linear-to-br from-green-900 via-black to-gray-900 flex items-center justify-center px-4'>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='bg-white/10 backdrop-blur-xl border border-white shadow-2xl rounded-2xl p-10 max-w-md text-center w-full'>
                <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className='flex justify-center'
                >
                    <FaCheckCircle size={120} className='text-green-400' />

                </motion.div>
                <h1 className='text-3xl font-bold mt-6 text-white'>
                    Order Placed Successfully
                </h1>
                <div className='flex flex-col items-center gap-2 mt-4 text-gray-300'>
                    <FaBox size={32} className='text-blue-300' />
                    <p>Your order has been received and is now being processed.</p>
                </div>

                <motion.button
                    onClick={() => router.push("/orders")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className='mt-8 w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold cursor-pointer'>
                    Go to Order Page
                </motion.button>
            </motion.div>
        </div>
    )
}

export default OrderSuccess
