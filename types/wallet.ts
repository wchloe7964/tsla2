// types/wallet.ts

export type TransactionStatus = "pending" | "completed" | "failed" | "reversed";
export type TransactionType = "deposit" | "withdrawal" | "yield" | "transfer";

export interface Transaction {
  _id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  evidenceUrl?: string; // For the Cloudinary receipt
  date?: string;
  createdAt: string;
  updatedAt: string;
}
