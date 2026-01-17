import { NextResponse } from 'next/server';
import { verifyMessage } from 'ethers'; // or '@solana/web3.js' for Solana

export async function POST(req: Request) {
  try {
    const { address, signature, message } = await req.json();

    // Verify the signature
    // The message usually contains a nonce to prevent replay attacks
    const recoveredAddress = verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: "Signature verification failed" }, { status: 401 });
    }

    /**
     * DB ACTION:
     * await db.wallet.create({ data: { address, userId, status: 'WHITELISTED' } })
     */

    return NextResponse.json({ 
      success: true, 
      verifiedAddress: recoveredAddress 
    });
  } catch (error) {
    return NextResponse.json({ error: "Cryptographic verification error" }, { status: 500 });
  }
}