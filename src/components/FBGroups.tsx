"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Link as LinkIcon,
  Pencil,
  Trash2,
  Plus,
  UsersRound,
  CheckCircle2,
  AlertCircle,
  MinusCircle,
} from "lucide-react";

import FBGroupForm from "./FBGroupForm";
import {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../lib/facebookGroupService";

export default function FBGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      const data = await getGroups();
      if (Array.isArray(data)) {
        setGroups(data);
      } else if (Array.isArray(data.data)) {
        setGroups(data.data);
      } else {
        setGroups([]);
      }
    } catch (error) {
      console.error("Failed fetch groups:", error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreate = async (data: any) => {
    await createGroup(data);
    setShowForm(false);
    fetchGroups();
  };

  const handleUpdate = async (data: any) => {
    try {
      await updateGroup(editData.id, data);
      setShowForm(false);
      setEditData(null);
      fetchGroups();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin?",
      text: "Grup ini akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;
    await deleteGroup(id);
    fetchGroups();
  };

  const statusConfig: Record<string, { pill: string; icon: React.ReactNode; dot: string }> = {
    oke: {
      pill: "bg-green-100 text-green-700 border border-green-200",
      icon: <CheckCircle2 size={13} />,
      dot: "bg-green-500",
    },
    middle: {
      pill: "bg-amber-100 text-amber-700 border border-amber-200",
      icon: <MinusCircle size={13} />,
      dot: "bg-amber-400",
    },
    "not oke": {
      pill: "bg-red-100 text-red-700 border border-red-200",
      icon: <AlertCircle size={13} />,
      dot: "bg-red-500",
    },
  };

  const getStatusConf = (s: string) =>
    statusConfig[s] ?? {
      pill: "bg-gray-100 text-gray-500 border border-gray-200",
      icon: <MinusCircle size={13} />,
      dot: "bg-gray-400",
    };

  const okeCount = groups.filter((g) => g.status === "oke").length;
  const middleCount = groups.filter((g) => g.status === "middle").length;
  const notOkeCount = groups.filter((g) => g.status === "not oke").length;

  return (
    <section className="min-h-screen bg-gray-50 px-10 py-12">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-lime-100 text-lime-600">
              <UsersRound size={24} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Groups</h1>
          </div>
          <p className="text-gray-500 mt-1 ml-1">Monitor performance of all Facebook groups</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 bg-white border px-4 py-2 rounded-lg shadow-sm">
            {groups.length} Groups
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setEditData(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium
              bg-gradient-to-r from-lime-400 to-lime-600 shadow hover:shadow-lg transition"
          >
            <Plus size={16} />
            Add Group
          </motion.button>
        </div>
      </div>

      {/* STATUS SUMMARY */}
      <div className="grid grid-cols-3 gap-4 mb-10 max-w-xl">
        <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Oke</p>
            <p className="text-lg font-bold text-gray-800">{okeCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Middle</p>
            <p className="text-lg font-bold text-gray-800">{middleCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Not Oke</p>
            <p className="text-lg font-bold text-gray-800">{notOkeCount}</p>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-lime-400 border-t-transparent animate-spin" />
        </div>
      )}

      {/* EMPTY */}
      {!loading && groups.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
          <UsersRound size={48} strokeWidth={1.2} />
          <p className="text-lg">No groups yet. Add your first group!</p>
        </div>
      )}

      {/* GROUP CARDS */}
      {!loading && groups.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {groups.map((group, i) => {
              const conf = getStatusConf(group.status);
              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.08)" }}
                  className="bg-white border rounded-2xl shadow-sm p-6 flex flex-col justify-between group transition-all"
                >
                  {/* TOP */}
                  <div>
                    {/* NAME + STATUS */}
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="font-bold text-lg text-gray-800 leading-tight max-w-[65%]">
                        {group.name}
                      </h2>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${conf.pill}`}>
                        {conf.icon}
                        {group.status}
                      </span>
                    </div>

                    {/* LINK */}
                    <a
                      href={group.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-lime-600 font-medium hover:text-lime-700 hover:underline mb-6 transition"
                    >
                      <LinkIcon size={14} />
                      Open Group
                    </a>
                  </div>

                  {/* BOTTOM */}
                  <div>
                    {/* MEMBERS */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users size={15} />
                        Members Joined
                      </div>
                      <span className="text-xl font-bold text-gray-800">{group.total_client ?? "-"}</span>
                    </div>

                    {/* STATUS BAR */}
                    <div className="w-full h-1.5 rounded-full bg-gray-100 mb-4 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${conf.dot}`}
                        style={{ width: group.status === "oke" ? "100%" : group.status === "middle" ? "55%" : "20%" }}
                      />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => { setEditData(group); setShowForm(true); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                          text-gray-600 bg-gray-50 border border-gray-200
                          hover:bg-gray-100 hover:border-gray-300 transition"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(group.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                          text-red-500 bg-red-50 border border-red-200
                          hover:bg-red-100 hover:border-red-300 transition"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* MODAL FORM */}
      {showForm && (
        <FBGroupForm
          initialData={editData}
          onSubmit={editData ? handleUpdate : handleCreate}
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
        />
      )}
    </section>
  );
}