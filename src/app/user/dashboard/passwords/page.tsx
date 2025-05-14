"use client";

import React, { useEffect, useState } from "react";
import { useAuthHook } from "../../../../hooks/useAuth";
import AppSidebar from "../../../../layout/AppSidebar";
import AppHeader from "../../../../layout/AppHeader";
import { useSession } from "next-auth/react";

interface PasswordEntry {
  _id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

export default function PasswordManagerPage() {
  useAuthHook("user");
  const { data: session } = useSession();
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
  });

  useEffect(() => {
    if (session) {
      fetchEntries();
    } else {
      console.error("User is not authenticated");
    }
  }, [session]);

  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/passwords", { credentials: "include" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch password entries");
      }
      const data = await res.json();
      setEntries(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/user/passwords", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add password entry");
      }
      setFormData({ title: "", username: "", password: "", url: "", notes: "" });
      fetchEntries();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  };

  return (
    <>
      <AppHeader />
      <AppSidebar />
      <main className="p-6 ml-64">
        <h1 className="text-3xl font-bold mb-6">Password Manager</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Password</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label htmlFor="title" className="block font-medium mb-1">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="username" className="block font-medium mb-1">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="block font-medium mb-1">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="url" className="block font-medium mb-1">URL</label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="notes" className="block font-medium mb-1">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Password
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Saved Passwords</h2>
          {loading ? (
            <p>Loading...</p>
          ) : entries.length === 0 ? (
            <p>No password entries found.</p>
          ) : (
            <table className="w-full border border-gray-300 rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Title</th>
                  <th className="border border-gray-300 px-4 py-2">Username</th>
                  <th className="border border-gray-300 px-4 py-2">Password</th>
                  <th className="border border-gray-300 px-4 py-2">URL</th>
                  <th className="border border-gray-300 px-4 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id}>
                    <td className="border border-gray-300 px-4 py-2">{entry.title}</td>
                    <td className="border border-gray-300 px-4 py-2">{entry.username}</td>
                    <td className="border border-gray-300 px-4 py-2">{entry.password}</td>
                    <td className="border border-gray-300 px-4 py-2">{entry.url || "-"}</td>
                    <td className="border border-gray-300 px-4 py-2">{entry.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  );
}