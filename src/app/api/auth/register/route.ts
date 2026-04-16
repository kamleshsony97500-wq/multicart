import connectDB from "@/lib/connectDB";
import userModel from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(req:NextRequest) {

    try {
    await connectDB();
    const {name, email, password} = await req.json();

    const existUser = await userModel.findOne({email});
    if(existUser){
        return NextResponse.json({
            message:"User already exists"
        }, {status:400})
    }

    if(password.length < 6){
        return NextResponse.json({
            message:"Password must be at least 6 characters long"
        }, {status:400})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        name,
        email,
        password:hashedPassword
    })

    return NextResponse.json({
        user
    }, {status:201})

    }

    catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json({
            message:"Internal Server Error"
        }, {status:500})
    }

}