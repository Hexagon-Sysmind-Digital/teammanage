"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Link as LinkIcon, Pencil, Trash } from "lucide-react";

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

  const fetchGroups = async () => {
  try {
    const data = await getGroups();

    console.log("API RESPONSE:", data);

    // handle semua kemungkinan bentuk response
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
    await updateGroup(editData.id, data);
    setEditData(null);
    fetchGroups();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this group?")) return;
    await deleteGroup(id);
    fetchGroups();
  };

  const statusStyle: any = {
    oke: "bg-green-100 text-green-700",
    middle: "bg-yellow-100 text-yellow-700",
    "not oke": "bg-red-100 text-red-700",
  };

  const statusDot: any = {
    oke: "bg-green-500",
    middle: "bg-yellow-400",
    "not oke": "bg-red-500",
  };

  return (
    <section className="min-h-screen bg-gray-50 px-10 py-12">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-12">

        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Group List
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor performance of all groups
          </p>
        </div>

        <div className="flex items-center gap-4">

          <div className="text-sm text-gray-500 bg-white border px-4 py-2 rounded-lg">
            {groups.length} Groups
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-lime-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Group
          </button>

        </div>

      </div>


      {/* STATUS LEGEND */}
      <div className="flex gap-4 mb-10">

        <div className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg text-sm font-semibold text-black">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          Oke
        </div>

        <div className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg text-sm font-semibold text-black">
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          Middle
        </div>

        <div className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg text-sm font-semibold text-black">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          Not Oke
        </div>

      </div>


      {/* GROUP LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {groups.map((group) => (

          <motion.div
            key={group.id}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-white border rounded-2xl shadow-sm hover:shadow-xl p-6 flex flex-col justify-between"
          >

            {/* TOP */}
            <div>

              {/* NAME + STATUS */}
              <div className="flex items-center justify-between mb-4">

                <h2 className="font-semibold text-lg text-gray-900">
                  {group.name}
                </h2>

                <span
                  className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyle[group.status]}`}
                >

                  <span
                    className={`w-2 h-2 rounded-full ${statusDot[group.status]}`}
                  />

                  {group.status}

                </span>

              </div>


              {/* LINK */}
              <a
                href={group.link}
                target="_blank"
                className="flex items-center gap-2 text-sm text-lime-600 font-semibold hover:underline mb-6"
              >
                <LinkIcon size={16} />
                Join Group
              </a>

            </div>


            {/* USERS */}
            <div className="flex items-center justify-between pt-4 border-t">

              <div className="flex items-center gap-2 text-sm text-gray-600">

                <Users size={16} />

                Users Joined

              </div>

              <span className="text-lg font-bold text-gray-900">
                {group.total_client}
              </span>

            </div>


            {/* ACTION BUTTON */}
            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() => {
                  setEditData(group);
                  setShowForm(true);
                }}
                className="text-gray-600"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => handleDelete(group.id)}
                className="text-red-500"
              >
                <Trash size={16} />
              </button>

            </div>

          </motion.div>

        ))}

      </div>

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