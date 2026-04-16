import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import userModel from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest) {
   try {
    await connectDB();
    const {role, phone} = await req.json();
    const session = await auth();
    const user = await userModel.findOneAndUpdate({email: session?.user?.email},
     {role, phone}, {new: true});
     if(!user){
        return NextResponse.json({
            message:"User not found"
        }, {status: 404 })
     }

     return NextResponse.json({user}, {status: 200})
    
   } catch (error) {
      return NextResponse.json({
        message:"Failed to update user role and phone"
      }, {status: 500})
   }
}
    