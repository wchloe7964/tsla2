import { NextRequest, NextResponse, userAgent } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import Session from "@/lib/models/Session";
import { verifyPassword, generateToken } from "@/lib/utils/auth";
import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup.string().required("Password required"),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    try {
      await loginSchema.validate(body);
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: body.email.toLowerCase().trim(),
    }).select("+password");

    if (!user || !(await verifyPassword(body.password, user.password))) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const { browser, os } = userAgent(request);
    const deviceString = `${browser.name || "Unknown"} on ${
      os.name || "Unknown OS"
    }`;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    let location = "Unknown";
    if (ip !== "127.0.0.1" && ip !== "::1") {
      try {
        const geoRes = await fetch(
          `http://ip-api.com/json/${ip}?fields=city,country`
        );
        const geoData = await geoRes.json();
        if (geoData.city && geoData.country)
          location = `${geoData.city}, ${geoData.country}`;
      } catch (e) {
        console.error("Geo error:", e);
      }
    }

    user.lastLogin = new Date();
    await User.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    const token = await generateToken(user._id.toString(), user.role);

    await Session.create({
      userId: user._id,
      token: token,
      device: deviceString,
      ip: ip,
      location: location,
      lastActive: new Date(),
    });

    // Complete User Object for Frontend
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        wallet: user.wallet,
        portfolio: user.portfolio,
        preferences: user.preferences,
        kycLevel: user.kycLevel || "LEVEL_1",
        twoFactorEnabled: !!user.twoFactorEnabled,
      },
    });

    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
