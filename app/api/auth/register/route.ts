import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { generateToken, setAuthCookie } from "@/lib/utils/auth";
import * as yup from "yup";

const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address"
    ),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .required("Name is required"),
  country: yup
    .string()
    .min(2, "Country code must be 2 characters")
    .max(2, "Country code must be 2 characters")
    .required("Country is required"),
  currency: yup
    .string()
    .min(3, "Currency code must be 3 characters")
    .max(3, "Currency code must be 3 characters")
    .default("USD")
    .required("Currency is required"),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    console.log("Registration attempt:", {
      email: body.email,
      name: body.name,
      country: body.country,
    });

    // 1. Validate input
    try {
      await registerSchema.validate(body, { abortEarly: false });
    } catch (validationError: any) {
      const errors = validationError.errors || [validationError.message];
      return NextResponse.json(
        {
          success: false,
          error: errors.join(", "),
          validation: true,
        },
        { status: 400 }
      );
    }

    const email = body.email.toLowerCase().trim();

    // 2. Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This email is already registered. Please sign in or use a different email.",
        },
        { status: 409 }
      );
    }

    // 3. Create user with plain password - Mongoose will hash it in pre-save hook
    const user = await User.create({
      email,
      password: body.password, // Will be hashed by the pre-save hook
      name: body.name.trim(),
      role: "user",
      preferences: {
        currency: body.currency || "USD",
        country: body.country || "US",
        language: "en",
        theme: "dark",
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },
      wallet: {
        balance: 0,
        currency: body.currency || "USD",
        lastUpdated: new Date(),
        transactions: [], // Initialize empty transactions array
      },
      portfolio: {
        stocks: [],
        totalValue: 0,
        totalCost: 0,
        totalProfitLoss: 0,
        lastUpdated: new Date(),
      },
      kycLevel: "LEVEL_1",
      isActive: true,
      lastLogin: new Date(),
      bio: "",
      avatar: "",
      twoFactorEnabled: false,
    });

    console.log("User created successfully:", user._id);

    // 4. Generate JWT token
    const token = await generateToken(user._id.toString(), user.role);

    // 5. Prepare response data
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      wallet: user.wallet,
      portfolio: user.portfolio,
      preferences: user.preferences,
      kycLevel: user.kycLevel,
      twoFactorEnabled: user.twoFactorEnabled,
      avatar: user.avatar,
      bio: user.bio,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    };

    // 6. Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        user: userResponse,
        message: "Registration successful! Welcome to your dashboard.",
      },
      { status: 201 }
    );

    // 7. Set authentication cookie
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration API error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        {
          success: false,
          error: errors.join(", "),
          validation: true,
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "This email is already registered. Please sign in instead.",
        },
        { status: 409 }
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        success: false,
        error:
          "Registration failed due to a server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
