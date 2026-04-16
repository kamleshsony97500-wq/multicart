import connectDB from "@/lib/connectDB";
import productModel from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url)

        const query = searchParams.get("query") || "";
        const category = searchParams.get("category");

        // for shop se find all products //
        const shop = searchParams.get("shop");


        const filter: any = {
            isActive: true,
            verificationStatus: "approved"
        }

        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
            ]
        }

        // ✅ category filter //
        if (category && category !== "all") {
            filter.category = category
        }

        // ✅ shop se filter //
        if (shop && shop !== "all") {
            filter.vendor = shop
        }

        const products = await productModel.find(filter)
            .populate("vendor", "shopName image").sort({ createdAt: -1 })

        return NextResponse.json({
            success: true,
            count: products.length,
            products
        }, { status: 200 })


    } catch (error) {
        return NextResponse.json({
            message: `failed to search category products error   ${error}`
        }, { status: 500 })
    }
}