import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import productModel from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await auth()
        if (!session || !session.user?.id || !session.user.email) {
            return NextResponse.json({
                message: "UnAuthorized user"
            }, { status: 404 })
        }

        const { productId, isActive } = await req.json();

        const product = await productModel.findByIdAndUpdate(productId, {
            isActive
        }, { new: true })

        if (!product) {
            return NextResponse.json({
                message: "Product not found"
            }, { status: 404 })
        }

        return NextResponse.json(product, { status: 200 })


    } catch (error) {
        return NextResponse.json({
            message: `Failed to update isActive  error ${error}`
        }, { status: 500 })
    }
}