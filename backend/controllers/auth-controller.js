import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../libs/send-email.js";
import aj from "../libs/arcjet.js";
import PendingUser from "../models/pending-user.js";
import Verification from "../models/verification.js";

const registerUser = async (req, res) => { 

    try {
      const { username, email, password } = req.body;

      const decision = await aj.protect(req, {
        email,
        requested:1,
      });
        console.log("Arcjet decision:", decision.isDenied());

          if (decision.isDenied()) {
              return res.status(403).json({
                message: "Invalid email address"
            });
          }
        
        console.log("Request Body:", req.body);
        console.log("Username:", username);
        console.log("Email:", email);
        console.log("Password received:", Boolean(password));

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt);

      const verificationToken = jwt.sign(
        {
          email,
            purpose: "email-verification",
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h",
        }
      );

       //send email to user for verification 
      const verificationLink =
       `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
      const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
      const emailSubject = "Verify your email";

      const emailSent = await sendEmail(email, emailSubject, emailBody);

      console.log("Email sent:", emailSent);

      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send verification email" });
      }

      await PendingUser.findOneAndUpdate({
        email},
        {
        username,
        email,
        password: hashedPassword,
        verificationToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
      {
        upsert: true,
        new: true,
      });


        return res.status(201).json({ message: "Verification email sent to your email." });
      
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
  
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("LOGIN START");

    // Find the user and include the password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== "email-verification") {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    const pendingUser = await PendingUser.findOne({
      verificationToken: token,
    });

    if (!pendingUser) {
      return res.status(400).json({
        message: "Verification token expired",
      });
    }

    const existingUser = await User.findOne({
      email: pendingUser.email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    await User.create({
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.password,
      isEmailVerified: true,

    });

    await PendingUser.deleteOne({
      _id: pendingUser._id,
    });

    return res.status(200).json({
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: "Invalid or expired token",
    });
  }
};

const resetPasswordRequest = async (req, res) => {
  console.log("Reset password request received");
  try {
    const { email } = req.body;

    console.log("1. Email:", email);

    const user = await User.findOne({ email });
    console.log("2. User:", user);

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }

    console.log("3. Verified:", user.isEmailVerified);

    if (!user.isEmailVerified) {
      console.log("Email not verified");
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

    const existingVerification = await Verification.findOne({
      userId: user._id,
    });

    console.log("4. Existing verification:", existingVerification);

    if(existingVerification && existingVerification.expiresAt > new Date()){
      return res.status(400).json({
        message: "Reset password request already sent",
      });
    }
    if (existingVerification && existingVerification.expiresAt < new Date()){
      await Verification.findByIdAndDelete({ _id: existingVerification._id});
    }

    const resetPasswordToken = jwt.sign(
      {
        userId: user._id,
        purpose: "reset-password",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    await Verification.create({
      userId: user._id,
      token: resetPasswordToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetPasswordLink =`${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`;
    
    const emailBody = `<p>Click <a href="${resetPasswordLink}">here</a> to reset your password.</p>`;
    const emailSubject = "Reset your password"

    const isEmailSent = await sendEmail (email, emailSubject, emailBody);

    if(!isEmailSent){
      return res.status(500).json({
        message: "Failed to send reset password email",
      });
    }
    
    res.status(200).json({ message: "Reset password email sent "});

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = payload;

    const verification = await Verification.findOne({
      userId,
      token,
    });

    if (!verification) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const isTokenExpired =
      verification.expiresAt < new Date();

    if (isTokenExpired) {
      return res.status(400).json({
        message: "Token expired",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    return res.status(200).json({
      message: "Password reset successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  registerUser,
  loginUser,
  verifyEmail,
  resetPasswordRequest,
  verifyResetPasswordTokenAndResetPassword
};