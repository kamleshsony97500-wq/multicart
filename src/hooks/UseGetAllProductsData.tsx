"use client";

import { AppDispatch } from "@/redux/store";
import { setAllProductsData } from "@/redux/vendorSlice";
import axios from "axios";
import { useEffect } from "react"
import { useDispatch } from "react-redux";


 function UseGetAllProductsData () {
    const dispatch = useDispatch<AppDispatch>()
 
    useEffect(()=>{
        const fetchAllProduct = async ()=>{
           try {
             const result = await axios.get("/api/vendor/allProduct")
            //  console.log(result.data)
             dispatch(setAllProductsData(result.data))
            
           } catch (error) {
              console.log(error)
               dispatch(setAllProductsData([]))
           }
        }

        fetchAllProduct()

    }, [])
}

export default UseGetAllProductsData
