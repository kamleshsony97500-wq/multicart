import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import productModel from "@/model/product.model";
import userModel from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user?.id || !session.user.email) {
            return NextResponse.json({
                message: "UnAuthorized user"
            }, { status: 400 })
        }

        const { productId, quantity = 1 } = await req.json();

        if (!productId) {
            return NextResponse.json({
                message: "Product ID required"
            }, { status: 400 })
        }

        const user = await userModel.findById(session.user?.id)
        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        const product = await productModel.findById(productId)
        if (!product) {
            return NextResponse.json({
                message: "Product not found"
            }, { status: 404 })
        }

        const existingProduct = user.cart.find((item: any) => item.product?.toString() === productId.toString())
        if (existingProduct) {
            existingProduct.quantity += quantity
        } else {
            user.cart.push({
                product: product._id,
                quantity
            })
        }

        await user.save();

        return NextResponse.json({
            message: "Product added to Cart ✅",
        }, { status: 200 })


    } catch (error) {
        return NextResponse.json({
            message: `Failed to add to product in cart ${error}`
        }, { status: 500 })
    }
}