"use client";

import { useState } from "react";

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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
  e.preventDefault();

  onSubmit({
    ...form,
    total_client: Number(form.total_client),
  });
};

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl w-[400px]">

        <h2 className="text-lg text-black font-bold mb-4">
          {initialData ? "Edit Group" : "Create Group"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="name"
            placeholder="Group Name"
            value={form.name}
            onChange={handleChange}
            className="text-black w-full border p-2 rounded"
          />

          <input
            name="link"
            placeholder="Group Link"
            value={form.link}
            onChange={handleChange}
            className="text-black w-full border p-2 rounded"
          />

          <input
            name="total_client"
            placeholder="Total Client"
            value={form.total_client}
            onChange={handleChange}
            className="text-black w-full border p-2 rounded"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="text-black w-full border p-2 rounded"
          >
            <option value="oke">Oke</option>
            <option value="middle">Middle</option>
            <option value="not oke">Not Oke</option>
          </select>

          <div className="flex justify-end gap-2 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-lime-600 text-white rounded"
            >
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}