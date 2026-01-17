"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Clock,
  Download,
  ArrowDownLeft,
  Plus,
  Loader2,
  FileText,
  ExternalLink,
} from "lucide-react";
import TransactionSuccess from "./TransactionSuccess";
import { formatCurrency } from "@/lib/utils/format";
import { Transaction } from "@/types/wallet";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export default function HistoryModal({
  isOpen,
  onClose,
  transactions,
}: HistoryModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleDownload = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A0A0A] shadow-2xl transition-all animate-in fade-in zoom-in duration-300">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

        <div className="p-8">
          {isSuccess ? (
            <TransactionSuccess
              amount={transactions.length.toString()}
              type="deposit"
              onClose={handleClose}
            />
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-500 mb-2 italic">
                    Money Flow
                  </p>
                  <h3 className="text-3xl font-light tracking-tight text-white">
                    My History
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* Transactions List */}
              <div className="space-y-4 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {transactions.length > 0 ? (
                  transactions.map((tx: any) => (
                    <div
                      key={tx._id}
                      className="flex flex-col p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                              tx.type === "deposit" || tx.type === "yield"
                                ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                                : "bg-white/5 border-white/10 text-gray-400"
                            }`}>
                            {tx.type === "deposit" ? (
                              <Plus size={18} />
                            ) : tx.type === "withdrawal" ? (
                              <ArrowDownLeft size={18} />
                            ) : (
                              <Clock size={18} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-100 italic uppercase tracking-tighter">
                              {tx.description}
                            </p>
                            <p className="text-[10px] text-gray-500 font-black mt-0.5 uppercase">
                              {new Date(
                                tx.date || tx.createdAt
                              ).toLocaleDateString()}{" "}
                              • {tx.status}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`text-sm font-black italic ${
                            tx.type === "deposit" || tx.type === "yield"
                              ? "text-blue-400"
                              : "text-white"
                          }`}>
                          {tx.type === "deposit" || tx.type === "yield"
                            ? "+"
                            : "-"}
                          {formatCurrency(tx.amount)}
                        </p>
                      </div>

                      {/* CLOUDINARY RECEIPT VIEW */}
                      {tx.evidenceUrl && (
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <FileText size={12} className="text-blue-500" />
                            <span className="text-[9px] font-black uppercase text-gray-500 italic">
                              Receipt attached
                            </span>
                          </div>
                          <a
                            href={tx.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[9px] font-black uppercase text-blue-400 bg-blue-500/5 px-3 py-1.5 rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                            View Proof
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <p className="text-xs text-gray-600 font-black uppercase tracking-widest italic opacity-50">
                      No money flow yet
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleDownload}
                disabled={loading || transactions.length === 0}
                className="group w-full bg-white text-black h-16 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-2 hover:bg-gray-100 disabled:opacity-30 transition-all active:scale-[0.98]">
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Download Statements
                    <Download
                      size={16}
                      className="group-hover:translate-y-0.5 transition-transform"
                    />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
