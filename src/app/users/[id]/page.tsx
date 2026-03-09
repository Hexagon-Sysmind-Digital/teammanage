"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Save, User, Mail, Lock, Shield } from "lucide-react";
import Swal from "sweetalert2";
import { getUserRoleFromToken } from "../../../lib/jwt";

export default function UserDetailPage({ params }: { params: any }) {
  const router = useRouter();

  const [id, setId] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (params instanceof Promise) {
      params.then((p) => setId(p.id));
    } else {
      setId(params.id);
    }
  }, [params]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = getUserRoleFromToken(token);
    if (userRole !== "admin") {
      router.push("/dashboard");
    } else if (id) {
      fetchUser(id);
    }
  }, [id, router]);

  const fetchUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const user = data.data || data;

      if (user) {
        setName(user.name || "");
        setEmail(user.email || "");
        setRole(user.role || "user");
      } else {
        Swal.fire("Error", "User not found", "error");
        router.push("/users");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to fetch user details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload: any = { name, email, role };
      if (password) payload.password = password;

      const res = await fetch(`https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "User berhasil diperbarui", timer: 1500, showConfirmButton: false });
        setIsEditing(false);
        setPassword("");
      } else {
        const data = await res.json();
        Swal.fire("Error", data.message || "Failed to update user", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "An error occurred", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        <button 
          onClick={() => router.push("/users")} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition font-medium"
        >
          <ArrowLeft size={18} /> Back to Users
        </button>

        <div className="bg-white border rounded-2xl shadow-lg p-8">
          
          <div className="flex justify-between items-center border-b pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
              <p className="text-gray-500 text-sm mt-1">View and edit user information</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-lime-50 hover:text-lime-600 transition"
            >
              {isEditing ? <ArrowLeft size={16} /> : <Edit size={16} />}
              {isEditing ? "Cancel Edit" : "Edit User"}
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <div className={`flex items-center border rounded-lg px-3 py-2 ${isEditing ? "bg-white" : "bg-gray-50"}`}>
                  <User size={18} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-transparent outline-none text-sm text-black disabled:text-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className={`flex items-center border rounded-lg px-3 py-2 ${isEditing ? "bg-white" : "bg-gray-50"}`}>
                  <Mail size={18} className="text-gray-400 mr-2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-transparent outline-none text-sm text-black disabled:text-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <div className={`flex items-center border rounded-lg px-3 py-2 ${isEditing ? "bg-white" : "bg-gray-50"}`}>
                  <Shield size={18} className="text-gray-400 mr-2" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-transparent outline-none text-sm text-black disabled:text-gray-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">New Password (Optional)</label>
                  <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-lime-400">
                    <Lock size={18} className="text-gray-400 mr-2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="w-full bg-transparent outline-none text-sm text-black"
                    />
                  </div>
                </div>
              )}

            </div>

            {isEditing && (
              <div className="flex justify-end pt-4 border-t mt-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium bg-gradient-to-r from-lime-400 to-lime-600 shadow-md hover:shadow-lg transition"
                >
                  <Save size={18} /> Save Changes
                </motion.button>
              </div>
            )}
            
          </form>

        </div>
      </motion.div>
    </section>
  );
}
