import connectDB from "@/lib/connectDB";
import { sendDeliveryOtpEmail } from "@/lib/mailer";
import orderModel from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { orderId, status } = await req.json()

        const order = await orderModel.findById(orderId).populate("buyer")
        if (!order) {
            return NextResponse.json({
                message: "Order not found"
            }, { status: 404 })
        }

        if (status === "confirmed" || status === "shipped") {
            order.orderStatus = status
            await order.save()

            return NextResponse.json({
                message: "orderStatus updated"
            }, { status: 200 })
        }


        if (status === "delivered") {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            order.deliveryOtp = otp
            order.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
            await order.save()


            const email = order.buyer?.email
            if (!email) {
                return NextResponse.json({
                    message: "Email not found"
                }, { status: 404 });
            }

            await sendDeliveryOtpEmail(email, otp)
            return NextResponse.json({
                message: "OTP send to buyer email"
            });

        }

        return NextResponse.json({
            message: "Invalid status"
        }, { status: 400 });



    } catch (error) {
        return NextResponse.json({
            message: `failed to  order update   ${error}`
        }, { status: 500 })
    }
}