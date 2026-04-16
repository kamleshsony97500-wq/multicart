"use client";


import axios from "axios";
import { motion } from "motion/react"
import { image } from "motion/react-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { ClipLoader } from "react-spinners";



const AddVendorProduct = () => {

const categories = [
   "Fashion & Lifestyle", 
   "Electronics & Gadgets", 
   "Home & Living", 
   "Beauty & Personal Care", 
   "Toys, Kids & Baby", 
   "Food & Grocery", 
   "Sports & Fitness", 
   "Automotive Accessories", 
   "Gifts & HandCrafts", 
   "Book & Stationery", 
   "Others"   
 ]

 const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"]

 const [title, setTitle] = useState("")
 const [description, setDescription] = useState("")
 const [stock, setStock] = useState("")
 const [price, setPrice] = useState("")
 const [category, setCategory] = useState("")
 const [customCategory, setCustomCategory] = useState("")
 const [isWearable, setIsWearable] = useState(false)
 const [sizes, setSizes] = useState<string[]>([])
 const [replacementDays, setReplacementDays] = useState("")
 const [warranty, setWarranty] = useState("")
 const [freeDelivery, setfreeDelivery] = useState(false)
 const [payOnDelivery, setPayOnDelivery] = useState(false)

 const [image1, setImage1] = useState<File | null>(null);
 const [image2, setImage2] = useState<File | null>(null);
 const [image3, setImage3] = useState<File | null>(null);
 const [image4, setImage4] = useState<File | null>(null);

 const [preview1, setPreview1] = useState<string | null>(null);
 const [preview2, setPreview2] = useState<string | null>(null);
 const [preview3, setPreview3] = useState<string | null>(null);
 const [preview4, setPreview4] = useState<string | null>(null);

 const [detailPoints, setDetailPoints] = useState<string[]>([]);
 const [currentPoint,setCurrentPoint] = useState("");
 const [pointIndex,setPointIndex] = useState(0);
 const [loading, setLoading] = useState(false)
 const router = useRouter()
 

 
 const toggleSize = (size:string) =>{
    setSizes((prev)=>prev.includes(size)
    ?prev.filter((s)=>s !== size) : [...prev, size])
 }


 const handleAddPoint = () =>{
   if(!currentPoint.trim())return;

   setDetailPoints((prev) =>{
     const updated = [...prev]
     updated[pointIndex] = currentPoint
     return updated;
   })
   setCurrentPoint("")
   setPointIndex((prev)=>prev + 1)
 }

 const handleRemove = (i:number)=>{
   setDetailPoints((prev)=>prev.filter((_,index)=> index !== i))
 }

 const handleSubmit = async () =>{
   if(!title || !description || !stock || !category || !price || !image1 || !image2 || !image3 || !image4){
    alert("All fields & 4 images required") 
    return;
   }

   if(isWearable && sizes.length ===0){
    alert("Please select at least one size")
   }
   setLoading(true);

   const formData = new FormData()
   formData.append("title", title);
   formData.append("description", description);
   formData.append("stock", stock);
   formData.append("price", price);

   formData.append(
    "category", 
    category === "Others" ? customCategory : category
   );

   formData.append("isWearable", String(isWearable));
   sizes.forEach((size)=> formData.append("sizes", size));

   formData.append("replacementDays", replacementDays);
   formData.append("freeDelivery", String(freeDelivery));
   formData.append("warranty", warranty);
   formData.append("payOnDelivery", String(payOnDelivery));

   detailPoints.forEach((point)=>
    formData.append("detailsPoints", point)
  );

  if(image1 && image2 && image3 && image4){
     formData.append("image1", image1);
     formData.append("image2", image2);
     formData.append("image3", image3);
     formData.append("image4", image4);
  }

   try {
    const result = await axios.post("/api/vendor/addProduct", formData)
    console.log(result.data)
    setLoading(false)
     alert("✅ Product added successfully. Waiting for admin approval.")
     router.push("/")
    
   } catch (error) {
     console.log(error)
      setLoading(false)
      alert("❌ Product add failed")
   }
 }


  return (
    <div className="min-h-screen px-4 pt-20 pb-10 bg-linear-to-br from-gray-900 via-black to-gray-900 text-white">
     <motion.div 
     initial={{ opacity: 0, y: 40 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{duration:0.5}}
     className="max-w-3xl mx-auto bg-white/20 backdrop-blur-xl p-6 sm:p-10 rounded-2xl border border-white/20 shadow-xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Add New Product</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="text" className="p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 rounded border border-white/20"
        placeholder="Product Title"
        required
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        />

        <input type="number" className="p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 rounded border border-white/20"
        placeholder="Price"
         required
        value={price}
        onChange={(e)=>setPrice(e.target.value)}
        />

        <input type="number" className="p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 rounded border border-white/20"
        placeholder="Stock Quantity"
         required
        value={stock}
        onChange={(e)=>setStock(e.target.value)}
        />

        {/* categories select area */}
        <select className="p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 rounded border border-white/20 text-white"
         onChange={(e)=>setCategory(e.target.value)}>
         <option className="bg-gray-800" value="">Select Category</option>
         {categories.map((cat)=>(
            <option key={cat} value={cat} className="bg-gray-900">
                {cat}
            </option>
         ))}
        </select>
      </div>

     {category === "Others" && 
     <input type="text" 
     className="p-3 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white/10 rounded border border-white/20 text-white" 
     value={customCategory} 
     onChange={(e)=>setCustomCategory(e.target.value)}
     placeholder="Enter Custom Category"
     />}

     <textarea
     placeholder="Product Description"
     required
     value={description} 
     onChange={(e)=>setDescription(e.target.value)}
     className="p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 w-full bg-white/10 rounded border border-white/20 text-white"
     rows={3} />

     <div className="flex items-center gap-3 mt-5">
        <input type="checkbox" className="w-5 h-5 cursor-pointer" 
        checked={isWearable}
        onChange={()=>setIsWearable(!isWearable)}/>
        <span className="text-sm">This is wearable / clothing product</span>
     </div>

       {/* for sizes map */}
      {isWearable && 
         <div className="mt-4">
          <p className="mb-2 text-sm font-semibold">Select Sizes</p>
           <div className="flex flex-wrap gap-3">
             {sizeOptions.map((size)=>(
                <button type="button" key={size} onClick={()=>toggleSize(size)}
                className={`px-4 py-1 rounded-full border ${
                    sizes.includes(size)
                    ? "bg-blue-500 border-blue-600"
                    : "bg-white/10 border-white/20"
                }`}>
                  {size}
                </button>    
             ))}
           </div>
        </div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <input type="text" className="p-3 focus:outline-none focus:ring-2 focus:ring-blue-500  bg-white/10 border border-white/20 rounded" 
          placeholder="ReplacementDays (e.g. 7 days)"
          required
          value={replacementDays}
          onChange={(e)=>setReplacementDays(e.target.value)}
          />

          <input type="text" className="p-3 focus:outline-none focus:ring-2 focus:ring-blue-500  bg-white/10 border border-white/20 rounded" 
          placeholder="Warranty (e.g. 1 year)"
          required
          value={warranty}
          onChange={(e)=>setWarranty(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 mt-5">
        <input type="checkbox" className="w-5 h-5 cursor-pointer" 
        checked={freeDelivery}
        onChange={()=>setfreeDelivery(!freeDelivery)}/>
        <span className="text-sm">Free Delivery</span>

        <input type="checkbox" className="w-5 h-5 ml-4 cursor-pointer" 
        checked={payOnDelivery}
        onChange={()=>setPayOnDelivery(!payOnDelivery)}/>
        <span className="text-sm">Pay On Delivery</span>
     </div>

     <h3 className="mt-6 mb-3 font-semibold">Upload 4 Images</h3>
     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
       {/* image1 ke liye */}
       <div>
         <input type="file" id="img1" hidden accept="image/*"
         onChange={(e)=>{
           const file = e.target.files?.[0];
           if(!file) {return;}
           setImage1(file)
           setPreview1(URL.createObjectURL(file))

         }}
          />
          <label htmlFor="img1"
          className="cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20 hover:border-blue-500">
          {preview1 ? (
            <Image src={preview1} alt="image1" width={120} height={120}
            className="w-full h-full object-cover rounded"/>
          ) : (
            <div className="flex flex-col items-center text-gray-400 text-sm">
             <FiUpload size={22}/>
             <span>Image 1</span>
            </div>
          )}
          </label>
       </div>

       {/* image2 ke liye */}
       <div>
         <input type="file" id="img2" hidden accept="image/*"
         onChange={(e)=>{
           const file = e.target.files?.[0];
           if(!file) {return;}
           setImage2(file)
           setPreview2(URL.createObjectURL(file))

         }}
          />
          <label htmlFor="img2"
          className="cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20 hover:border-blue-500">
          {preview2 ? (
            <Image src={preview2} alt="image2" width={120} height={120}
            className="w-full h-full object-cover rounded"/>
          ) : (
            <div className="flex flex-col items-center text-gray-400 text-sm">
             <FiUpload size={22}/>
             <span>Image 2</span>
            </div>
          )}
          </label>
       </div>

        {/* image3 ke liye */}
        <div>
         <input type="file" id="img3" hidden accept="image/*"
         onChange={(e)=>{
           const file = e.target.files?.[0];
           if(!file) {return;}
           setImage3(file)
           setPreview3(URL.createObjectURL(file))

         }}
          />
          <label htmlFor="img3"
          className="cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20 hover:border-blue-500">
          {preview3 ? (
            <Image src={preview3} alt="image3" width={120} height={120}
            className="w-full h-full object-cover rounded"/>
          ) : (
            <div className="flex flex-col items-center text-gray-400 text-sm">
             <FiUpload size={22}/>
             <span>Image 3</span>
            </div>
          )}
          </label>
       </div>

        {/* image4 ke liye */}
        <div>
         <input type="file" id="img4" hidden accept="image/*"
         onChange={(e)=>{
           const file = e.target.files?.[0];
           if(!file) {return;}
           setImage4(file)
           setPreview4(URL.createObjectURL(file))

         }}
          />
          <label htmlFor="img4"
          className="cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20 hover:border-blue-500">
          {preview4 ? (
            <Image src={preview4} alt="image4" width={120} height={120}
            className="w-full h-full object-cover rounded"/>
          ) : (
            <div className="flex flex-col items-center text-gray-400 text-sm">
             <FiUpload size={22}/>
             <span>Image 4</span>
            </div>
          )}
          </label>
       </div>
     </div>


     <div className="mt-6">
      <p className="font-semibold mb-2">Product Details Points</p>
      <div className="flex gap-2">
         <input type="text"  className="flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 p-3 bg-white/10 border border-white/20 rounded"
         placeholder={`Point ${pointIndex + 1}`} 
         value={currentPoint}
         onChange={(e)=>setCurrentPoint(e.target.value)}/>

         <button type="button" 
         onClick={handleAddPoint}
         className="px-4 bg-blue-600 hover:bg-blue-700 rounded font-semibold">
          Add Point</button>
      </div>

      {detailPoints.length >0 && (
         <ul className="mt-3 space-y-2">
          {detailPoints.map((point, index)=>(
            <li key={index} className="flex justify-between items-center bg-white/10 p-2">
               <span className="text-sm">{index + 1}. {point}</span>
               <button type="button" className="text-xs cursor-pointer text-red-400"
                onClick={()=>handleRemove(index)}>
                  Remove</button>
            </li>
          ))}
         </ul>
      )}
     </div>

     <motion.button
     onClick={handleSubmit}
     whileHover={{scale: 1.02}} 
     whileTap={{scale: 0.97}}
     className="w-full cursor-pointer mt-8 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
     disabled={loading}>
      {loading ? <ClipLoader size={20} color="white"/> : "Add Product"}
      </motion.button>
      
     </motion.div>
    </div>
  )
}

export default AddVendorProduct
