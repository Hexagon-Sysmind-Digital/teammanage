"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  FileText,
  User,
  Clock,
  Loader2,
  Plus,
  X,
} from "lucide-react";

interface Attendance {
  id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  daily_log: string;
  created_at: string;
  updated_at: string;
}

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form state
  // user_id will be extracted via JWT token
  const [dailyLog, setDailyLog] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAttendances = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/attendances/me",
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
        setAttendances(list);
      } else {
        setError(data.message || "Failed to fetch attendances");
      }

      // Fetch users to map user_id to name
      const usersRes = await fetch(
        "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/users/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.data || usersData || []);
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setSubmitting(true);

    let decodedUserId = 1;
    if (token) {
      try {
        const payload = JSON.parse(window.atob(token.split(".")[1]));
        decodedUserId = payload.id || payload.sub || payload.user_id || 1;
      } catch (e) {
        console.warn("Failed to decode token");
      }
    }

    try {
      const res = await fetch(
        "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/attendances/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: decodedUserId,
            daily_log: dailyLog,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Attendance berhasil dicatat!", timer: 1500, showConfirmButton: false });
        setDailyLog("");
        setShowForm(false);
        setLoading(true);
        fetchAttendances();
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal mencatat attendance" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" });
    } finally {
      setSubmitting(false);
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

  const getUserName = (id: number) => {
    const user = users.find((u) => u.id === id);
    return user ? user.name : `User #${id}`;
  };

  return (
    <section className="min-h-screen bg-gray-50 px-10 py-12">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Attendance</h1>
          <p className="text-gray-500 mt-2">
            Record and monitor daily attendance logs
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {attendances.length} Records
          </span>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium
              bg-gradient-to-r from-lime-400 to-lime-600
              shadow hover:shadow-lg transition hover:scale-105 active:scale-95"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "New Attendance"}
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
            <ClipboardCheck size={22} className="text-lime-600" />
            Record Attendance
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* DAILY LOG */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Daily Log</label>
              <div className="flex items-start border rounded-lg px-3 py-2 bg-gray-50">
                <FileText size={18} className="text-gray-400 mr-2 mt-0.5" />
                <textarea
                  placeholder="Meeting dengan klien dan setup server."
                  className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400 resize-none min-h-[80px]"
                  value={dailyLog}
                  onChange={(e) => setDailyLog(e.target.value)}
                  required
                />
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
              {submitting ? "Submitting..." : "Submit Attendance"}
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

      {/* ATTENDANCE LIST */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendances.map((att) => (
            <Link key={att.id} href={`/attendance/${att.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-xl transition-shadow cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-lime-100 text-lime-600">
                      <ClipboardCheck size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {getUserName(att.user_id)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    {formatDateTime(att.created_at)}
                  </div>
                </div>

                {/* Daily Log */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {att.daily_log}
                </p>
              </motion.div>
            </Link>
          ))}

          {attendances.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400">
              No attendance records found. Submit your first attendance!
            </div>
          )}
        </div>
      )}
    </section>
  );
}
