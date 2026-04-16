import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import userModel from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST (req: NextRequest){
    try {
        await connectDB();

        const {shopName, shopAddress, gstNumber} = await req.json();
        if(!shopName || !shopAddress || !gstNumber){
            return NextResponse.json({message:"All fields are required"}, {status: 400})
        }
        const session = await auth()

        if(!session?.user?.email){
            return NextResponse.json({message:"Unauthorized access"}, {status: 401})
        }

        const UpdatedVendor = await userModel.findOneAndUpdate({email: session?.user?.email}, {
            shopName,
            shopAddress,
            gstNumber,
            verificationStatus:"pending",
            requestedAt: new Date(),
            rejectedReason:null,
            isApproved:false
        }, {new: true})

        if(!UpdatedVendor){
            return NextResponse.json({message:"Vendor not found"}, {status: 400})
        }
        
        return NextResponse.json({
         message:"Verify again successfully!",
         UpdatedVendor}, {status: 200}
        )

    } catch (error) {
        return NextResponse.json({
        message:`Failed to verify again error ${error}`
      }, {status: 500})
    }
}