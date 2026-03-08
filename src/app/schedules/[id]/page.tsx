"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarClock,
  User,
  Phone,
  Clock,
  Trash2,
  Save,
  Loader2,
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

export default function ScheduleDetail() {
  const params = useParams();
  const router = useRouter();

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Editable fields
  const [clientName, setClientName] = useState("");
  const [contact, setContact] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [status, setStatus] = useState("approve");

  useEffect(() => {
    const fetchSchedule = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/schedules/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          const s = data.data || data;
          setSchedule(s);
          setClientName(s.client_name || "");
          setContact(s.contact || "");
          // Convert to datetime-local format
          if (s.schedule_time) {
            const dt = new Date(s.schedule_time);
            const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 16);
            setScheduleTime(local);
          }
          setStatus(s.status || "approve");
        } else {
          setError(data.message || "Failed to fetch schedule");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [params.id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    setSaving(true);

    try {
      const res = await fetch(
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/schedules/${params.id}`,
        {
          method: "PUT",
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
        Swal.fire({ icon: "success", title: "Berhasil", text: "Schedule berhasil diupdate!", timer: 1500, showConfirmButton: false });
        setSchedule((prev) =>
          prev
            ? { ...prev, client_name: clientName, contact, schedule_time: new Date(scheduleTime).toISOString(), status }
            : prev
        );
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal mengupdate schedule" });
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
    setDeleting(true);
    try {
      const res = await fetch(
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/schedules/${params.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Schedule berhasil dihapus!", timer: 1500, showConfirmButton: false });
        router.push("/schedules");
      } else {
        const data = await res.json();
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal menghapus schedule" });
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

  const getStatusBadge = (s: string) => {
    const lower = s?.toLowerCase();
    if (lower === "approve") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (lower === "cancel") return "bg-red-100 text-red-600 border-red-200";
    if (lower === "pending") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-lime-500" />
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-red-500">{error || "Schedule not found"}</p>
        <Link href="/schedules" className="text-lime-600 hover:underline">
          ← Back to Schedules
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-10 py-12">
      {/* BACK */}
      <Link
        href="/schedules"
        className="flex items-center gap-2 text-gray-500 hover:text-lime-600 mb-8 group transition"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Schedules
      </Link>

      {/* HEADER */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-800">
              {schedule.client_name}
            </h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusBadge(schedule.status)}`}>
              {schedule.status}
            </span>
          </div>
          <p className="text-gray-500">
            Schedule #{schedule.id} · {formatDateTime(schedule.created_at)}
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
        {/* CLIENT */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-lime-100 text-lime-600">
            <User size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Client</p>
            <p className="text-lg font-semibold text-gray-800">
              {schedule.client_name}
            </p>
          </div>
        </div>

        {/* CONTACT */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <Phone size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Contact</p>
            <p className="text-lg font-semibold text-gray-800">
              {schedule.contact}
            </p>
          </div>
        </div>

        {/* SCHEDULE TIME */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Schedule Time</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatDateTime(schedule.schedule_time)}
            </p>
          </div>
        </div>
      </div>

      {/* UPDATE FORM */}
      <div className="bg-white rounded-2xl border shadow-sm p-8 max-w-2xl">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <CalendarClock size={22} className="text-lime-600" />
          Update Schedule
        </h3>

        <div className="space-y-5">

          {/* CLIENT NAME */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <User size={16} className="text-gray-400" /> Client Name
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
          </div>

          {/* CONTACT */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <Phone size={16} className="text-gray-400" /> Contact
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm text-black"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          </div>

          {/* SCHEDULE TIME */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <Clock size={16} className="text-gray-400" /> Schedule Time
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <input
                type="datetime-local"
                className="w-full bg-transparent outline-none text-sm text-black"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <CalendarClock size={16} className="text-gray-400" /> Status
            </label>
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
