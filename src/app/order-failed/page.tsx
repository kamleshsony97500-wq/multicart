"use client"

import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { FaTimesCircle } from 'react-icons/fa'



const OrderFailed = () => {
    const router = useRouter()
    return (
        <div className='min-h-screen bg-linear-to-br from-red-900 via-black to-gray-900 flex items-center justify-center px-4'>
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
                    <FaTimesCircle size={120} className='text-red-400' />

                </motion.div>
                <h1 className='text-3xl font-bold mt-6 text-white'>
                    Order Failed
                </h1>
                <p className='text-gray-300 mt-3'>
                    Something went wrong.
                </p>
                <p className='text-gray-400 mt-1'>
                    Please try again or choose  another payment method.
                </p>


                <motion.button
                    onClick={() => router.push("/orders")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className='mt-8 w-full py-3 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold cursor-pointer'>
                    Go to Order Page
                </motion.button>
            </motion.div>
        </div>
    )
}

export default OrderFailed
