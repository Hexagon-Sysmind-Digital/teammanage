"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";

export default function CreateUserPage() {

  const router = useRouter();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = async (e:any)=>{
    e.preventDefault();

    const token = localStorage.getItem("token");

    try{

      const res = await fetch(
        "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/users/",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
          },
          body:JSON.stringify({
            name,
            email,
            password
          })
        }
      )

      const data = await res.json()

      if(res.ok){
        Swal.fire({ icon: "success", title: "Berhasil", text: "User berhasil dibuat", timer: 1500, showConfirmButton: false })
        router.push("/users")
      }else{
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal membuat user" })
      }

    }catch(err){
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi error" })
    }

  }

  return (

    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border rounded-2xl shadow-lg p-8"
      >

        {/* TITLE */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Create User
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Add a new user to the system
          </p>

        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* NAME */}
          <div className="space-y-2">

            <label className="text-sm text-gray-600">
              Name
            </label>

            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">

              <User size={18} className="text-gray-400 mr-2"/>

              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                required
              />

            </div>

          </div>


          {/* EMAIL */}
          <div className="space-y-2">

            <label className="text-sm text-gray-600">
              Email
            </label>

            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">

              <Mail size={18} className="text-gray-400 mr-2"/>

              <input
                type="email"
                placeholder="example@email.com"
                className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />

            </div>

          </div>


          {/* PASSWORD */}
          <div className="space-y-2">

            <label className="text-sm text-gray-600">
              Password
            </label>

            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">

              <Lock size={18} className="text-gray-400 mr-2"/>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />

            </div>

          </div>


          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 rounded-lg text-white font-medium
            bg-gradient-to-r from-lime-400 to-lime-600
            shadow hover:shadow-lg transition"
          >

            Create User

          </motion.button>

        </form>

      </motion.div>

    </section>

  );

}