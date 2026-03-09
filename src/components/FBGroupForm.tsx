"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UsersRound,
  Link as LinkIcon,
  Users,
  CheckCircle2,
  MinusCircle,
  AlertCircle,
} from "lucide-react";

export default function FBGroupForm({ onSubmit, initialData, onClose }: any) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      link: "",
      total_client: "",
      status: "oke",
    }
  );

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit({ ...form, total_client: Number(form.total_client) });
  };

  const statuses = [
    {
      value: "oke",
      label: "Oke",
      active: "bg-green-50 text-green-700 border-green-500",
      inactive: "bg-gray-50 text-gray-500 border-transparent",
      icon: <CheckCircle2 size={15} />,
    },
    {
      value: "middle",
      label: "Middle",
      active: "bg-amber-50 text-amber-700 border-amber-400",
      inactive: "bg-gray-50 text-gray-500 border-transparent",
      icon: <MinusCircle size={15} />,
    },
    {
      value: "not oke",
      label: "Not Oke",
      active: "bg-red-50 text-red-700 border-red-500",
      inactive: "bg-gray-50 text-gray-500 border-transparent",
      icon: <AlertCircle size={15} />,
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* MODAL HEADER */}
          <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-lime-100 text-lime-600">
                <UsersRound size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                {initialData ? "Edit Group" : "Create Group"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

            {/* GROUP NAME */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Group Name
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2.5 bg-gray-50 focus-within:border-lime-400 focus-within:bg-white transition">
                <UsersRound size={16} className="text-gray-400 mr-2 shrink-0" />
                <input
                  name="name"
                  placeholder="e.g. Komunitas Digital Indonesia"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* GROUP LINK */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Group Link
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2.5 bg-gray-50 focus-within:border-lime-400 focus-within:bg-white transition">
                <LinkIcon size={16} className="text-gray-400 mr-2 shrink-0" />
                <input
                  name="link"
                  placeholder="https://facebook.com/groups/..."
                  value={form.link}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* TOTAL CLIENT */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Members
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2.5 bg-gray-50 focus-within:border-lime-400 focus-within:bg-white transition">
                <Users size={16} className="text-gray-400 mr-2 shrink-0" />
                <input
                  name="total_client"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.total_client}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* STATUS */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {statuses.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setForm({ ...form, status: s.value })}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                      form.status === s.value ? s.active : s.inactive + " hover:bg-gray-100"
                    }`}
                  >
                    {s.icon}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium
                  bg-gradient-to-r from-lime-400 to-lime-600
                  shadow hover:shadow-lg transition"
              >
                {initialData ? "Save Changes" : "Create Group"}
              </motion.button>
            </div>

          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}