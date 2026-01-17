import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '');

export async function POST(req: NextRequest) {
  try {
    // 1. Ensure Cloudinary is configured with current env variables
    if (!process.env.CLOUDINARY_API_KEY) {
      console.error("CRITICAL: Cloudinary API Key is missing from .env");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });

    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const formData = await req.formData();
    
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;

    if (!file || !documentType) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // 2. Convert file to Buffer for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Upload to Cloudinary using a promise-wrapped stream
    const uploadResponse: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'kyc_documents', 
          resource_type: 'auto', // 'auto' handles PDF, PNG, and JPG
          public_id: `user_${payload.userId}_${Date.now()}` // Ensures unique filenames
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Stream Error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      uploadStream.end(buffer);
    });

    // 4. Update User in DB
    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(
      payload.userId, 
      {
        $set: {
          kycLevel: 'PENDING',
          // Using dot notation preserves other kycData fields (like rejectionReason)
          'kycData.documentType': documentType,
          'kycData.documentUrl': uploadResponse.secure_url,
          'kycData.submittedAt': new Date()
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Documents uploaded and pending review' 
    });

  } catch (error: any) {
    console.error('KYC Submission Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Submission failed' 
    }, { status: 500 });
  }
}