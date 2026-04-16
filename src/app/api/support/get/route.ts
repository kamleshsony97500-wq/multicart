import { auth } from "@/auth"
import connectDB from "@/lib/connectDB"
import userModel from "@/model/user.model"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user?.id || !session.user?.email) {
            return NextResponse.json({
                message: "UnAuthorized user"
            }, { status: 400 })
        }

        const { withUserId } = await req.json()
        if (!withUserId) {
            return NextResponse.json({
                message: "with user id required"
            }, { status: 400 })
        }

        const user = await userModel.findById(session.user.id)
            .populate("chats.with", "name image shopName role");
        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        const chat = user?.chats?.find(
            (c: any) => String(c.with?._id) === String(withUserId)
        );

        return NextResponse.json(chat?.messages || []);


    } catch (error) {
        return NextResponse.json({
            message: `failed to get chat   ${error}`
        }, { status: 500 })

    }

}