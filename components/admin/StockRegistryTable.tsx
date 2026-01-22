"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Trash2,
  Edit3,
  ChevronDown,
  FileDown,
  ShieldCheck,
  X,
  Check,
  Loader2,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface StockAllocation {
  _id: string;
  symbol: string;
  shares: number;
  entryPrice: number;
  userId?: {
    name: string;
    email: string;
  };
}

export default function StockRegistryTable({
  initialStocks,
}: {
  initialStocks: StockAllocation[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSymbol, setFilterSymbol] = useState("ALL");
  const [stocks, setStocks] = useState(initialStocks);

  // State for inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  // --- DELETE LOGIC ---
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently remove this shareholder position?",
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/assign-stock/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`Ledger Error: ${data.error || "Unknown server error"}`);
      } else {
        setStocks(stocks.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // --- UPDATE LOGIC ---
  const startEditing = (stock: StockAllocation) => {
    setEditingId(stock._id);
    setEditValue(stock.shares.toString());
  };

  const handleUpdate = async (id: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/assign-stock/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shares: Number(editValue) }),
      });

      if (res.ok) {
        setStocks(
          stocks.map((s) =>
            s._id === id ? { ...s, shares: Number(editValue) } : s,
          ),
        );
        setEditingId(null);
      }
    } catch (err) {
      alert("Update failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- PDF GENERATION ---
  const downloadCertificate = (stock: StockAllocation) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setDrawColor(20, 20, 20);
    doc.setLineWidth(0.8);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    doc.setLineWidth(0.2);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(227, 25, 55);
    doc.text("TESLA", pageWidth / 2, 35, { align: "center", charSpace: 3 });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("OFFICIAL SECURITIES & EQUITY DISCLOSURE", pageWidth / 2, 42, {
      align: "center",
    });

    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFICATE OF SHARE ALLOCATION", pageWidth / 2, 60, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const bodyText = `This document serves as official confirmation of securities allocation within the company's private ledger. The shares described below have been legally assigned to the designated shareholder and are subject to the governing terms of the Equity Incentive Plan.`;
    const splitText = doc.splitTextToSize(bodyText, pageWidth - 60);
    doc.text(splitText, 30, 75);

    autoTable(doc, {
      startY: 95,
      margin: { left: 30, right: 30 },
      head: [["SECURITIES DESCRIPTION", "REGISTRATION DETAILS"]],
      body: [
        ["Legal Shareholder", stock.userId?.name.toUpperCase() || "N/A"],
        ["Registered Email", stock.userId?.email || "N/A"],
        ["Asset Class", `Common Stock (${stock.symbol})`],
        ["Share Quantity", `${stock.shares.toLocaleString()} SHARES`],
        ["Issue Price", `$${stock.entryPrice.toFixed(2)} USD`],
        [
          "Total Principal Value",
          `$${(stock.shares * stock.entryPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD`,
        ],
        [
          "Effective Date",
          new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        ],
      ],
      theme: "striped",
      styles: { font: "helvetica", fontSize: 9, cellPadding: 6 },
      headStyles: {
        fillStyle: [30, 30, 30],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 50 } },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 25;
    doc.setDrawColor(227, 25, 55);
    doc.circle(45, finalY + 15, 12);
    doc.setFontSize(7);
    doc.setTextColor(227, 25, 55);
    doc.text("VERIFIED", 45, finalY + 14, { align: "center" });
    doc.text("EQUITY", 45, finalY + 18, { align: "center" });

    doc.setDrawColor(180);
    doc.line(pageWidth - 90, finalY + 20, pageWidth - 30, finalY + 20);
    doc.setFontSize(8);
    doc.setTextColor(40);
    doc.text("Authorized Signature", pageWidth - 60, finalY + 25, {
      align: "center",
    });
    doc.setFontSize(6);
    doc.setTextColor(150);
    doc.text(`DocID: ${stock._id.toUpperCase()}`, pageWidth - 60, finalY + 29, {
      align: "center",
    });

    doc.setFontSize(7);
    doc.setTextColor(180);
    doc.text(
      "PRIVATE & CONFIDENTIAL - INTERNAL SHAREHOLDER LEDGER",
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" },
    );

    doc.save(
      `Share_Certificate_${stock.symbol}_${stock.userId?.name.replace(/\s+/g, "_")}.pdf`,
    );
  };

  const uniqueSymbols = useMemo(() => {
    const symbols = stocks.map((s) => s.symbol);
    return ["ALL", ...Array.from(new Set(symbols))];
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const matchesSearch =
        stock.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.userId?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSymbolFilter =
        filterSymbol === "ALL" || stock.symbol === filterSymbol;
      return matchesSearch && matchesSymbolFilter;
    });
  }, [searchTerm, filterSymbol, stocks]);

  return (
    <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl mt-10">
      <div className="p-8 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
            Corporate Shareholder Ledger
          </h3>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
            {filteredStocks.length} Verified Holdings
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
              size={14}
            />
            <input
              type="text"
              placeholder="Search Shareholders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
            />
          </div>

          <div className="relative">
            <select
              value={filterSymbol}
              onChange={(e) => setFilterSymbol(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-2xl py-3 pl-6 pr-10 text-[10px] font-black uppercase tracking-widest text-zinc-400 outline-none focus:border-blue-500/50 cursor-pointer">
              {uniqueSymbols.map((sym) => (
                <option key={sym} value={sym} className="bg-[#0a0a0a]">
                  {sym}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
              size={12}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 border-b border-white/5">
              <th className="px-8 py-5 font-black">Legal Shareholder</th>
              <th className="px-8 py-5 font-black">Ticker</th>
              <th className="px-8 py-5 font-black">Position Size</th>
              <th className="px-8 py-5 font-black text-right">
                Ledger Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredStocks.map((stock) => (
              <tr
                key={stock._id}
                className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-all">
                      <ShieldCheck size={14} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-tight">
                        {stock.userId?.name}
                      </p>
                      <p className="text-[9px] text-zinc-600 font-medium italic">
                        Verified Account
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="font-tesla text-white text-sm tracking-widest">
                    {stock.symbol}
                  </span>
                </td>
                <td className="px-8 py-6">
                  {editingId === stock._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="bg-white/10 border border-blue-500/50 rounded px-2 py-1 text-xs text-white w-24 outline-none"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="text-xs">
                      <p className="text-white font-mono font-bold">
                        {stock.shares.toLocaleString()} Shares
                      </p>
                      <p className="text-zinc-600 text-[10px]">
                        Cost Basis: ${stock.entryPrice.toFixed(2)}
                      </p>
                    </div>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    {editingId === stock._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(stock._id)}
                          className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg">
                          {isUpdating ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Check size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 text-zinc-500 hover:bg-white/5 rounded-lg">
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => downloadCertificate(stock)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 rounded-lg text-blue-400 hover:bg-blue-600 hover:text-white transition-all border border-blue-600/20">
                          <FileDown size={14} />
                          <span className="text-[9px] font-black uppercase tracking-tighter">
                            Issue Statement
                          </span>
                        </button>
                        <button
                          onClick={() => startEditing(stock)}
                          className="p-2 bg-white/5 rounded-lg text-zinc-600 hover:text-white transition-colors border border-white/5">
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(stock._id)}
                          className="p-2 bg-white/5 rounded-lg text-zinc-600 hover:text-rose-500 transition-colors border border-white/5">
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
