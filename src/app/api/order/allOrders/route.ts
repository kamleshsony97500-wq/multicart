import { auth } from "@/auth"
import connectDB from "@/lib/connectDB"
import orderModel from "@/model/order.model"
import { NextResponse } from "next/server"


export async function GET() {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user?.id || !session.user.email) {
            return NextResponse.json({
                message: "UnAuthorized user"
            }, { status: 400 })
        }

        const orders = await orderModel.find()
            .populate("buyer", "name phone email image")
            .populate("productVendor", "name shopName email")
            .populate({
                path: "products.product",
                model: "Product",
                select: "title image1 category stock vendor replacementDays",
            })
            .sort({ createdAt: -1 })

        return NextResponse.json(orders, { status: 200 })


    } catch (error) {
        return NextResponse.json({
            message: `failed to get all cod  ${error}`
        }, { status: 500 })
    }
}