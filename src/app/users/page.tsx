"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Plus, Search, Trash2, Eye } from "lucide-react";

export default function UsersPage() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {

    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/users/",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();
    setUsers(data.data || data);

  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user: any) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <section className="min-h-screen bg-gray-50 px-6 py-12">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              User Management
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Manage all users inside the system
            </p>

          </div>

          <Link
            href="/users/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg
            text-white font-medium
            bg-gradient-to-r from-lime-400 to-lime-600
            shadow hover:shadow-lg transition"
          >
            <Plus size={18}/>
            Create User
          </Link>

        </div>

        {/* STATS */}

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white border rounded-xl p-6 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="p-3 rounded-lg bg-lime-100">
                <Users className="text-lime-600"/>
              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Total Users
                </p>

                <h2 className="text-2xl font-bold text-gray-800">
                  {users.length}
                </h2>

              </div>

            </div>

          </div>

        </div>


        {/* TABLE CARD */}

        <div className="bg-white border rounded-2xl shadow-lg p-6">

          {/* SEARCH */}

          <div className="flex justify-between items-center mb-6">

            <div className="relative w-72">

              <Search
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-lime-400"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
              />

            </div>

          </div>


          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="text-left text-sm text-gray-500 border-b">

                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-right">Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.map((user: any) => (

                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    {/* USER */}

                    <td className="py-4 px-4 flex items-center gap-3">

                      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-lime-100 text-lime-600 font-semibold text-sm">
                        {user.name.charAt(0)}
                      </div>

                      <span className="font-medium text-gray-800">
                        {user.name}
                      </span>

                    </td>

                    {/* EMAIL */}

                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {user.email}
                    </td>


                    {/* ROLE BADGE */}

                    <td className="py-4 px-4">

                      <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                        User
                      </span>

                    </td>


                    {/* ACTION */}

                    <td className="py-4 px-4">

                      <div className="flex justify-end gap-3">

                        <button className="text-gray-500 hover:text-blue-600">
                          <Eye size={18}/>
                        </button>

                        <button className="text-gray-500 hover:text-red-600">
                          <Trash2 size={18}/>
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </motion.div>

    </section>

  );

}