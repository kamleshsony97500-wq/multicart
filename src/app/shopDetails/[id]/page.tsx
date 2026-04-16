"use client"

import ProductCard from "@/component/ProductCard";
import UseGetAllProductsData from "@/hooks/UseGetAllProductsData";
import UseGetAllVendors from "@/hooks/UseGetAllVendors";
import { RootState } from "@/redux/store";
import { motion } from "motion/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

const ShopDetails = () => {
    UseGetAllVendors();
    UseGetAllProductsData();

    const params = useParams()
    const vendorId = params.id as string;

    const { allVendorsData } = useSelector((state: RootState) => state.vendor)
    const { allProductsData } = useSelector((state: RootState) => state.vendor)


    const vendor = allVendorsData.find((v: any) => String(v._id) === vendorId)
    // console.log(vendor)

    const vendorProducts = Array.isArray(allProductsData) ?
        allProductsData.filter((p: any) => p.vendor._id === vendor?._id) : []
    // console.log(vendorProducts)

    if (!vendor) {
        return (
            <div className='flex min-h-screen text-3xl items-center justify-center bg-black text-white'>
                Vendor Not Found
            </div>
        )
    }



    return (
        <div className='min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white p-6'>
            <div className="flex items-center gap-3 p-4">

                {/* Home Button */}
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm backdrop-blur-md transition"
                >
                    ← Back
                </button>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-5xl mb-12 mx-auto bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 grid md:grid-cols-2 gap-6 shadow-xl">
                <div className="w-full relative h-60 overflow-hidden rounded-xl bg-black flex items-center justify-center">
                    {vendor.image ? <Image src={vendor.image} alt="img" fill className="object-cover" /> :
                        <span className="text-white">No image found</span>}
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl font-bold mb-3">{vendor.shopName}</h1>
                    <p className="text-gray-300 mb-2">{vendor.shopAddress}</p>
                    <p className="text-gray-400 text-xs mb-1">GSTIN: {vendor.gstNumber}</p>
                    <span className='text-[10px] w-fit mt-2 px-2 py-1 rounded-full font-medium bg-green-100 text-green-700'>{vendor.verificationStatus}</span>
                </div>

            </motion.div >

            {/* card map of vendor  */}
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">
                    Product By: {vendor.shopName}
                </h2>
                {vendorProducts?.length === 0 ? (
                    <p className="text-gray-300">
                        No products added by this Shop yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {vendorProducts?.map((p: any, i: number) => (
                            <ProductCard key={i} product={p} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ShopDetails
