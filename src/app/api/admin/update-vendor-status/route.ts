import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
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

        const {vendorId, status, rejectedReason} = await req.json()
        if(!vendorId || !status){
             return NextResponse.json({
                message:"vendorId and status are required"
            }, {status: 400})
        }
        const vendor =  await userModel.findById(vendorId)

        if(status === "approved"){
            vendor.verificationStatus = "approved";
            vendor.isApproved = true;
            vendor.approvedAt = new Date();
            vendor.rejectedReason = undefined
        }

        if(status === "rejected"){
            vendor.verificationStatus = "rejected";
            vendor.isApproved = false;
            vendor.rejectedReason = rejectedReason || "rejected by admin";
        }

        await vendor.save();

         return NextResponse.json({message:"vendor status updated", vendor}, {status: 200})
        
    } catch (error) {
         return NextResponse.json({
            error: `vendor status updated ${error}`
        }, {status: 500})
    }
}