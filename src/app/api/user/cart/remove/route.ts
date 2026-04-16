


import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import userModel from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user?.id || !session.user.email) {
            return NextResponse.json({
                message: "UnAuthorized User"
            }, { status: 400 })
        }

        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({
                message: "productId is required"
            }, { status: 400 })
        }

        const user = await userModel.findById(session.user.id)
        if (!user || !user.cart) {
            return NextResponse.json({
                message: "User's cart is not found"
            }, { status: 404 })
        }

        user.cart = user.cart.filter((item: any) =>
            item.product.toString() !== productId.toString()
        );

        await user.save();

        return NextResponse.json({
            message: "Cart item removed",
        }, { status: 200 })



    } catch (error) {
        return NextResponse.json({
            message: `Failed to remove cart ${error}`
        }, { status: 500 })
    }
}