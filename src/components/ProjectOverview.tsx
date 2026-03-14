"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderKanban, 
  FileText,
  Building2,
  Layers,
  CalendarDays,
  CalendarClock,
  BarChart3,
  Activity,
  X,
  Plus 
} from "lucide-react";
import CustomLoading from "./CustomLoading";
import Swal from "sweetalert2";

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [projectProgress, setProjectProgress] = useState(0);
  const [formStatus, setFormStatus] = useState("pending");
  const [submitting, setSubmitting] = useState(false);

  const minimumDelay = new Promise(resolve => setTimeout(resolve, 2000));

  const fetchProjects = async (token: string | null) => {
    try {
      const res = await fetch(
        "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/projects/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        let list: any[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && Array.isArray(data.data)) {
          list = data.data;
        } else if (data && Array.isArray(data.projects)) {
          list = data.projects;
        } else if (data && Array.isArray(data.results)) {
          list = data.results;
        } else if (data && typeof data === "object" && data.id) {
          list = [data];
        }
        setProjects(list);
      } else {
        setError(data.message || "Failed to fetch projects");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      await minimumDelay;
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchProjects(token);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setSubmitting(true);

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
            status: formStatus,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Project berhasil dibuat!", timer: 1500, showConfirmButton: false });
        // Reset form
        setProjectName("");
        setClientName("");
        setProjectType("");
        setStartDate("");
        setDeadline("");
        setProjectProgress(0);
        setFormStatus("pending");
        setShowForm(false);
        setLoading(true);
        fetchProjects(token);
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal membuat project" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" });
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
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

  return (
    <section className="min-h-screen bg-gray-50 px-10 py-12">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Projects Overview
          </h1>
          <p className="text-gray-500 mt-2">
            Monitor progress of all active projects
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {projects.length} Projects
          </span>
          {isLoggedIn && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium
                bg-gradient-to-r from-lime-400 to-lime-600
                shadow hover:shadow-lg transition hover:scale-105 active:scale-95"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancel" : "Create Project"}
            </button>
          )}
        </div>
      </div>

      {/* LOADING / ERROR */}
      {loading && <CustomLoading variant="inline" />}

      {error && (
        <div className="text-center py-20 text-red-500">{error}</div>
      )}

      {/* PROJECT GRID */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-xl p-6 cursor-pointer"
              >
                {/* PROJECT TITLE */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-lime-100 text-lime-600">
                      <FolderKanban size={20} />
                    </div>
                    <h2 className="font-semibold text-gray-800">
                      {project.project_name}
                    </h2>
                  </div>

                  {/* STATUS BADGE */}
                  <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                {/* CLIENT & TYPE */}
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <p>Client: <span className="text-gray-700">{project.client_name}</span></p>
                  <p>Type: <span className="text-gray-700">{project.project_type}</span></p>
                </div>

                {/* PROGRESS */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Progress</span>
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

              </motion.div>
            </Link>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl border shadow-sm p-16 text-center">
              <div className="w-16 h-16 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderKanban size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Projects Found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                You don&apos;t have any projects yet. Click the &quot;Create Project&quot; button above to get started.
              </p>
            </div>
          )}
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
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
                  <FolderKanban size={22} className="text-lime-600" />
                  Add New Project
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* PROJECT TYPE */}
                  <div className="space-y-2 md:col-span-2">
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
                        onClick={() => setFormStatus(s.value)}
                        className={`py-2 px-2 text-xs font-semibold rounded-lg border-2 transition-all ${
                          formStatus === s.value
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
                    {submitting ? "Creating..." : "Create Project"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}