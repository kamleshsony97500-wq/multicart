import { auth } from "@/auth"
import connectDB from "@/lib/connectDB"
import userModel from "@/model/user.model"
import { NextResponse } from "next/server"



export async function GET() {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user?.id || !session.user.email) {
            return NextResponse.json({
                message: "UnAuthorized User"
            }, { status: 400 })
        }

        const user = await userModel.findById(session.user.id)
            .populate("cart.product")

        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        return NextResponse.json({ cart: user.cart }, { status: 200 })


    } catch (error) {
        return NextResponse.json({
            message: `Failed to get cart ${error}`
        }, { status: 500 })
    }
}