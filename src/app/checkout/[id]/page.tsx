"use client";

import axios from "axios";
import { motion } from "motion/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaStripe } from "react-icons/fa";
import { ClipLoader } from "react-spinners";


const Checkout = () => {
    const params = useParams()
    const router = useRouter();


    const productId = params.id as string;
    const [item, setItem] = useState<any>(null)

    const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [pincode, setPincode] = useState("")
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (!productId) {
            return;
        }

        const loadItem = async () => {
            try {
                const result = await axios.get("/api/user/cart/get");
                const foundItem = result.data.cart.find((i: any) => i.product._id === productId)
                if (!foundItem) {
                    router.replace("/cart")
                }
                setItem(foundItem)
                // console.log(foundItem)


                if (!foundItem.product.payOnDelivery) {
                    setPaymentMethod("stripe")
                }

            } catch (error) {
                console.log(error);
                alert("failed to get item");
            }
        }


        loadItem()
    }, [productId, router])



    if (!item) {
        return <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 text-4xl text-white via-black to-gray-900 text-center px-4 py-12">Loading...</div>
    }

    const productTotal = item.product.price * item.quantity;
    const deliveryCharge = item.product.freeDelivery ? 0 : 50;
    const serviceCharge = 30;
    const finalTotal = productTotal + deliveryCharge + serviceCharge;


    const codDisabled = !item.product.payOnDelivery;


    const handlePlaceOrder = async () => {
        if (!name || !phone || !address || !city || !pincode) {
            alert("please fill all address fields");
            return;
        }

        const payload = {
            productId,
            quantity: item.quantity,
            address: { name, phone, address, city, pincode },
            amount: finalTotal,
            deliveryCharge,
            serviceCharge
        };

        setLoading(true);


        try {
            if (paymentMethod === "cod") {
                await axios.post("/api/order/cod", payload)
                router.push("/order-success")
                setLoading(false)
            } else {
                // only add for stripe payment //
                const result = await axios.post("/api/order/online-pay", payload)
                window.location.href = result.data.url
            }

        } catch (error) {
            console.log(error)
            setLoading(false)
            router.push("/order-failed")
        }
    }



    return (
        <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 text-center px-4 py-12 text-white">
            {/* 🔙 BACK BUTTON */}


            {/* Home Button */}

            <div className="flex items-center gap-3 p-4 top-0 left-0 absolute">

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
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl mt-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-10 grid md:grid-cols-2 gap-8">
                <div className="space-y-5">
                    <h2 className="text-2xl text-white font-bold">Delivery Address</h2>
                    <input type="text" placeholder="Full Name" className="bg-black  /20 placeholder:text-gray-400 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3 w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input type="text" placeholder="Phone Numbers" className="bg-black/20 placeholder:text-gray-400 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3 w-full"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />

                    <textarea placeholder="Complete Address" className="bg-black/20 placeholder:text-gray-400 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3 w-full"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="City Name" className="bg-black/20 placeholder:text-gray-400 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3 w-full"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />



                        <input type="text" placeholder="Pincode" className="bg-black/20 placeholder:text-gray-400 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3 w-full"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            required
                        />

                    </div>
                </div>


                <div className="space-y-5">
                    <h2 className="text-2xl text-white font-bold">Order Summary</h2>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                        {item && (
                            <Image
                                src={item.product.image1}
                                alt="img"
                                width={80}
                                height={80}
                                className="rounded-lg object-contain"
                            />
                        )}

                        <div className="flex-1">
                            <p className="font-semibold text-gray-100">
                                {item.product.title.slice(0, 60) + "..."}
                            </p>
                            <p className="text-gray-400 text-sm flex items-start">
                                Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-green-400">
                            ₹ {productTotal}
                        </p>
                    </div>

                    <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex justify-between">
                            <span>Delivery Charege</span>
                            <span>₹ {deliveryCharge}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Service Charege</span>
                            <span>₹ {serviceCharge}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-white/20 pt-3 text-white">
                            <span>Total</span>
                            <span className="text-green-400">₹ {finalTotal}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-white font-semibold flex items-start">
                            Payment Method:</p>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setPaymentMethod("cod")}
                                disabled={codDisabled} className={`flex-1 py-3 rounded-xl font-semibold transition text-white ${paymentMethod === "cod"
                                    ? "bg-blue-600"
                                    : "bg-white/10"
                                    }${codDisabled ? "opacity-40 cursor-not-allowed" : ""}`}>
                                Cash on Delivery</motion.button>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setPaymentMethod("stripe")}
                                className={`flex-1 py-3 text-white flex items-center justify-center gap-2 rounded-xl font-semibold transition ${paymentMethod === "stripe"
                                    ? "bg-blue-600"
                                    : "bg-white/10"
                                    }`}>
                                <FaStripe className="text-xl border rounded bg-green-300 text-black 0.5" />Stripe</motion.button>
                        </div>
                    </div>

                    <motion.button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90 py-4 rounded-2xl font-semibold text-lg transition text-white">
                        {
                            loading ? <ClipLoader size={20} color="white" /> : paymentMethod === "cod"
                                ? "Place Order"
                                : "Proceed to Secure Payment"
                        }
                    </motion.button>
                </div>


            </motion.div>

        </div>
    )
}

export default Checkout
