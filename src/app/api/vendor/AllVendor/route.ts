import connectDB from "@/lib/connectDB";
import userModel from "@/model/user.model";
import { NextResponse } from "next/server";



export async function GET() {
   try {
      await connectDB();

      const vendors = await userModel.find({ role: "vendor" }).sort({ createdAt: -1 })
         .populate("vendorProducts")


      if (!vendors) {
         return NextResponse.json({ message: "Vendors are not found" }, { status: 400 })
      }

      return NextResponse.json({ vendors }, { status: 200 })

   } catch (error) {
      return NextResponse.json({
         message: `get vendor error ${error}`
      }, { status: 500 })
   }
}