"use client";

import ProductCard from "@/component/ProductCard";
import UseGetAllProductsData from "@/hooks/UseGetAllProductsData";
import { IProduct } from "@/model/product.model";
import { RootState } from "@/redux/store";
import axios from "axios";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { URL } from "node:url";
import { useState } from "react";
import { FaRegStar, FaStar, FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";


const ViewProduct = () => {
  UseGetAllProductsData();


  const params = useParams()
  const productId = params.id as string;

  const { allProductsData } = useSelector((state: RootState) => state.vendor);

  const product: IProduct | undefined = allProductsData?.find((p: IProduct) => String(p?._id) === String(productId))
  //  console.log(product)
  const images: string[] = [
    product?.image1,
    product?.image2,
    product?.image3,
    product?.image4,
  ].filter((img): img is string => Boolean(img)) // false value nahi show hoga 

  const [activeImage, setActiveImage] = useState(0)
  const router = useRouter()

  const relatedProducts = allProductsData.filter((p) => p.category
    === product?.category && p._id !== product._id)
  // console.log(relatedProducts)

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)

  const handleSubmitReview = async () => {
    const formData = new FormData();

    formData.append("productId", String(productId));
    formData.append("rating", String(reviewRating));
    formData.append("comment", reviewComment);

    if (reviewImage) {
      formData.append("image", reviewImage)
    }
    setLoading(true)

    try {
      const result = await axios.post("/api/vendor/addReview", formData)
      console.log(result.data)

      alert("✅ Review added Successfully!")
      setLoading(false)
      setPreview(null);
      setReviewComment("")
      setReviewRating(0);
      setReviewImage(null)

    } catch (error) {
      console.log(error)
      setLoading(false)
      alert("❌ Review add failed !")
    }
  }


  const totalReviews = product?.reviews?.length ?? 0
  const avgRating = product && totalReviews > 0 ? (
    product.reviews!.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / totalReviews
  ).toFixed(1) : 0

  // reviews! - means undefinned nahi aayega 



  // add to cart function //
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const result = await axios.post("/api/user/cart/add", {
        productId: productId,
        quantity: 1
      })
      console.log(result.data)
      alert("✅ Added to Cart")
      router.push("/cart")

    } catch (error) {
      console.log(error)
      alert("❌ failed to add Cart")
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-linear-to-br from-gray-900 via-black to-gray-900">
      <div className="flex items-center gap-3 text-white">
        {/* Home Button */}
        <div className="flex items-center gap-3 p-3">

          {/* Home Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm backdrop-blur-md transition"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* left-top image */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* main-image */}
            <div className="relative w-full lg:w-md h-105 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-white/10">
              {images.length > 0 && images[activeImage] && <Image src={images[activeImage]} alt={product?.title ?? "product image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />}
            </div>

            {/* image-thumail 4 image */}
            <div className="flex flex-row lg:flex-col lg:h-105 gap-6">
              {images.map((img, i) => (
                <div key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-20 border rounded cursor-pointer overflow-hidden flex items-center justify-center hover:scale-[110%] transition-all ${activeImage === i
                    ? "border-blue-600"
                    : "border-white/20"
                    }`}>
                  <Image src={img} alt="img" fill
                    className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* right-bottom */}
          {product && <div>
            <h3 className="text-3xl text-white font-bold mb-3">{product?.title}</h3>
            <p className="text-gray-400 mb-2">{product?.category}</p>
            <p className="text-green-500 text-2xl font-bold">₹ {product?.price}</p>
            <div className="flex items-center gap-2 mb-4 mt-1">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((i) => (

                  i <= Math.round(Number(avgRating)) ?
                    <FaStar key={i} /> : <FaRegStar key={i} />
                ))}
              </div>
              <span className="text-sm text-gray-400">({avgRating}/ {totalReviews}) Reviews</span>
            </div>
            <p className="mb-4 text-gray-300">{product?.description}</p>
            <p className="mb-3 text-gray-50">
              Stock:{" "} <span className={
                product?.stock > 0
                  ? "text-green-400"
                  : "text-red-400"
              }>
                {product?.stock > 0 ? "In Stock" : "Out of Stock"}</span>
            </p>

            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold transition text-white cursor-pointer">
              Add to Cart
            </motion.button>
          </div>}
        </div>

        {/* down din=v */}
        {product && <div className="mt-8 bg-white/5 border border-white/10 rounded-lg p-6">
          {product?.isWearable && (
            <div className="mb-5">
              <p className="font-semibold mb-2 text-white">
                Available Sizes
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((s) => (
                  <span key={s} className="px-3 py-1 border bg-white border-white/20 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2  mb-6 text-gray-300">
            {typeof product.replacementDays === "number" && product?.replacementDays > 0 && (
              <p>
                ✅ {product.replacementDays} Days Replacement
              </p>
            )}
            {product.freeDelivery === true && <p>✅ Free Delivery</p>}
            {product.payOnDelivery === true && <p>✅ Cash on Delivery Available</p>}
            {product.warranty && product.warranty !== "No Warranty" &&
              <p>✅ Warranty : {product.warranty}</p>}
          </div>

          {Array.isArray(product.detailsPoints) && product.detailsPoints.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-white">Highlights</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-300">
                {product.detailsPoints.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

        </div>}


        {/* reviews section here */}
        <div className="mt-16 bg-white/5 border border-white/10 p-6">
          <h2 className="text-2xl font-bold mb-6 text-white">Custom Reviews</h2>
          <div className="mb-8">
            <p className="text-white mb-2 font-semibold">Add your Review</p>

            <div className="flex gap-2 mb-3 text-yellow-300">
              {
                [1, 2, 3, 4, 5].map((i) => (
                  <span key={i}
                    onClick={() => setReviewRating(i)}
                    className="cursor-pointer"
                  >
                    {i <= reviewRating ? <FaStar /> : <FaRegStar />}
                  </span>
                ))
              }
            </div>

            <textarea
              placeholder="Write a review..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-black rounded text-white border border-white/20 mb-3" rows={3} />

            <div className="flex flex-col">
              <label htmlFor="img" className="text-white font-semibold mb-2">
                Select Image for review {' '}
              </label>
              <input type="file" accept="image/*" className="mb-3 p-2 w-50 rounded-lg bg-white text-black" id="img"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file && typeof window !== "undefined") {
                    const previewUrl = window.URL.createObjectURL(file);
                    setReviewImage(file);
                    setPreview(previewUrl);
                  }
                }} />

              {preview && <Image src={preview} alt="preview" width={100} height={100}
                className="mb-3 rounded" />}
            </div>
            <motion.button
              onClick={handleSubmitReview}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-blue-600 mt-4 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold" disabled={loading}>
              {loading ? <ClipLoader size={20} color="white" /> : "Submit Review"}
            </motion.button>
          </div>


          {product?.reviews && product.reviews.length > 0 ? (
            <h2 className="text-white font-semibold text-2xl">All Reviews</h2>
          ) : (
            <h2 className="text-white font-semibold text-2xl">No Review Found</h2>
          )}


          {/* map reviews user */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">

            {product?.reviews?.map((r, i) => (
              <div key={i} className="bg-white w-60 border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black">
                    {r.user.image ? (
                      <Image src={r.user.image} alt={r.user.name || "User"}
                        width={35}
                        height={35}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle />
                    )}
                  </div>

                  <div>
                    <p className="text-black font-semibold text-sm">{r.user.name}</p>
                    <div className="flex text-yellow-400 text-sm mt-1.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        i <= r.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-gray-900 text-sm mb-3">{r.comment}</p>
                {r.image ? <div className="w-45 h-45 border border-white/20 rounded-lg overflow-hidden bg-black">
                  <Image src={r.image} alt="Review image"
                    width={180} height={180}
                    className="object-contain" />
                </div> : <div className="w-45 h-45 border border-white/20 rounded-lg overflow-hidden bg-gray-400 flex items-center justify-center text-white text-sm">
                  No review image
                </div>}
              </div>
            ))}
          </div>
        </div>



        {/* relatedproduct show here */}
        {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-5">
              Related Products
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 8).map((rp) => (
                <ProductCard key={rp._id?.toString()} product={rp} />
              ))}
            </div>
          </div>)}
      </div>




    </div>
  )
}

export default ViewProduct
