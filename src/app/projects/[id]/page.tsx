"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Calendar, ArrowLeft } from "lucide-react";

export default function ProjectDetail() {

  const params = useParams();

  const projects = [
    {
      id: "1",
      name: "E-Procurement System",
      progress: 80,
      description: "System for managing procurement and vendor bidding.",
      team: 5,
      deadline: "30 July 2026",
    },
    {
      id: "2",
      name: "Company Profile Website",
      progress: 60,
      description: "Corporate website for brand presence.",
      team: 3,
      deadline: "12 June 2026",
    },
    {
      id: "3",
      name: "Mobile Inventory App",
      progress: 45,
      description: "Mobile app for inventory tracking.",
      team: 4,
      deadline: "15 August 2026",
    },
    {
      id: "4",
      name: "Waste Management System",
      progress: 90,
      description: "Platform for monitoring waste management operations.",
      team: 6,
      deadline: "5 May 2026",
    },
  ];

  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    return <div className="p-10">Project not found</div>;
  }

  return (
    <section className="min-h-screen bg-gray-50 px-10 py-12">

      {/* BACK BUTTON */}
      <Link
        href="/projects"
        className="flex items-center gap-2 text-gray-500 hover:text-black mb-8"
      >
        <ArrowLeft size={18} />
        Back to Projects
      </Link>

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold text-gray-800">
          {project.name}
        </h1>

        <p className="text-gray-500 mt-2">
          {project.description}
        </p>

      </div>

      {/* PROJECT INFO GRID */}
      <div className="grid md:grid-cols-3 gap-8">

        {/* PROGRESS CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <h3 className="font-semibold text-gray-800 mb-4">
            Project Progress
          </h3>

          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Completion</span>
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

        {/* TEAM CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">

          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <Users size={24} />
          </div>

          <div>
            <p className="text-gray-500 text-sm">Team Members</p>
            <p className="text-xl font-semibold text-gray-800">
              {project.team} People
            </p>
          </div>

        </div>

        {/* DEADLINE CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">

          <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
            <Calendar size={24} />
          </div>

          <div>
            <p className="text-gray-500 text-sm">Deadline</p>
            <p className="text-xl font-semibold text-gray-800">
              {project.deadline}
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}