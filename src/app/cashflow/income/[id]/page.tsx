"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CalendarClock,
  Building2,
  Briefcase,
  FileText,
  DollarSign,
  CreditCard,
  Tag,
  Wallet,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";

interface Income {
  id: number;
  detail_invoice: string;
  project_name: string;
  client_name: string;
  project_type: string;
  start_date: string;
  deadline: string;
  status_project: string;
  payment: string;
  jenis: string;
  biaya: number;
  created_at?: string;
}

export default function IncomeDetail() {
  const params = useParams();
  const router = useRouter();

  const [income, setIncome] = useState<Income | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Editable fields
  const [detailInvoice, setDetailInvoice] = useState("");
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [statusProject, setStatusProject] = useState("On Progress");
  const [payment, setPayment] = useState("");
  const [jenis, setJenis] = useState("Income");
  const [biaya, setBiaya] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchIncome = async () => {
      try {
        const res = await fetch(
          `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/incomes/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          const inc = data.data || data;
          setIncome(inc);
          setDetailInvoice(inc.detail_invoice || "");
          setProjectName(inc.project_name || "");
          setClientName(inc.client_name || "");
          setProjectType(inc.project_type || "");
          setStartDate(inc.start_date || "");
          setDeadline(inc.deadline || "");
          setStatusProject(inc.status_project || "On Progress");
          setPayment(inc.payment || "");
          setJenis(inc.jenis || "Income");
          setBiaya(String(inc.biaya || ""));
        } else {
          setError(data.message || "Failed to fetch income");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };
    fetchIncome();
  }, [params.id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    setSaving(true);
    try {
      const res = await fetch(
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/incomes/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            detail_invoice: detailInvoice,
            project_name: projectName,
            client_name: clientName,
            project_type: projectType,
            start_date: startDate,
            deadline: deadline,
            status_project: statusProject,
            payment: payment,
            jenis: jenis,
            biaya: Number(biaya),
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Income berhasil diupdate!",
          timer: 1500,
          showConfirmButton: false,
        });
        setIncome((prev) =>
          prev
            ? {
                ...prev,
                detail_invoice: detailInvoice,
                project_name: projectName,
                client_name: clientName,
                project_type: projectType,
                start_date: startDate,
                deadline: deadline,
                status_project: statusProject,
                payment: payment,
                jenis: jenis,
                biaya: Number(biaya),
              }
            : prev
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: data.message || "Gagal mengupdate income",
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
      text: "Apakah kamu yakin ingin menghapus income ini?",
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
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/incomes/${params.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Income berhasil dihapus!",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/cashflow");
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: data.message || "Gagal menghapus income",
        });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-lime-500" />
      </div>
    );
  }

  if (error || !income) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-red-500">{error || "Income not found"}</p>
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
        className="flex items-center gap-2 text-gray-500 hover:text-lime-600 mb-8 group transition"
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
              {income.project_name}
            </h1>
            <span className="text-xs px-3 py-1 rounded-full bg-lime-100 text-lime-700">
              {income.status_project}
            </span>
          </div>
          <p className="text-gray-500">
            {income.client_name} · {income.project_type} ·{" "}
            <span className="font-mono text-sm">{income.detail_invoice}</span>
          </p>
        </div>

        {/* DELETE BUTTON */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 transition text-sm font-medium disabled:opacity-50"
        >
          <Trash2 size={16} />
          {deleting ? "Deleting..." : "Delete Income"}
        </button>
      </div>

      {/* INFO CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {/* AMOUNT CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-lime-100 text-lime-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Amount</p>
            <p className="text-lg font-semibold text-gray-800">
              Rp {Number(income.biaya || 0).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* CLIENT CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Client</p>
            <p className="text-lg font-semibold text-gray-800">
              {income.client_name}
            </p>
          </div>
        </div>

        {/* START DATE CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Start Date</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatDate(income.start_date)}
            </p>
          </div>
        </div>

        {/* DEADLINE CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
            <CalendarClock size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Deadline</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatDate(income.deadline)}
            </p>
          </div>
        </div>
      </div>

      {/* UPDATE FORM */}
      <div className="bg-white rounded-2xl border shadow-sm p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Wallet size={22} className="text-lime-600" />
          Update Income
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* DETAIL INVOICE */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Detail Invoice</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
              <FileText size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                value={detailInvoice}
                onChange={(e) => setDetailInvoice(e.target.value)}
                required
              />
            </div>
          </div>

          {/* PROJECT NAME */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Project Name</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
              <Briefcase size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* CLIENT NAME */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Client Name</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
              <Building2 size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* PROJECT TYPE */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Project Type</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
              <Tag size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                required
              />
            </div>
          </div>

          {/* START DATE */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Start Date</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
              <Calendar size={18} className="text-gray-400 mr-2" />
              <input
                type="date"
                className="w-full bg-transparent outline-none text-sm text-black"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* DEADLINE */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Deadline</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
              <CalendarClock size={18} className="text-gray-400 mr-2" />
              <input
                type="date"
                className="w-full bg-transparent outline-none text-sm text-black"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>

          {/* STATUS PROJECT */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Project Status</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
              <Tag size={18} className="text-gray-400 mr-2" />
              <select
                className="w-full bg-transparent outline-none text-sm text-black appearance-none"
                value={statusProject}
                onChange={(e) => setStatusProject(e.target.value)}
                required
              >
                <option value="On Progress">On Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Payment</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
              <CreditCard size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                required
              />
            </div>
          </div>

          {/* JENIS */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Jenis</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
              <Wallet size={18} className="text-gray-400 mr-2" />
              <select
                className="w-full bg-transparent outline-none text-sm text-black appearance-none"
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                required
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
          </div>

          {/* BIAYA */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Biaya (Amount)</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
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
              bg-gradient-to-r from-lime-400 to-lime-600
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
