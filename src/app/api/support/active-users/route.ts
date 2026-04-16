import { auth } from "@/auth"
import connectDB from "@/lib/connectDB"
import orderModel from "@/model/order.model"
import userModel from "@/model/user.model"
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

        const currentUser = await userModel.findById(session.user.id)
        if (!currentUser) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        //  for user ke liye chat with vendor only //
        if (currentUser.role === "user") {
            const orders = await orderModel.find({
                buyer: currentUser._id
            }).populate("productVendor", "name image shopName role");

            //  no dubleket vendor show for below code 1 line /
            const vendorMap = new Map<string, any>()

            orders.forEach((order: any) => {
                if (order.productVendor) {
                    vendorMap.set(
                        String(order.productVendor._id),
                        order.productVendor
                    )
                }
            })
            return NextResponse.json([...vendorMap.values()]);
        }


        //  for vendor ke liye chat with admin only //
        if (currentUser.role === "vendor") {
            const orders = await orderModel.find({
                productVendor: currentUser._id
            }).populate("buyer", "name image  role");

            //  no dubleket vendor show for below code 1 line /
            const buyerMap = new Map<string, any>()

            orders.forEach((order: any) => {
                if (order.buyer) {
                    buyerMap.set(
                        String(order.buyer._id),
                        order.buyer
                    )
                }
            });

            const admin = await userModel.findOne({ role: "admin" }).select(
                "name image role"
            );


            return NextResponse.json([admin, ...buyerMap.values()]);
        }

        //  for admin ke liye chat with vendor  only //
        if (currentUser.role === "admin") {
            const vendors = await userModel.find({ role: "vendor" }).select(
                "name image shopName role"
            );

            return NextResponse.json(vendors)
        }

    } catch (error) {
        return NextResponse.json({
            message: `failed to get active users or chat   ${error}`
        }, { status: 500 })
    }
}