"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Megaphone,
  Building2,
  Phone,
  PhoneCall,
  Clock,
  Trash2,
  Save,
  FileText,
  Tag,
} from "lucide-react";
import CustomLoading from "../../../components/CustomLoading";

interface Lead {
  id: number;
  company_name: string;
  client_number: string;
  call_count: number;
  facebook: string;
  instagram: string;
  link: string;
  page_insight: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function LeadDetail() {
  const params = useParams();
  const router = useRouter();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Editable fields
  const [companyName, setCompanyName] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [callCount, setCallCount] = useState(0);
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [link, setLink] = useState("");
  const [pageInsight, setPageInsight] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchLead = async () => {
      const minimumDelay = new Promise(resolve => setTimeout(resolve, 2000));
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/leads/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          const l = data.data || data;
          setLead(l);
          setCompanyName(l.company_name || "");
          setClientNumber(l.client_number || "");
          setCallCount(l.call_count || 0);
          setFacebook(l.facebook || "");
          setInstagram(l.instagram || "");
          setLink(l.link || "");
          setPageInsight(l.page_insight || "");
          setStatus(l.status || "");
        } else {
          setError(data.message || "Failed to fetch lead");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        await minimumDelay;
        setLoading(false);
      }
    };
    fetchLead();
  }, [params.id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    setSaving(true);

    try {
      const res = await fetch(
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/leads/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            company_name: companyName,
            client_number: clientNumber,
            call_count: callCount,
            facebook: facebook,
            instagram: instagram,
            link: link,
            page_insight: pageInsight,
            status: status,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Lead berhasil diupdate!", timer: 1500, showConfirmButton: false });
        const l = data.data || data;
        setLead((prev) =>
          prev
            ? { ...prev, company_name: companyName, client_number: clientNumber, call_count: callCount, facebook: facebook, instagram: instagram, link: link, page_insight: pageInsight, status: status }
            : prev
        );
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal mengupdate lead" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" });
    } finally {
      setSaving(false);
    }
  };

  const handleIncrementCall = async () => {
    const newCount = callCount + 1;
    setCallCount(newCount);
    const token = localStorage.getItem("token");
    setSaving(true);

    try {
      const res = await fetch(
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/leads/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            company_name: companyName,
            client_number: clientNumber,
            call_count: newCount,
            facebook: facebook,
            instagram: instagram,
            link: link,
            page_insight: pageInsight,
            status: status,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: `Call count updated to ${newCount}!`, timer: 1500, showConfirmButton: false });
        setLead((prev) =>
          prev ? { ...prev, call_count: newCount } : prev
        );
      } else {
        setCallCount(newCount - 1);
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal update call count" });
      }
    } catch (err) {
      setCallCount(newCount - 1);
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Yakin?",
      text: "Apakah kamu yakin ingin menghapus lead ini?",
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
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/leads/${params.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Lead berhasil dihapus!", timer: 1500, showConfirmButton: false });
        router.push("/leads");
      } else {
        const data = await res.json();
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal menghapus lead" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" });
    } finally {
      setDeleting(false);
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

      {/* LOADING */}
      {loading && <CustomLoading variant="inline" />}

  if (error || !lead) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-red-500">{error || "Lead not found"}</p>
        <Link href="/leads" className="text-lime-600 hover:underline">
          ← Back to Leads
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-10 py-12">
      {/* BACK */}
      <Link
        href="/leads"
        className="flex items-center gap-2 text-gray-500 hover:text-lime-600 mb-8 group transition"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Leads
      </Link>

      {/* HEADER */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-800">
              {lead.company_name}
            </h1>
          </div>
          <p className="text-gray-500">
            Lead #{lead.id} · {formatDateTime(lead.created_at)}
          </p>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 transition text-sm font-medium disabled:opacity-50"
        >
          <Trash2 size={16} />
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {/* INFO CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {/* COMPANY NAME */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-lime-100 text-lime-600">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Company</p>
            <p className="text-lg font-semibold text-gray-800">
              {lead.company_name}
            </p>
          </div>
        </div>

        {/* CLIENT NUMBER */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <Phone size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Client Number</p>
            <p className="text-lg font-semibold text-gray-800">
              {lead.client_number}
            </p>
          </div>
        </div>

        {/* CALL COUNT */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
              <PhoneCall size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Call Count</p>
              <p className="text-lg font-semibold text-gray-800">
                {callCount} Calls
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIncrementCall}
            disabled={saving}
            className="w-full py-2 bg-amber-50 text-amber-600 font-medium rounded-lg border border-amber-200 hover:bg-amber-100 transition text-sm disabled:opacity-50"
          >
            {saving ? "Processing..." : "+ Add Call"}
          </motion.button>
        </div>
      </div>

      {/* DETAILS */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Clock size={18} className="text-gray-400" /> Timeline
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="text-gray-400">Created:</span> {formatDateTime(lead.created_at)}</p>
            <p><span className="text-gray-400">Updated:</span> {formatDateTime(lead.updated_at)}</p>
          </div>
        </div>
      </div>

      {/* SOCIAL & DETAILS CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* FACEBOOK */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <Facebook size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-gray-500 text-sm">Facebook</p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {lead.facebook || '-'}
            </p>
          </div>
        </div>

        {/* INSTAGRAM */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-pink-100 text-pink-600">
            <Instagram size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-gray-500 text-sm">Instagram</p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {lead.instagram || '-'}
            </p>
          </div>
        </div>

        {/* LINK */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
            <LinkIcon size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-gray-500 text-sm">Link</p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {lead.link || '-'}
            </p>
          </div>
        </div>

        {/* PAGE INSIGHT */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
            <FileText size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-gray-500 text-sm">Page Insight</p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {lead.page_insight || '-'}
            </p>
          </div>
        </div>

        {/* STATUS */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className={`p-3 rounded-lg ${
            lead.status === 'approach' ? 'bg-green-100 text-green-600' :
            lead.status === 'deny' ? 'bg-red-100 text-red-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            <Tag size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <p className="text-lg font-semibold text-gray-800 capitalize">
              {lead.status || 'new'}
            </p>
          </div>
        </div>
      </div>

      {/* UPDATE FORM */}
      <div className="bg-white rounded-2xl border shadow-sm p-8 max-w-2xl">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Megaphone size={22} className="text-lime-600" />
          Update Lead
        </h3>

        <div className="space-y-5">

          {/* COMPANY NAME */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <Building2 size={16} className="text-gray-400" /> Company Name
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          </div>

          {/* CLIENT NUMBER */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <Phone size={16} className="text-gray-400" /> Client Number
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black"
                value={clientNumber}
                onChange={(e) => setClientNumber(e.target.value)}
              />
            </div>
          </div>

          {/* CALL COUNT */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <PhoneCall size={16} className="text-gray-400" /> Call Count
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <input
                type="number"
                min="0"
                className="w-full bg-transparent outline-none text-sm text-black"
                value={callCount}
                onChange={(e) => setCallCount(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* FACEBOOK */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <Facebook size={16} className="text-gray-400" /> Facebook
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
            </div>
          </div>

          {/* INSTAGRAM */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <Instagram size={16} className="text-gray-400" /> Instagram
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>
          </div>

          {/* LINK */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <LinkIcon size={16} className="text-gray-400" /> Link
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          </div>

          {/* PAGE INSIGHT */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <FileText size={16} className="text-gray-400" /> Page Insight
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black"
                value={pageInsight}
                onChange={(e) => setPageInsight(e.target.value)}
              />
            </div>
          </div>

          {/* STATUS */}
          <div className="space-y-3">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <Tag size={16} className="text-gray-400" /> Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus("approach")}
                className={`py-2.5 px-4 flex items-center justify-center gap-2 font-medium transition-all rounded-lg border-2 ${
                  status === "approach"
                    ? "bg-green-50 text-green-700 border-green-500 shadow-sm"
                    : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100"
                }`}
              >
                Approach
              </button>
              <button
                type="button"
                onClick={() => setStatus("deny")}
                className={`py-2.5 px-4 flex items-center justify-center gap-2 font-medium transition-all rounded-lg border-2 ${
                  status === "deny"
                    ? "bg-red-50 text-red-700 border-red-500 shadow-sm"
                    : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100"
                }`}
              >
                Deny
              </button>
            </div>
          </div>

          {/* SAVE */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
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
