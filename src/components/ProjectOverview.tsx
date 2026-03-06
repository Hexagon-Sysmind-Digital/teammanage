"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FolderKanban } from "lucide-react";

export default function ProjectsPage() {

  const projects = [
    { id: 1, name: "E-Procurement System", progress: 80 },
    { id: 2, name: "Company Profile Website", progress: 60 },
    { id: 3, name: "Mobile Inventory App", progress: 45 },
    { id: 4, name: "Waste Management System", progress: 90 },
  ];

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

        <div className="text-sm text-gray-500">
          {projects.length} Active Projects
        </div>

      </div>

      {/* PROJECT GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {projects.map((project) => (

          <Link key={project.id} href={`/projects/${project.id}`}>

            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-xl p-6 cursor-pointer"
            >

              {/* PROJECT TITLE */}
              <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-lime-100 text-lime-600">
                    <FolderKanban size={20} />
                  </div>

                  <h2 className="font-semibold text-gray-800">
                    {project.name}
                  </h2>
                </div>

                {/* STATUS BADGE */}
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  Active
                </span>

              </div>

              {/* PROGRESS */}
              <div className="space-y-2">

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-lime-400 to-lime-600"
                  />

                </div>

              </div>

            </motion.div>

          </Link>

        ))}

      </div>

    </section>
  );
}