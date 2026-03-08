"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderKanban, Loader2 } from "lucide-react";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const fetchProjects = async () => {
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
          } else if (Array.isArray(data.data)) {
            list = data.data;
          } else if (Array.isArray(data.projects)) {
            list = data.projects;
          } else if (Array.isArray(data.results)) {
            list = data.results;
          } else if (data && typeof data === "object" && data.id) {
            // Single object response — wrap in array
            list = [data];
          }
          setProjects(list);
        } else {
          setError(data.message || "Failed to fetch projects");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

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
            <Link
              href="/projects/create"
              className="px-4 py-2 rounded-lg text-white text-sm font-medium
                bg-gradient-to-r from-lime-400 to-lime-600
                shadow hover:shadow-lg transition hover:scale-105 active:scale-95"
            >
              + Create Project
            </Link>
          )}
        </div>
      </div>

      {/* LOADING / ERROR */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-lime-500" />
        </div>
      )}

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
            <div className="col-span-full text-center py-10 text-gray-400">
              No projects found. Create your first project!
            </div>
          )}
        </div>
      )}

    </section>
  );
}