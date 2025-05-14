"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { useRouter } from "next/navigation";
import EditUserModal from "./EditUserModal";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Group {
  _id: string;
  groupName: string;
  admin: User;
  users: User[];
}

export default function UpdatedDashboard() {
  const [authUser] = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "groups">("users");
  const [showDeleteModal, setShowDeleteModal] = useState<{ show: boolean; userId: string | null }>({ show: false, userId: null });

  // Group form state
  const [groupName, setGroupName] = useState("");
  const [groupAdminId, setGroupAdminId] = useState<string>("");
  const [groupUserIds, setGroupUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (!authUser) {
      router.push("/signin");
      return;
    }
    if (authUser.role === "admin") {
      fetchUsers();
    } else if (authUser.role === "superadmin") {
      fetchUsers();
      fetchGroups();
    } else {
      setError("Access denied. Admins and Superadmins only.");
      setLoading(false);
    }
  }, [authUser, router]);

  useEffect(() => {
    if (editingGroup) {
      setGroupName(editingGroup.groupName);
      setGroupAdminId(editingGroup.admin._id);
      setGroupUserIds(editingGroup.users.map((u) => u._id));
    } else {
      setGroupName("");
      setGroupAdminId("");
      setGroupUserIds([]);
    }
  }, [editingGroup]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await fetch("/api/admin/groups");
      if (!res.ok) {
        throw new Error("Failed to fetch groups");
      }
      const data = await res.json();
      setGroups(data.groups);
    } catch (err: any) {
      setError(err.message || "Error fetching groups");
    }
  };

  const confirmDeleteUser = (userId: string) => {
    setShowDeleteModal({ show: true, userId });
  };

  const cancelDeleteUser = () => {
    setShowDeleteModal({ show: false, userId: null });
  };

  const deleteUser = async () => {
    if (!showDeleteModal.userId) return;
    try {
      const res = await fetch(`/api/admin/users/${showDeleteModal.userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete user");
      }
      setUsers(users.filter((user) => user._id !== showDeleteModal.userId));
      cancelDeleteUser();
    } catch (err: any) {
      alert(err.message || "Error deleting user");
    }
  };

  const deleteGroup = async (groupId: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return;
    try {
      const res = await fetch(`/api/admin/groups/${groupId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete group");
      }
      setGroups(groups.filter((group) => group._id !== groupId));
    } catch (err: any) {
      alert(err.message || "Error deleting group");
    }
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  const handleGroupUpdated = () => {
    fetchGroups();
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName || !groupAdminId) {
      alert("Group name and admin are required");
      return;
    }
    try {
      
      
      const url = editingGroup ? `/api/admin/groups/${editingGroup._id}` : "/api/admin/groups";
      const method = editingGroup ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupName,
          adminId: groupAdminId,
          userIds: groupUserIds,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to save group");
      }
      setEditingGroup(null);
      setGroupName("");
      setGroupAdminId("");
      setGroupUserIds([]);
      handleGroupUpdated();
    } catch (err: any) {
      alert(err.message || "Error saving group");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Management</h1>
      {authUser.role === "superadmin" && (
        <div className="mb-4">
          <button
            className={`mr-4 px-4 py-2 rounded ${activeTab === "users" ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-200"}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "groups" ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-200"}`}
            onClick={() => setActiveTab("groups")}
          >
            Groups
          </button>
        </div>
      )}
      {activeTab === "users" && (
        <>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="text-center">
                    <td className="border px-4 py-2">{user.firstName} {user.lastName}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.role}</td>
                    <td className="border px-4 py-2 space-x-2 flex justify-center">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="flex items-center space-x-1 px-3 py-1 bg-indigo-500 text-white rounded shadow hover:bg-indigo-600 transition"
                        title="Edit User"
                      >
                        {/* Updated edit icon: pencil */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6L7 21l-2-2 4-4z" />
                        </svg>
                        
                      </button>

                      <button
                        onClick={() => confirmDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete User"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {editingUser && (
            <EditUserModal
              user={editingUser}
              onClose={() => setEditingUser(null)}
              onUserUpdated={handleUserUpdated}
            />
          )}
          {showDeleteModal.show && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                <p>Are you sure you want to delete this user?</p>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={cancelDeleteUser}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteUser}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {activeTab === "groups" && authUser.role === "superadmin" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">User Groups</h2>
          <button
            onClick={() => setEditingGroup({ _id: "", groupName: "", admin: { _id: "", firstName: "", lastName: "", email: "", role: "" }, users: [] })}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create New Group
          </button>
          {groups.length === 0 ? (
            <p>No groups found.</p>
          ) : (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Group Name</th>
                  <th className="border px-4 py-2">Admin</th>
                  <th className="border px-4 py-2">Users</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group._id} className="text-center">
                    <td className="border px-4 py-2">{group.groupName}</td>
                    <td className="border px-4 py-2">{group.admin.firstName} {group.admin.lastName}</td>
                    <td className="border px-4 py-2">{group.users.length}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => setEditingGroup(group)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteGroup(group._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {editingGroup && (
            <div className="border p-4 rounded bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-2">{editingGroup._id ? "Edit Group" : "Create Group"}</h3>
              <form onSubmit={handleGroupSubmit}>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Admin</label>
                  <select
                    value={groupAdminId}
                    onChange={(e) => setGroupAdminId(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select an admin</option>
                    {users
                      .filter((u) => u.role === "admin" || u.role === "superadmin")
                      .map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Users</label>
                  <select
                    multiple
                    value={groupUserIds}
                    onChange={(e) => {
                      const options = e.target.options;
                      const selected: string[] = [];
                      for (let i = 0; i < options.length; i++) {
                        if (options[i].selected) {
                          selected.push(options[i].value);
                        }
                      }
                      setGroupUserIds(selected);
                    }}
                    className="w-full px-3 py-2 border rounded"
                  >
                    {users
                      .filter((u) => u.role === "user")
                      .map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingGroup(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {editingGroup._id ? "Update Group" : "Create Group"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
