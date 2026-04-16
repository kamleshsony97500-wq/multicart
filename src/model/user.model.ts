import mongoose, { mongo } from "mongoose";


export interface IUser {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password?: string;    // hoga bhi nahi bhi hoga // optional nahi hai (?)
    image?: string;
    phone?: string;
    role: "user" | "vendor" | "admin";


    // for vendor ke liye //
    shopName?: string;
    shopAddress?: string;
    gstNumber?: string;
    isApproved?: boolean;
    verificationStatus: "pending" | "approved" | "rejected";
    approvedAt: Date;
    requestedAt: Date;
    rejectedReason?: string;


    vendorProducts?: mongoose.Types.ObjectId[]; // vendor ke products ke references
    orders?: mongoose.Types.ObjectId[]; // user ke orders ke references


    cart?: {
        product: mongoose.Schema.Types.ObjectId; // product ke reference
        quantity: number;
    }[]; // user ke cart items ke references


    // for supportChats ke liye only //
    chats?: {
        with: mongoose.Types.ObjectId;  // ki user ke sath chat
        messages: {
            sender: mongoose.Types.ObjectId; // kisne message bheja
            text: string;
            createdAt: Date;
        }[];



        cretaedAt?: Date;
        updatedAt?: Date;
    }


}


const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String },

    image: { type: String },

    phone: { type: String },

    role: {
        type: String,
        enum: ["user", "vendor", "admin"],
        default: "user"
    },

    // for vendor ke liye //
    shopName: { type: String },
    shopAddress: { type: String },
    gstNumber: { type: String },
    isApproved: { type: Boolean, default: false },
    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    approvedAt: { type: Date },
    requestedAt: { type: Date },
    rejectedReason: { type: String },

    vendorProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ], // vendor ke products ke references

    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Orders"
        }
    ], // user ke orders ke references

    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: { type: Number, default: 1 }
        }

    ],

    chats: [
        {
            with: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            messages: [
                {
                    sender: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                        required: true
                    },
                    text: {
                        type: String,
                        required: true

                    },
                    createdAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
        },
    ],


}, { timestamps: true })

const userModel = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);
export default userModel;