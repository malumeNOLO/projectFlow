import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    username: {
        type: String,
        required: true,
        trim: true  
    },
    profilePicture: {
        type: String,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
    },
    is2FAEnabled: {
        type: Boolean,
        default: false
    },
    twoFAOtp : {
        type: String,
        select: false
    },
    twoFAOtpExpiry: {
        type: Date,
    }
}, {
    timestamps: true
}); 
const User = mongoose.model("User", userSchema);

export default User;