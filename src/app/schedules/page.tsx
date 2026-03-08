"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarClock,
  User,
  Phone,
  Clock,
  Eye,
  Trash2,
  Loader2,
  Plus,
  X,
} from "lucide-react";

interface Schedule {
  id: number;
  client_name: string;
  contact: string;
  schedule_time: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function SchedulesPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [clientName, setClientName] = useState("");
  const [contact, setContact] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [status, setStatus] = useState("approve");
  const [submitting, setSubmitting] = useState(false);

  const fetchSchedules = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/schedules/",
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
        setSchedules(list);
      } else {
        setError(data.message || "Failed to fetch schedules");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setSubmitting(true);

    try {
      const res = await fetch(
        "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/schedules/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            client_name: clientName,
            contact,
            schedule_time: new Date(scheduleTime).toISOString(),
            status,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Schedule berhasil ditambahkan!", timer: 1500, showConfirmButton: false });
        setClientName("");
        setContact("");
        setScheduleTime("");
        setStatus("approve");
        setShowForm(false);
        setLoading(true);
        fetchSchedules();
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal menambahkan schedule" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (scheduleId: number) => {
    const result = await Swal.fire({
      title: "Yakin?",
      text: "Apakah kamu yakin ingin menghapus schedule ini?",
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
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/schedules/${scheduleId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Schedule berhasil dihapus!", timer: 1500, showConfirmButton: false });
        setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
      } else {
        const data = await res.json();
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal menghapus schedule" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" });
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

  const getStatusBadge = (s: string) => {
    const lower = s?.toLowerCase();
    if (lower === "approve") {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    } else if (lower === "cancel") {
      return "bg-red-100 text-red-600 border-red-200";
    } else if (lower === "pending") {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  return (
    <section className="min-h-screen bg-gray-50 px-10 py-12">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Schedules</h1>
          <p className="text-gray-500 mt-2">
            Manage client appointments and schedules
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {schedules.length} Schedules
          </span>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium
              bg-gradient-to-r from-lime-400 to-lime-600
              shadow hover:shadow-lg transition hover:scale-105 active:scale-95"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "New Schedule"}
          </button>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border shadow-sm p-8 mb-10 max-w-2xl"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CalendarClock size={22} className="text-lime-600" />
            Add New Schedule
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* CLIENT NAME */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Client Name</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                <User size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* CONTACT */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Contact</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                <Phone size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="@johndoe_ig atau 08123456789"
                  className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* SCHEDULE TIME */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Schedule Time</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                <Clock size={18} className="text-gray-400 mr-2" />
                <input
                  type="datetime-local"
                  className="w-full bg-transparent outline-none text-sm text-black"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* STATUS */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Status</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                <select
                  className="w-full bg-transparent outline-none text-sm text-black"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="approve">Approve</option>
                  <option value="pending">Pending</option>
                  <option value="cancel">Cancel</option>
                </select>
              </div>
            </div>

            {/* SUBMIT */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg text-white font-medium
                bg-gradient-to-r from-lime-400 to-lime-600
                shadow hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Schedule"}
            </motion.button>
          </form>
        </motion.div>
      )}

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

      {/* SCHEDULES TABLE */}
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
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Client Name</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Contact</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Schedule Time</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule, index) => (
                    <tr key={schedule.id} className="border-b last:border-b-0 hover:bg-lime-50/50 transition-colors group">
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-lime-100 text-lime-600 group-hover:bg-lime-200 transition-colors">
                            <User size={16} />
                          </div>
                          <span className="font-medium text-gray-800">
                            {schedule.client_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          {schedule.contact}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                          <Clock size={12} className="text-gray-400" />
                          {formatDateTime(schedule.schedule_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getStatusBadge(schedule.status)}`}>
                          {schedule.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/schedules/${schedule.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-lime-600 bg-lime-50 border border-lime-200 hover:bg-lime-100 hover:border-lime-300 transition"
                          >
                            <Eye size={13} />
                            Detail
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.id)}
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

          {schedules.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              No schedules found. Add your first schedule!
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}
