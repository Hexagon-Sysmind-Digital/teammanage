"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Building2,
  Layers,
  CalendarDays,
  CalendarClock,
  BarChart3,
  Activity,
  ArrowLeft,
} from "lucide-react";

export default function CreateProjectPage() {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [projectProgress, setProjectProgress] = useState(0);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    setLoading(true);

    try {
      const res = await fetch(
        "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/projects/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            project_name: projectName,
            client_name: clientName,
            project_type: projectType,
            start_date: new Date(startDate).toISOString(),
            deadline: new Date(deadline).toISOString(),
            project_progress: projectProgress,
            status,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Project berhasil dibuat!", timer: 1500, showConfirmButton: false });
        router.push("/projects");
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal membuat project" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white border rounded-2xl shadow-lg p-8"
      >
        {/* BACK BUTTON */}
        <button
          onClick={() => router.push("/projects")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-lime-600 transition mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </button>

        {/* TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Project</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Add a new project to the system
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* PROJECT NAME */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Project Name</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <FileText size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Website Company Profile"
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
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <Building2 size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="PT Maju Bersama"
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
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <Layers size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Web Development"
                className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                required
              />
            </div>
          </div>

          {/* DATES ROW */}
          <div className="grid grid-cols-2 gap-4">
            {/* START DATE */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Start Date</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                <CalendarDays size={18} className="text-gray-400 mr-2" />
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
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
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
          </div>

          {/* PROGRESS */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">
              Progress ({projectProgress}%)
            </label>
            <div className="flex items-center gap-3">
              <BarChart3 size={18} className="text-gray-400 shrink-0" />
              <input
                type="range"
                min={0}
                max={100}
                value={projectProgress}
                onChange={(e) => setProjectProgress(Number(e.target.value))}
                className="w-full accent-lime-500"
              />
            </div>
          </div>

          {/* STATUS */}
          <div className="space-y-3">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <Activity size={16} className="text-gray-400" /> Status
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

          {/* SUBMIT */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-medium
              bg-gradient-to-r from-lime-400 to-lime-600
              shadow hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Project"}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
