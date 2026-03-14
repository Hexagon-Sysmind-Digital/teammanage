"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ClipboardCheck,
  User,
  FileText,
  Clock,
  LogIn,
  LogOut,
  Trash2,
  Save,
} from "lucide-react";
import CustomLoading from "../../../components/CustomLoading";

interface Attendance {
  id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  daily_log: string;
  created_at: string;
  updated_at: string;
}

export default function AttendanceDetail() {
  const params = useParams();
  const router = useRouter();

  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [userMap, setUserMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Editable fields
  const [dailyLog, setDailyLog] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      const minimumDelay = new Promise(resolve => setTimeout(resolve, 2000));
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/attendances/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          const att = data.data || data;
          setAttendance(att);
          setDailyLog(att.daily_log || "");
        } else {
          setError(data.message || "Failed to fetch attendance");
        }

        // Fetch user mapping
        const usersRes = await fetch(
          "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/users/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          const userArr = usersData.data || usersData || [];
          const map: Record<number, string> = {};
          userArr.forEach((u: any) => { map[u.id] = u.name; });
          setUserMap(map);
        }

      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        await minimumDelay;
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [params.id]);

  const handleUpdate = async (isCheckOut = false) => {
    const token = localStorage.getItem("token");
    setSaving(true);
    let decodedUserId = attendance?.user_id || 1;
    if (token) {
      try {
        const payload = JSON.parse(window.atob(token.split(".")[1]));
        decodedUserId = payload.id || payload.sub || payload.user_id || decodedUserId;
      } catch (e) {
        console.warn("Failed to decode token");
      }
    }

    const currentCheckOut = isCheckOut ? new Date().toISOString() : attendance?.check_out;

    try {
      const res = await fetch(
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/attendances/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: decodedUserId,
            check_in: attendance?.check_in,
            check_out: currentCheckOut,
            daily_log: dailyLog,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: isCheckOut ? "Berhasil Check Out!" : "Attendance berhasil diupdate!", timer: 1500, showConfirmButton: false });
        const att = data.data || data;
        setAttendance((prev) =>
          prev
            ? { ...prev, user_id: decodedUserId, check_out: currentCheckOut as string, daily_log: dailyLog }
            : prev
        );
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal mengupdate attendance" });
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
      text: "Apakah kamu yakin ingin menghapus attendance ini?",
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
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/attendances/${params.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Attendance berhasil dihapus!", timer: 1500, showConfirmButton: false });
        router.push("/attendance");
      } else {
        const data = await res.json();
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal menghapus attendance" });
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

  if (loading) {
    return <CustomLoading variant="full" />;
  }

  if (error || !attendance) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-red-500">{error || "Attendance not found"}</p>
        <Link href="/attendance" className="text-lime-600 hover:underline">
          ← Back to Attendance
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-10 py-12">
      {/* BACK */}
      <Link
        href="/attendance"
        className="flex items-center gap-2 text-gray-500 hover:text-lime-600 mb-8 group transition"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Attendance
      </Link>

      {/* HEADER */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-800">
              Attendance
            </h1>
          </div>
          <p className="text-gray-500">
            {userMap[attendance.user_id] || `User #${attendance.user_id}`} · {formatDateTime(attendance.created_at)}
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
        {/* CHECK IN */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-100 text-green-600">
            <LogIn size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Check In</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatDateTime(attendance.check_in)}
            </p>
          </div>
        </div>

        {/* CHECK OUT */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <LogOut size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Check Out</p>
              <p className="text-lg font-semibold text-gray-800">
                {attendance.check_out ? formatDateTime(attendance.check_out) : "Not yet"}
              </p>
            </div>
          </div>
          {!attendance.check_out && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUpdate(true)}
              disabled={saving}
              className="w-full py-2 bg-red-50 text-red-600 font-medium rounded-lg border border-red-200 hover:bg-red-100 transition text-sm disabled:opacity-50"
            >
              {saving ? "Processing..." : "Check Out Now"}
            </motion.button>
          )}
        </div>

        {/* CREATED */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Created</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatDateTime(attendance.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* DAILY LOG DISPLAY */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText size={18} className="text-gray-400" /> Daily Log
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{attendance.daily_log}</p>
        </div>

      </div>

      {/* UPDATE FORM */}
      <div className="bg-white rounded-2xl border shadow-sm p-8 max-w-2xl">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ClipboardCheck size={22} className="text-lime-600" />
          Update Attendance
        </h3>

        <div className="space-y-5">

          {/* DAILY LOG */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <FileText size={16} className="text-gray-400" /> Daily Log
            </label>
            <div className="flex items-start border rounded-lg px-3 py-2 bg-gray-50">
              <textarea
                className="w-full bg-transparent outline-none text-sm text-black resize-none min-h-[80px]"
                value={dailyLog}
                onChange={(e) => setDailyLog(e.target.value)}
              />
            </div>
          </div>

          {/* SAVE */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleUpdate(false)}
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
