"use client";

import UseGetAllVendors from '@/hooks/UseGetAllVendors';
import { IUser } from '@/model/user.model';
import { RootState } from '@/redux/store'
import { motion } from 'motion/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux'

const ShopPage = () => {
    UseGetAllVendors();
    const router = useRouter()
    const pathname = usePathname();


    const { allVendorsData } = useSelector((state: RootState) => state.vendor);

    const allVerifiedVendor = Array.isArray(allVendorsData) ?
        allVendorsData.filter((v: any) => v.verificationStatus === "approved") : []



    if (!allVerifiedVendor || allVerifiedVendor.length === 0) {
        return (
            <div className='flex min-h-[30vh] items-center justify-center bg-black text-white'>
                No Shop Found
            </div>
        )
    }


    return (
        <div className='min-h-screen w-full bg-linear-to-br from-gray-900 via-black to-gray-900 text-white px-4 py-6'>
            <div className='max-w-7xl mb-13 mx-auto text-center'>
                <div className="flex items-center gap-3">
                    {pathname === "/shop" && (
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm backdrop-blur-md transition"
                        >
                            ← Back
                        </button>
                    )}
                </div>

                <h1 className='text-2xl sm:text-3xl font-bold text-white'>
                    Explore Trusted Shops & Verified Sellers
                </h1>
                <p className='text-gray-300 text-sm'>
                    Discover verified vendors, authentic stores & their exclusive products
                </p>
            </div>

            <div className='max-w-7xl mx-auto'>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
                    {allVerifiedVendor.map((v: IUser, i: number) => (
                        <motion.div
                            onClick={() => router.push(`/shopDetails/${v._id}`)}
                            key={i}
                            initial={{ opacity: 0, y: 60, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            viewport={{ once: true, amount: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            className='bg-white text-black rounded-2xl p-4 cursor-pointer border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300'
                        >
                            <div className='w-full relative aspect-4/3 mb-3 overflow-hidden rounded-xl bg-gray-200 flex items-center justify-center'>
                                {v.image ? <Image src={v.image} alt='img' fill className='object-cover' />
                                    : <div>
                                        No image found
                                    </div>}

                            </div>
                            <h2 className='text-lg font-semibold text-center'>{v.shopName}</h2>
                            <p className='text-xs text-gray-500 text-center mt-1 line-clamp-2'>
                                {v.shopAddress}
                            </p>
                            <div className='flex justify-center mt-2'>
                                <span className='text-[10px] px-2 py-1 rounded-full font-medium bg-green-100 text-green-700'>
                                    {v.verificationStatus}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ShopPage
