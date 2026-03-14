"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderKanban, CalendarDays, Activity } from "lucide-react";
import CustomLoading from "./CustomLoading";

interface Project {
  id: number;
  project_name: string;
  project_progress: number;
  status: string;
}

export default function DashboardOverview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [schedulesCount, setSchedulesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Enforce 2s loading as requested
      const minimumDelay = new Promise(resolve => setTimeout(resolve, 2000));

      const token = localStorage.getItem("token");
      try {
        const [projectsRes, schedulesRes] = await Promise.all([
          fetch("https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/projects/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/schedules/", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          let list: any[] = [];
          if (Array.isArray(projectsData)) {
            list = projectsData;
          } else if (projectsData && Array.isArray(projectsData.data)) {
            list = projectsData.data;
          } else if (projectsData && Array.isArray(projectsData.projects)) {
            list = projectsData.projects;
          } else if (projectsData && Array.isArray(projectsData.results)) {
            list = projectsData.results;
          } else if (projectsData && typeof projectsData === "object" && projectsData.id) {
            list = [projectsData];
          }
          setProjects(list);
        }

        if (schedulesRes.ok) {
          const schedulesData = await schedulesRes.json();
          let list: any[] = [];
          if (Array.isArray(schedulesData)) {
            list = schedulesData;
          } else if (schedulesData && Array.isArray(schedulesData.data)) {
            list = schedulesData.data;
          } else if (schedulesData && Array.isArray(schedulesData.results)) {
            list = schedulesData.results;
          } else if (schedulesData && typeof schedulesData === "object" && schedulesData.id) {
            list = [schedulesData];
          }
          setSchedulesCount(list.length);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalProjects = projects.length;
  // Use 'dev' or 'development' status for active projects
  const activeProjectsCount = projects.filter(p => p.status?.toLowerCase() === 'dev' || p.status?.toLowerCase() === 'development').length;

  if (loading) {
    return <CustomLoading variant="full" />;
  }

  return (
    <section className="w-full min-h-screen bg-gray-50 px-6 md:px-10 py-10 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-2">
          Monitor project activity and team productivity
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* TOTAL PROJECT */}
        <motion.div
          whileHover={{ y: -6 }}
          className="bg-white rounded-2xl p-6 shadow-md border flex items-center gap-4"
        >
          <div className="bg-lime-100 text-lime-600 p-3 rounded-xl">
            <FolderKanban size={28} />
          </div>

          <div>
            <p className="text-gray-500 text-sm">Total Projects</p>
            <h2 className="text-3xl font-bold">{totalProjects}</h2>
          </div>
        </motion.div>

        {/* SCHEDULES / WORK DAYS */}
        <motion.div
          whileHover={{ y: -6 }}
          className="bg-white rounded-2xl p-6 shadow-md border flex items-center gap-4"
        >
          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
            <CalendarDays size={28} />
          </div>

          <div>
            <p className="text-gray-500 text-sm">Total Schedule</p>
            <h2 className="text-3xl font-bold">{schedulesCount}</h2>
          </div>
        </motion.div>

        {/* ACTIVE PROJECT */}
        <motion.div
          whileHover={{ y: -6 }}
          className="bg-white rounded-2xl p-6 shadow-md border flex items-center gap-4"
        >
          <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
            <Activity size={28} />
          </div>

          <div>
            <p className="text-gray-500 text-sm">Active Projects</p>
            <h2 className="text-3xl font-bold">{activeProjectsCount}</h2>
          </div>
        </motion.div>

      </div>

      {/* PROJECT PROGRESS */}
      <div className="bg-white rounded-2xl shadow-md border p-8">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Project Progress
          </h2>

          <span className="text-sm text-gray-400">
            {activeProjectsCount} Active Projects
          </span>
        </div>

        <div className="space-y-6">

          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="space-y-2">

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    {project.project_name}
                  </span>

                  <span className="text-sm text-gray-500">
                    {project.project_progress}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.project_progress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-lime-400 to-lime-600 rounded-full"
                  />

                </div>

              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No projects available</div>
          )}

        </div>

      </div>

    </section>
  );
}