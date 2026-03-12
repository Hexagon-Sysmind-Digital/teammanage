"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Building2,
  Phone,
  PhoneCall,
  Eye,
  Trash2,
  Loader2,
  Plus,
  X,
  Facebook,
  Instagram,
  Link as LinkIcon,
  FileText,
  Tag,
} from "lucide-react";

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

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [link, setLink] = useState("");
  const [pageInsight, setPageInsight] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchLeads = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/leads/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        let list: any[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data.data)) {
          list = data.data;
        } else if (Array.isArray(data.results)) {
          list = data.results;
        } else if (data && typeof data === "object" && data.id) {
          list = [data];
        }
        setLeads(list);
      } else {
        setError(data.message || "Failed to fetch leads");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setSubmitting(true);

    const payload = {
      company_name: companyName,
      client_number: clientNumber,
      call_count: 1,
      facebook: facebook,
      instagram: instagram,
      link: link,
      page_insight: pageInsight,
      status: status,
    };

    try {
      const res = await fetch(
        "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/leads/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Lead berhasil ditambahkan!", timer: 1500, showConfirmButton: false });
        setCompanyName("");
        setClientNumber("");
        setFacebook("");
        setInstagram("");
        setLink("");
        setPageInsight("");
        setStatus("");
        setShowForm(false);
        setLoading(true);
        fetchLeads();
      } else {
        const errMsg = data.message || data.error || JSON.stringify(data);
        Swal.fire({ icon: "error", title: `Gagal (${res.status})`, text: errMsg });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (leadId: number) => {
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
    try {
      const res = await fetch(
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/leads/${leadId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Lead berhasil dihapus!", timer: 1500, showConfirmButton: false });
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
      } else {
        const data = await res.json();
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal menghapus lead" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" });
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 px-10 py-12">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Leads</h1>
          <p className="text-gray-500 mt-2">
            Manage and track marketing leads
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {leads.length} Leads
          </span>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium
              bg-gradient-to-r from-lime-400 to-lime-600
              shadow hover:shadow-lg transition hover:scale-105 active:scale-95"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "New Lead"}
          </button>
        </div>
      </div>

      {/* FORM MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50/60 shrink-0">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Megaphone size={22} className="text-lime-600" />
                  Add New Lead
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
            {/* COMPANY NAME */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Company Name</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                <Building2 size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="PT. Example Maju Bersama"
                  className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* CLIENT NUMBER */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Client Number</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                <Phone size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="081234567890"
                  className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                  value={clientNumber}
                  onChange={(e) => setClientNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* FACEBOOK */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Facebook</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                <Facebook size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="https://facebook.com/example"
                  className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
            </div>

            {/* INSTAGRAM */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Instagram</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                <Instagram size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="@example_ig"
                  className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
            </div>

            {/* LINK */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Link</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                <LinkIcon size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="https://example.com"
                  className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
            </div>

            {/* PAGE INSIGHT */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Page Insight</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                <FileText size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="15k followers"
                  className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                  value={pageInsight}
                  onChange={(e) => setPageInsight(e.target.value)}
                />
              </div>
            </div>



            {/* SUBMIT */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-lg text-white font-medium
                  bg-gradient-to-r from-lime-400 to-lime-600
                  shadow hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Lead"}
              </motion.button>
            </div>
          </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-lime-500" />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-center py-20 text-red-500">{error}</div>
      )}

      {/* LEADS TABLE */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/80">
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">#</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Company Name</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Client Number</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Calls</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Facebook</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Instagram</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Page Insight</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                    <tr key={lead.id} className="border-b last:border-b-0 hover:bg-lime-50/50 transition-colors group">
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-lime-100 text-lime-600 group-hover:bg-lime-200 transition-colors">
                            <Building2 size={16} />
                          </div>
                          <span className="font-medium text-gray-800">
                            {lead.company_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          {lead.client_number}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          <PhoneCall size={12} />
                          {lead.call_count}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Facebook size={13} className="text-blue-400 shrink-0" />
                          <span className="truncate max-w-[120px]">{lead.facebook || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Instagram size={13} className="text-pink-400 shrink-0" />
                          <span className="truncate max-w-[100px]">{lead.instagram || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <FileText size={13} className="text-purple-400 shrink-0" />
                          <span className="truncate max-w-[120px]">{lead.page_insight || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          lead.status === 'approach' ? 'bg-green-100 text-green-700' :
                          lead.status === 'deny' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          <Tag size={12} />
                          {lead.status || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/leads/${lead.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-lime-600 bg-lime-50 border border-lime-200 hover:bg-lime-100 hover:border-lime-300 transition"
                          >
                            <Eye size={13} />
                            Detail
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 transition"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leads.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              No leads found. Add your first lead!
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}
