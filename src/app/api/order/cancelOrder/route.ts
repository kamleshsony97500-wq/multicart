import connectDB from "@/lib/connectDB";
import orderModel from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { orderId } = await req.json();
        if (!orderId) {
            return NextResponse.json({
                message: "OrderId is required"
            }, { status: 404 })
        }

        const order = await orderModel.findById(orderId)
        if (!order) {
            return NextResponse.json({
                message: "Order not found"
            }, { status: 404 })
        }

        order.orderStatus = "cancelled",
            order.cancelledAt = new Date()
        await order.save()

        return NextResponse.json({
            message: "Order Cancelled"
        }, { status: 200 });


    } catch (error) {
        return NextResponse.json({
            message: `failed to  order cancel   ${error}`
        }, { status: 500 })
    }
}