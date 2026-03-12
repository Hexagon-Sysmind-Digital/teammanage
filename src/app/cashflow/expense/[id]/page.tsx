"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  DollarSign,
  Tag,
  TrendingDown,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";

interface Expense {
  id: number;
  jenis: string;
  detail: string;
  biaya: number;
  created_at?: string;
}

export default function ExpenseDetail() {
  const params = useParams();
  const router = useRouter();

  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Editable fields
  const [jenis, setJenis] = useState("");
  const [detail, setDetail] = useState("");
  const [biaya, setBiaya] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchExpense = async () => {
      try {
        const res = await fetch(
          `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/expenses/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          const exp = data.data || data;
          setExpense(exp);
          setJenis(exp.jenis || "");
          setDetail(exp.detail || "");
          setBiaya(String(exp.biaya || ""));
        } else {
          setError(data.message || "Failed to fetch expense");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [params.id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    setSaving(true);
    try {
      const res = await fetch(
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/expenses/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jenis: jenis,
            detail: detail,
            biaya: Number(biaya),
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Expense berhasil diupdate!",
          timer: 1500,
          showConfirmButton: false,
        });
        setExpense((prev) =>
          prev
            ? {
                ...prev,
                jenis: jenis,
                detail: detail,
                biaya: Number(biaya),
              }
            : prev
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: data.message || "Gagal mengupdate expense",
        });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Yakin?",
      text: "Apakah kamu yakin ingin menghapus expense ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;

    const token = localStorage.getItem("token");
    setDeleting(true);
    try {
      const res = await fetch(
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/expenses/${params.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Expense berhasil dihapus!",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/cashflow");
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: data.message || "Gagal menghapus expense",
        });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-red-500" />
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-red-500">{error || "Expense not found"}</p>
        <Link href="/cashflow" className="text-lime-600 hover:underline">
          ← Back to Cashflow
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-10 py-12">
      {/* BACK BUTTON */}
      <Link
        href="/cashflow"
        className="flex items-center gap-2 text-gray-500 hover:text-red-500 mb-8 group transition"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Cashflow
      </Link>

      {/* HEADER */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-800">
              {expense.detail}
            </h1>
            <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700">
              {expense.jenis}
            </span>
          </div>
          <p className="text-gray-500">
            Expense #{expense.id}
          </p>
        </div>

        {/* DELETE BUTTON */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 transition text-sm font-medium disabled:opacity-50"
        >
          <Trash2 size={16} />
          {deleting ? "Deleting..." : "Delete Expense"}
        </button>
      </div>

      {/* INFO CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {/* AMOUNT CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-100 text-red-500">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Amount</p>
            <p className="text-lg font-semibold text-gray-800">
              Rp {Number(expense.biaya || 0).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* JENIS CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
            <Tag size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Jenis</p>
            <p className="text-lg font-semibold text-gray-800 capitalize">
              {expense.jenis}
            </p>
          </div>
        </div>

        {/* DETAIL CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Detail</p>
            <p className="text-lg font-semibold text-gray-800">
              {expense.detail}
            </p>
          </div>
        </div>
      </div>

      {/* UPDATE FORM */}
      <div className="bg-white rounded-2xl border shadow-sm p-8 max-w-2xl">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingDown size={22} className="text-red-500" />
          Update Expense
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* JENIS */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Jenis</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-red-400 transition">
              <Tag size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                required
              />
            </div>
          </div>

          {/* DETAIL */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Detail</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-red-400 transition">
              <FileText size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* BIAYA */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Biaya (Amount)</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-red-400 transition">
              <DollarSign size={18} className="text-gray-400 mr-2" />
              <input
                type="number"
                className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                value={biaya}
                onChange={(e) => setBiaya(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-6">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpdate}
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-white font-medium
              bg-gradient-to-r from-red-400 to-red-600
              shadow hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
