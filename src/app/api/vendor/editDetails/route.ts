import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import userModel from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST (req: NextRequest){
    try {
        await connectDB();

        const {shopName, shopAddress, gstNumber} = await req.json();
        const session = await auth()

        if(!session?.user?.email){
            return NextResponse.json({message:"Unauthorized access"}, {status: 401})
        }

        const user = await userModel.findOneAndUpdate({email: session?.user?.email}, {
            shopName,
            shopAddress,
            gstNumber,
            verificationStatus:"pending",
            requestedAt: new Date(),
        }, {new: true})

        if(!user){
            return NextResponse.json({message:"User not found"}, {status: 400})
        }
        
        return NextResponse.json({
         message:"Vendor details submitted successfully!",
         user}, {status: 200}
        )

    } catch (error) {
        return NextResponse.json({
        message:`Failed to update vendor details ${error}`
      }, {status: 500})
    }
}