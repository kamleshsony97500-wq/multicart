import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import userModel from "@/model/user.model";
import { NextResponse } from "next/server";





export async function GET(){
    try {
        await connectDB();
        const session = await auth();

        const user = await userModel.findOne({email:session?.user?.email}).select("-password")
        if(!user){
            return NextResponse.json({
                message:"User not found"
            }, {status: 400})
        }
        
        return NextResponse.json(user, {status: 200})

    } catch (error) {
         return NextResponse.json({
        message:`get current error ${error}`
      }, {status: 500})
    }
}