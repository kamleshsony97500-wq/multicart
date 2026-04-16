"use client";

import ProductCard from "@/component/ProductCard";
import { RootState } from "@/redux/store";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CategoriesPage = () => {

    const categoryList = [
        { label: "all", icon: "🛍️" },
        { label: "Fashion & Lifestyle", icon: "👗" },
        { label: "Electronics & Gadgets", icon: "📱" },
        { label: "Home & Living", icon: "🏠" },
        { label: "Beauty & Personal Care", icon: "💄" },
        { label: "Toys, Kids & Baby", icon: "🧸" },
        { label: "Food & Grocery", icon: "🛒" },
        { label: "Sports & Fitness", icon: "🏋️" },
        { label: "Automotive Accessories", icon: "🚗" },
        { label: "Gifts & HandCrafts", icon: "🎁" },
        { label: "Book & Stationery", icon: "📚" }
    ];


    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedShop, setSelectedShop] = useState("all")
    const [search, setSearch] = useState("")
    const [shopSearch, setShopSearch] = useState("")
    const [displayProducts, setDisplayProducts] = useState<any[]>([])
    const [isReady, setIsReady] = useState(false)

    const { allVendorsData } = useSelector((state: RootState) => state.vendor)

    const filterShops = !shopSearch ? [] : allVendorsData.filter((v: any) => v.shopName.toLowerCase().includes(shopSearch.toLowerCase()))


    //    for after category click select same category and show all category data only //
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const cat = params.get("category")
        if (cat) { setSelectedCategory(cat) }
        setIsReady(true)

    }, [])

    const fetchProduct = async () => {
        try {
            const param = new URLSearchParams()
            if (search) param.append("query", search);
            if (selectedCategory !== "all") {
                param.append("category", selectedCategory);
            }

            // for shopsearch //
            if (selectedShop !== "all") {
                param.append("shop", selectedShop);
            }
            const result = await axios.get(`/api/search?${param.toString()}`)
            setDisplayProducts(result.data.products)
            console.log(result)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!isReady) return;
        fetchProduct()
    }, [selectedCategory, search, selectedShop, isReady])



    return (
        <div className='min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white px-4 py-6'>
            <div className="mb-6 mx-auto max-w-5xl text-center">

                {/* Left side: Back + Home */}
                <div className="flex items-center gap-3">

                    {/* Home Button */}
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm backdrop-blur-md transition"
                    >
                        ← Back
                    </button>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold">
                    Browser Products by Categories
                </h1>
                <p className="text-gray-300 text-sm">
                    Filter by category, shop or search your favorite product
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* left sidebar */}
                <div className="md:col-span-1 bg-white/10 border border-white/20 rounded-xl p-4 space-y-6">
                    <input type="text" placeholder="Search Products..." className="w-full px-3 py-2 rounded bg-black border border-white/20"
                        required
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />


                    <div className="space-y-2 max-h-64 overflow-y-auto text-nowrap">
                        {
                            categoryList.map((cat) => (
                                <button key={cat.label}
                                    onClick={() => {
                                        setSelectedCategory(cat.label);
                                        setSelectedShop("all");
                                        setShopSearch("")
                                    }}
                                    className={`flex gap-2 w-full px-3 py-2 rounded ${selectedCategory === cat.label
                                        ? "bg-blue-600"
                                        : "bg-white/10 hover:bg-white/20"
                                        }`}
                                >
                                    {cat.icon} {cat.label}
                                </button>
                            ))
                        }
                    </div>

                    <input type="text" placeholder="Search Shop..."
                        className="w-full px-3 py-2 rounded bg-black border border-white/20"
                        value={shopSearch}
                        required
                        onChange={(e) => setShopSearch(e.target.value)}
                    />

                    {shopSearch &&
                        <div className="bg-black border border-white/20 max-h-48 rounded overflow-y-auto">
                            {filterShops.map((v: any) => (
                                <button
                                    onClick={() => {
                                        setShopSearch(v.shopName);
                                        setSelectedShop(v._id)
                                    }}
                                    key={v._id} className="block px-3 py-2 w-full text-left hover:bg-white/10">
                                    {v.shopName}
                                </button>
                            ))}
                        </div>}

                </div>

                {/* for right side search products show */}
                <div className="md:col-span-3">
                    {
                        displayProducts.length === 0 ? (
                            <div className="mt-20 text-center text-gray-400">
                                No Products found
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                                {displayProducts.map((p: any) => (
                                    <ProductCard key={p._id} product={p} />
                                ))}
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default CategoriesPage
