"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  country: string;
  currency: string;
  role: string;
  reseller_tier: string | null;
  is_active: number;
  credits: { balance: number } | null;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCredits: 0,
    totalOperations: 0,
    totalPayments: 0,
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/auth");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const authData = await res.json();
      setUser(authData.user);

      if (authData.user.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      // Fetch users (admin endpoint)
      const usersRes = await fetch("/api/admin/users");
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
        setStats(usersData.stats || stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredits = async (userId: string, amount: number) => {
    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          targetUserId: userId,
          amount,
          description: "Admin credit addition",
        }),
      });

      if (res.ok) {
        alert("Credits added successfully!");
        fetchAdminData();
      } else {
        alert("Failed to add credits");
      }
    } catch (err) {
      alert("Failed to add credits");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/");
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-pulse">💪🏾</div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-text-muted mb-4">You don't have admin privileges</p>
          <Link href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-pattern">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">💪🏾</span>
              <span className="text-xl font-bold gradient-text">KagujjeMDM Admin</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="btn btn-secondary text-sm">
                User Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-text-muted text-sm">Total Users</div>
            <div className="text-3xl font-bold text-primary">{stats.totalUsers}</div>
          </div>
          <div className="card">
            <div className="text-text-muted text-sm">Credits Sold</div>
            <div className="text-3xl font-bold text-accent">{stats.totalCredits.toLocaleString()}</div>
          </div>
          <div className="card">
            <div className="text-text-muted text-sm">Operations</div>
            <div className="text-3xl font-bold text-primary">{stats.totalOperations.toLocaleString()}</div>
          </div>
          <div className="card">
            <div className="text-text-muted text-sm">Payments</div>
            <div className="text-3xl font-bold text-accent">{stats.totalPayments.toLocaleString()}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border">
          {["users", "payments", "operations", "resellers"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 px-2 capitalize ${
                tab === t
                  ? "text-primary border-b-2 border-primary"
                  : "text-text-muted hover:text-primary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "users" && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Users</h2>
              <input
                type="text"
                className="input max-w-xs"
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-text-muted text-sm">User</th>
                    <th className="text-left py-2 text-text-muted text-sm">Country</th>
                    <th className="text-left py-2 text-text-muted text-sm">Role</th>
                    <th className="text-left py-2 text-text-muted text-sm">Credits</th>
                    <th className="text-left py-2 text-text-muted text-sm">Status</th>
                    <th className="text-left py-2 text-text-muted text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border/50">
                      <td className="py-3">
                        <div>
                          <div className="font-medium">{u.name || "No name"}</div>
                          <div className="text-sm text-text-muted">{u.email}</div>
                        </div>
                      </td>
                      <td className="py-3">{u.country}</td>
                      <td className="py-3">
                        <span className={`badge ${u.role === "admin" ? "badge-primary" : u.role === "reseller" ? "badge-accent" : ""}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-accent font-medium">
                        {u.credits?.balance || 0}
                      </td>
                      <td className="py-3">
                        <span className={`badge ${u.is_active ? "badge-accent" : "badge-error"}`}>
                          {u.is_active ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddCredits(u.id, 50)}
                            className="btn btn-secondary text-xs py-1 px-2"
                          >
                            +50
                          </button>
                          <button
                            onClick={() => handleAddCredits(u.id, 100)}
                            className="btn btn-secondary text-xs py-1 px-2"
                          >
                            +100
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "payments" && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Payments</h2>
            <p className="text-text-muted">Payment history will be displayed here</p>
          </div>
        )}

        {tab === "operations" && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Operations</h2>
            <p className="text-text-muted">Operation logs will be displayed here</p>
          </div>
        )}

        {tab === "resellers" && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Resellers</h2>
            <p className="text-text-muted">Reseller management will be displayed here</p>
          </div>
        )}
      </main>
    </div>
  );
}
