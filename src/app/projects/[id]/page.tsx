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
  Layers,
  Activity,
  BarChart3,
  Trash2,
  Save,
} from "lucide-react";
import CustomLoading from "../../../components/CustomLoading";

interface Project {
  id: number;
  project_name: string;
  client_name: string;
  project_type: string;
  start_date: string;
  deadline: string;
  project_progress: number;
  status: string;
}

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Editable fields
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const fetchProject = async () => {
      const minimumDelay = new Promise(resolve => setTimeout(resolve, 2000));
      try {
        const res = await fetch(
          `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/projects/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          const proj = data.data || data;
          setProject(proj);
          setProgress(proj.project_progress);
          setStatus(proj.status);
        } else {
          setError(data.message || "Failed to fetch project");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        await minimumDelay;
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    setSaving(true);
    try {
      const res = await fetch(
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/projects/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            project_progress: progress,
            status,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Project berhasil diupdate!", timer: 1500, showConfirmButton: false });
        setProject((prev) =>
          prev ? { ...prev, project_progress: progress, status } : prev
        );
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal mengupdate project" });
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
      text: "Apakah kamu yakin ingin menghapus project ini?",
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
        `https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/projects/${params.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Project berhasil dihapus!", timer: 1500, showConfirmButton: false });
        router.push("/projects");
      } else {
        const data = await res.json();
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal menghapus project" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" });
    } finally {
      setDeleting(false);
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "planning": return "bg-blue-100 text-blue-700";
      case "design": return "bg-purple-100 text-purple-700";
      case "development": return "bg-yellow-100 text-yellow-700";
      case "testing": return "bg-orange-100 text-orange-700";
      case "revision": return "bg-red-100 text-red-700";
      case "deployment": return "bg-green-100 text-green-700";
      case "pending": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
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
    return <CustomLoading variant="full" />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-red-500">{error || "Project not found"}</p>
        <Link href="/projects" className="text-lime-600 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-10 py-12">
      {/* BACK BUTTON */}
      <Link
        href="/projects"
        className="flex items-center gap-2 text-gray-500 hover:text-lime-600 mb-8 group transition"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Projects
      </Link>

      {/* HEADER */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-800">
              {project.project_name}
            </h1>
            <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <p className="text-gray-500">
            {project.client_name} · {project.project_type}
          </p>
        </div>

        {/* DELETE BUTTON */}
        {isLoggedIn && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 transition text-sm font-medium disabled:opacity-50"
          >
            <Trash2 size={16} />
            {deleting ? "Deleting..." : "Delete Project"}
          </button>
        )}
      </div>

      {/* INFO CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {/* PROGRESS CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Progress</h3>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Completion</span>
            <span>{project.project_progress}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.project_progress}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-lime-400 to-lime-600"
            />
          </div>
        </div>

        {/* CLIENT CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-lime-100 text-lime-600">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Client</p>
            <p className="text-lg font-semibold text-gray-800">{project.client_name}</p>
          </div>
        </div>

        {/* START DATE CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Start Date</p>
            <p className="text-lg font-semibold text-gray-800">{formatDate(project.start_date)}</p>
          </div>
        </div>

        {/* DEADLINE CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
            <CalendarClock size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Deadline</p>
            <p className="text-lg font-semibold text-gray-800">{formatDate(project.deadline)}</p>
          </div>
        </div>
      </div>

      {/* UPDATE FORM - Only visible when logged in */}
      {isLoggedIn && (
      <div className="bg-white rounded-2xl border shadow-sm p-8 max-w-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Update Project</h3>

        {/* PROGRESS SLIDER */}
        <div className="space-y-2 mb-6">
          <label className="text-sm text-gray-600 flex items-center gap-2">
            <BarChart3 size={16} className="text-gray-400" />
            Progress ({progress}%)
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full accent-lime-500"
          />
        </div>

        {/* STATUS PICKER */}
        <div className="space-y-3 mb-8">
          <label className="text-sm text-gray-600 flex items-center gap-2">
            <Activity size={16} className="text-gray-400" />
            Status
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: "pending",     label: "Pending",     active: "bg-gray-100 text-gray-700 border-gray-400" },
              { value: "planning",    label: "Planning",    active: "bg-blue-50 text-blue-700 border-blue-500" },
              { value: "design",      label: "Design",      active: "bg-purple-50 text-purple-700 border-purple-500" },
              { value: "development", label: "Dev",         active: "bg-yellow-50 text-yellow-700 border-yellow-500" },
              { value: "testing",     label: "Testing",     active: "bg-orange-50 text-orange-700 border-orange-500" },
              { value: "revision",    label: "Revision",    active: "bg-red-50 text-red-700 border-red-500" },
              { value: "deployment",  label: "Deploy",      active: "bg-green-50 text-green-700 border-green-500" },
            ].map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatus(s.value)}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border-2 transition-all ${
                  status === s.value
                    ? s.active + " shadow-sm"
                    : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
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
      )}
    </section>
  );
}