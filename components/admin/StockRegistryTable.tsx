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
  const downloadCertificate = async (stock: StockAllocation) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    try {
      // 1. ASSET PREPARATION
      // Note: Switched SVG path fill to #FFFFFF for dark mode visibility
      const svgString = `<svg viewBox="0 0 342 35" xmlns="http://www.w3.org/2000/svg"><path fill="#FFFFFF" d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7M308.5 7h26a9.6 9.6 0 0 0 7-7h-40a9.6 9.6 0 0 0 7 7"></path></svg>`;

      const [pngData, signatureImg] = await Promise.all([
        new Promise<string>((resolve) => {
          const imageElement = new Image();
          const svgBlob = new Blob([svgString], {
            type: "image/svg+xml;charset=utf-8",
          });
          const url = URL.createObjectURL(svgBlob);
          imageElement.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 1710;
            canvas.height = 175;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(imageElement, 0, 0, 1710, 175);
            resolve(canvas.toDataURL("image/png"));
          };
          imageElement.src = url;
        }),
        new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = "/sign.png";
        }),
      ]);

      // 2. SET DARK BACKGROUND
      doc.setFillColor(18, 18, 18); // Deep Charcoal
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // 3. MINIMALIST HEADER
      const logoW = 35;
      const logoH = 3.6;
      doc.addImage(pngData, "PNG", 25, 30, logoW, logoH);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(90, 90, 90); // Dimmer grey for metadata
      doc.text("EQUITY MANAGEMENT DIVISION", pageWidth - 25, 33, {
        align: "right",
        charSpace: 2,
      });

      // 4. MAIN TITLE AREA
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text("SHARE ALLOCATION", 25, 60, { charSpace: 1 });

      doc.setDrawColor(227, 25, 55); // Tesla Red accent line
      doc.setLineWidth(1.2);
      doc.line(25, 65, 50, 65);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text(`LEDGER HASH: ${stock._id.toUpperCase()}`, 25, 75);

      // 5. PREMIUM DARK TABLE
      autoTable(doc, {
        startY: 90,
        margin: { left: 25, right: 25 },
        body: [
          ["SHAREHOLDER", stock.userId?.name.toUpperCase() || "UNREGISTERED"],
          ["CLASS", `COMMON STOCK / ${stock.symbol}`],
          ["VOLUME", `${stock.shares.toLocaleString()} UNITS`],
          ["ENTRY", `$${stock.entryPrice.toFixed(2)} USD`],
          [
            "TOTAL VALUE",
            `$${(stock.shares * stock.entryPrice).toLocaleString()} USD`,
          ],
          ["LEDGER STATUS", "ENCRYPTED / VERIFIED"],
        ],
        theme: "plain",
        styles: {
          font: "helvetica",
          fontSize: 10,
          cellPadding: 8,
          textColor: [220, 220, 220], // Light grey text
          lineColor: [40, 40, 40], // Darker separator lines
          lineWidth: 0.1,
        },
        columnStyles: {
          0: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 40 },
        },
      });

      // 6. REDESIGNED SIGNATURE & STAMP
      const finalY = (doc as any).lastAutoTable.finalY + 30;

      // Signature Area
      // Note: If sign.png has a white background, it might need to be inverted or use a transparent PNG
      doc.addImage(signatureImg, "PNG", pageWidth - 70, finalY - 15, 30, 12);
      doc.setDrawColor(60, 60, 60);
      doc.setLineWidth(0.2);
      doc.line(pageWidth - 75, finalY, pageWidth - 25, finalY);

      doc.setTextColor(120, 120, 120);
      doc.setFontSize(7);
      doc.text("AUTHORIZED SIGNATURE / CTO", pageWidth - 50, finalY + 5, {
        align: "center",
      });

      // Cyber Stamp (Bottom Left)
      doc.setDrawColor(227, 25, 55);
      doc.rect(25, finalY - 5, 32, 12);
      doc.setTextColor(227, 25, 55);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("INTERNAL USE", 41, finalY, { align: "center" });
      doc.text("GENESIS REGISTER", 41, finalY + 4, { align: "center" });

      // Legal Footer
      doc.setTextColor(70, 70, 70);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      const legalNote =
        "This is a secured digital certificate. Possession of this document does not constitute ownership of shares outside the company's internal registry. Unauthorized reproduction is strictly prohibited and tracked via internal DocID.";
      doc.text(
        doc.splitTextToSize(legalNote, pageWidth - 50),
        25,
        pageHeight - 15,
      );

      doc.save(
        `TSLA_CARBON_${stock.userId?.name.split(" ")[0].toUpperCase()}.pdf`,
      );
    } catch (err) {
      console.error("PDF Error:", err);
      alert("Generation failed. Check console.");
    }
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
