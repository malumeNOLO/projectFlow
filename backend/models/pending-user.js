import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    verificationToken: {
        type: String,
        required: true,
    },

    expiresAt: {
        type: Date,
        required: true,
    },
});

export default mongoose.model("PendingUser", pendingUserSchema);