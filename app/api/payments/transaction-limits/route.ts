import { NextResponse } from 'next/server';

export async function GET() {
  // 1. Fetch user from DB with their KYC level
  const user = { kycLevel: 'LEVEL_2' }; // Mock: LEVEL_1, LEVEL_2, PRO

  const limits = {
    LEVEL_1: { daily: 1000, monthly: 5000, method: 'Mobile Wallet Only' },
    LEVEL_2: { daily: 10000, monthly: 50000, method: 'Bank & Mobile' },
    PRO: { daily: 250000, monthly: 1000000, method: 'All Methods' }
  };

  const currentLimit = limits[user.kycLevel as keyof typeof limits];

  return NextResponse.json({
    kycLevel: user.kycLevel,
    limits: currentLimit,
    canUpgrade: user.kycLevel !== 'PRO'
  });
}