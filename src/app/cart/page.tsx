"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Cart = () => {
    const [cart, setCart] = useState<any[]>([]);
    const router = useRouter();

    const getCart = async () => {
        try {
            const result = await axios.get("/api/user/cart/get");
            setCart(result.data.cart);
        } catch (error) {
            console.log(error);
            alert("failed to get cart");
        }
    };

    useEffect(() => {
        getCart();
    }, []);

    const handleUpdateCart = async (productId: string, quantity: number) => {
        try {
            await axios.post("/api/user/cart/update", {
                productId,
                quantity,
            });
            getCart();
        } catch (error) {
            console.log(error);
            alert("failed to update quantity");
        }
    };

    const handleRemoveCart = async (productId: string) => {
        try {
            setCart((prev) => prev.filter((i) => i.product._id !== productId));
            await axios.post("/api/user/cart/remove", { productId });
            toast.success("cart removed")

        } catch (error) {
            console.log(error)
            toast.error("cart removed error")
        }

    };

    // ✅ Better Empty State
    if (!cart || cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 text-white text-center">
                <h1 className="text-5xl font-bold mb-4">🛒</h1>
                <h2 className="text-3xl font-semibold">Your Cart is Empty</h2>
                <p className="text-gray-400 mt-2">Looks like you haven't added anything yet</p>

                <button
                    onClick={() => router.push("/")}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-linear-to-br from-gray-900 via-black to-gray-900 text-white">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center gap-3 p-3">

                    {/* Home Button */}
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm backdrop-blur-md transition"
                    >
                        ← Back
                    </button>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold">Your Cart</h1>

                {cart.map((item, index) => (
                    <div
                        key={index}
                        className="backdrop-blur-lg bg-white/10 border border-white/10 p-5 rounded-2xl flex gap-5 shadow-lg hover:scale-[1.01] transition flex-col md:flex-row"
                    >
                        {/* Product Image */}
                        <Image
                            src={item.product.image1}
                            alt={item.product.title}
                            width={110}
                            height={110}
                            className="rounded-lg object-cover"
                        />

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {item.product.title}
                                </h3>
                                <p className="text-green-400 font-medium mt-1">
                                    ₹ {item.product.price}
                                </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 mt-3">
                                <button
                                    onClick={() =>
                                        handleUpdateCart(
                                            item.product._id,
                                            item.quantity - 1
                                        )
                                    }
                                    className="w-8 h-8 flex items-center justify-center border border-gray-500 rounded hover:bg-gray-700"
                                >
                                    -
                                </button>

                                <span className="text-lg font-semibold">
                                    {item.quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        handleUpdateCart(
                                            item.product._id,
                                            item.quantity + 1
                                        )
                                    }
                                    className="w-8 h-8 flex items-center justify-center border border-gray-500 rounded hover:bg-gray-700"
                                >
                                    +
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-4 flex-wrap">
                                <button
                                    onClick={() =>
                                        router.push(`/checkout/${item.product._id}`)
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition"
                                >
                                    Checkout
                                </button>

                                <button
                                    onClick={() =>
                                        handleRemoveCart(item.product._id)
                                    }
                                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="text-right font-bold text-lg flex items-center">
                            ₹ {item.product.price * item.quantity}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cart;