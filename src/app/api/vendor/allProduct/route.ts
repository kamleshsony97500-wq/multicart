import connectDB from "@/lib/connectDB";
import productModel from "@/model/product.model";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await connectDB();

        const products = await productModel.find()
            .populate("vendor", "name email shopName")
            .populate({
                path: "reviews.user", select: "name email image"
            }).sort({ createdAt: -1 })

        return NextResponse.json(products, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: `Failed to get all product ${error}`
        }, { status: 500 })
    }
}