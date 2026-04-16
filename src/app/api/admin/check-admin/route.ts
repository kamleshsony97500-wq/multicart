import connectDB from "@/lib/connectDB";
import userModel from "@/model/user.model";
import { NextResponse } from "next/server";



export async function GET() {
    try {
        await connectDB();
        const admin = await userModel.findOne({role: "admin"});
        return NextResponse.json({
            exists: !!admin
        })
        
    } catch (error) {
        return NextResponse.json({
            error: "Failed to check admin existence"
        }, {status: 500})
    }
}