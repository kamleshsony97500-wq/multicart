import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import userModel from "@/model/user.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await auth()
        if (!session || !session.user?.id || !session.user.email) {
            return NextResponse.json({
                message: "UnAuthorized user"
            }, { status: 400 })
        }

        const senderId = session.user.id;
        const { receiverId, text } = await req.json()
        if (!receiverId || !text) {
            return NextResponse.json({
                message: "receiverId and text required"
            }, { status: 400 })
        }

        const senderObjectId = new mongoose.Types.ObjectId(senderId)
        const receiverObjectId = new mongoose.Types.ObjectId(receiverId)

        // save in sender //
        // chats kiya pahile or add kar do 
        await userModel.updateOne(
            {
                _id: senderObjectId,
                "chats.with": receiverObjectId
            },
            {
                $push: {
                    "chats.$.messages": {
                        sender: senderObjectId,
                        text,
                        createdAt: new Date(),
                    },
                },
            }
        );

        // chats first time with user and admin //
        const senderHasChat = await userModel.findOne({
            _id: senderObjectId,
            "chats.with": receiverObjectId,
        });

        if (!senderHasChat) {
            await userModel.updateOne(
                { _id: senderObjectId },
                {
                    $push: {
                        chats: {
                            with: receiverObjectId,
                            messages: [
                                {
                                    sender: senderObjectId,
                                    text,
                                    createdAt: Date.now()
                                },
                            ],
                        },
                    },
                },
            );
        }


        // save in receiver //
        await userModel.updateOne(
            {
                _id: receiverObjectId,
                "chats.with": senderObjectId

            },
            {
                $push: {
                    "chats.$.messages": {
                        sender: senderObjectId,
                        text,
                        createdAt: new Date(),
                    },
                },
            },
        );

        const receiverHasChat = await userModel.findOne({
            _id: receiverObjectId,
            "chats.with": senderObjectId,
        });

        if (!receiverHasChat) {
            await userModel.updateOne(
                { _id: receiverObjectId },
                {
                    $push: {
                        chats: {
                            with: senderObjectId,
                            messages: [
                                {
                                    sender: senderObjectId,
                                    text,
                                    createdAt: new Date()
                                },
                            ],
                        },
                    },
                },
            );
        }



        return NextResponse.json({ success: true })


    } catch (error) {
        console.log("Send message error", error)
        return NextResponse.json({
            message: "server error"
        }, { status: 500 })
    }
}