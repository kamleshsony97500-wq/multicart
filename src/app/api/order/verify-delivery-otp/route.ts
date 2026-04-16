import connectDB from "@/lib/connectDB";
import orderModel from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { otp, orderId } = await req.json();

        if (!otp || !orderId) {
            return NextResponse.json({
                message: "OrderId and OTP required"
            }, { status: 400 });
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            return NextResponse.json({
                message: "Order not found"
            }, { status: 404 });
        }

        // Debug logs
        console.log("DB OTP:", order.deliveryOtp);
        console.log("USER OTP:", otp);

        if (
            order.deliveryOtp?.toString() !== otp.toString() ||
            !order.otpExpiresAt ||
            order.otpExpiresAt < new Date()
        ) {
            return NextResponse.json({
                message: "Invalid or expired OTP"
            }, { status: 400 });
        }

        order.orderStatus = "delivered";
        order.isPaid = true; // ✅ FIXED
        order.deliveryDate = new Date();
        order.deliveryOtp = undefined;
        order.otpExpiresAt = undefined;

        await order.save();

        return NextResponse.json({
            message: "Order delivered successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("VERIFY ERROR:", error);

        return NextResponse.json({
            message: "Failed to verify OTP",
            error: String(error),
        }, { status: 500 });
    }
}