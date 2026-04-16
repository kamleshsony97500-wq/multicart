import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import productModel from "@/model/product.model";
import userModel from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await auth();
        const adminUser = await userModel.findById(session?.user?.id)
        if(!adminUser || adminUser.role !== "admin"){
            return NextResponse.json({
                message:"Only admin can approve vendors or admin is not found"
            }, {status: 403})
        }

        const {productId, status, rejectedReason} = await req.json()
        if(!productId || !status){
             return NextResponse.json({
                message:"productId and status are required"
            }, {status: 400})
        }
        const product =  await productModel.findById(productId)

        if(status === "approved"){
            product.verificationStatus = "approved";
            product.approvedAt = new Date();
            product.rejectedReason = undefined
        }

        if(status === "rejected"){
            product.verificationStatus = "rejected";
            product.rejectedReason = rejectedReason || "rejected by admin";
        }

        await product.save();

         return NextResponse.json({message:"Product status updated", product}, {status: 200})
        
    } catch (error) {
         return NextResponse.json({
            error: `product status updated ${error}`
        }, {status: 500})
    }
}