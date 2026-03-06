"use client";

import { motion } from "framer-motion";
import { Users, Link as LinkIcon } from "lucide-react";

export default function GroupsPage() {

  const groups = [
    {
      id: 1,
      name: "Digital Marketing Community",
      link: "https://chat.whatsapp.com/example1",
      status: "oke",
      users: 120
    },
    {
      id: 2,
      name: "Startup Founder Network",
      link: "https://chat.whatsapp.com/example2",
      status: "middle",
      users: 65
    },
    {
      id: 3,
      name: "Tech Discussion Group",
      link: "https://chat.whatsapp.com/example3",
      status: "not oke",
      users: 20
    },
  ];

  const statusStyle = {
    "oke": "bg-green-100 text-green-700",
    "middle": "bg-yellow-100 text-yellow-700",
    "not oke": "bg-red-100 text-red-700",
  };

  const statusDot = {
    "oke": "bg-green-500",
    "middle": "bg-yellow-400",
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

        <div className="text-sm text-gray-500 bg-white border px-4 py-2 rounded-lg">
          {groups.length} Groups
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
                  className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyle[group.status as keyof typeof statusStyle]}`}
                >

                  <span
                    className={`w-2 h-2 rounded-full ${statusDot[group.status as keyof typeof statusDot]}`}
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
                {group.users}
              </span>

            </div>

          </motion.div>

        ))}

      </div>

    </section>
  );
}