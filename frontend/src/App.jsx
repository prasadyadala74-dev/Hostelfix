import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  Wrench,
  ClipboardList,
  LogOut,
  ArrowRight,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  RefreshCw,
  Search,
  Image as ImageIcon,
  Building,
  User,
  ExternalLink,
  X,
  Filter,
  Check,
  Sparkles
} from "lucide-react";
import { api } from "./api";

// Status Badge Styling Helper
function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Assigned: "bg-blue-50 text-blue-700 border-blue-200",
    "In Progress": "bg-purple-50 text-purple-700 border-purple-200",
    Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200"
  };

  const icons = {
    Pending: <AlertTriangle size={12} className="mr-1 inline" />,
    Assigned: <Clock3 size={12} className="mr-1 inline" />,
    "In Progress": <RefreshCw size={12} className="mr-1 inline animate-spin" />,
    Resolved: <CheckCircle2 size={12} className="mr-1 inline" />
  };

  const badgeClass = styles[status] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide ${badgeClass}`}>
      {icons[status] || null}
      {status}
    </span>
  );
}

// Category Badge Helper
function CategoryBadge({ category }) {
  const colors = {
    Plumbing: "bg-cyan-50 text-cyan-700 border-cyan-200",
    Electrical: "bg-yellow-50 text-yellow-800 border-yellow-200",
    Cleaning: "bg-teal-50 text-teal-700 border-teal-200",
    "Water Supply": "bg-sky-50 text-sky-700 border-sky-200",
    Water: "bg-sky-50 text-sky-700 border-sky-200",
    "Wi-Fi": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Wi-Fi / Internet": "bg-indigo-50 text-indigo-700 border-indigo-200",
    Furniture: "bg-amber-50 text-amber-800 border-amber-200",
    Other: "bg-slate-100 text-slate-700 border-slate-200"
  };

  return (
    <span className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold ${colors[category] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {category}
    </span>
  );
}

// Global Layout with Navigation Header
function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("hostelfix_user") || "null"));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("hostelfix_user") || "null"));
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("hostelfix_token");
    localStorage.removeItem("hostelfix_user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link to="/" className="group flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-slate-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 transition-transform group-hover:scale-105">
              <Wrench size={20} />
            </span>
            <span>Hostel<span className="text-indigo-600">Fix</span></span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-4">
            {user ? (
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Dashboard
                </Link>
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                    {user.role === "admin" ? "Admin" : "Student"}
                  </span>
                  <span className="text-sm font-medium text-slate-600">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} HostelFix · Hostel Maintenance & Issue Tracking System</p>
      </footer>
    </div>
  );
}

// Landing Page
function Home() {
  const user = JSON.parse(localStorage.getItem("hostelfix_user") || "null");

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
              <Sparkles size={14} /> Smart Hostel Operations
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Fix hostel issues. <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Faster & Transparent.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-slate-600 sm:text-lg">
              Say goodbye to paper registers and lost complaints. Students can report room issues in seconds, upload photos, and track repair status directly.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {user ? (
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700"
                >
                  Go to {user.role === "admin" ? "Admin Panel" : "Dashboard"} <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700"
                  >
                    Get Started Free <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50"
                  >
                    Student / Admin Login
                  </Link>
                </>
              )}
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200 pt-8">
              <div>
                <p className="text-2xl font-black text-indigo-600">100%</p>
                <p className="text-xs font-medium text-slate-500">Digital Tracking</p>
              </div>
              <div>
                <p className="text-2xl font-black text-indigo-600">4-Stage</p>
                <p className="text-xs font-medium text-slate-500">Resolution Flow</p>
              </div>
              <div>
                <p className="text-2xl font-black text-indigo-600">Real-time</p>
                <p className="text-xs font-medium text-slate-500">Admin Control</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                  <ClipboardList size={22} />
                </span>
                <div>
                  <h2 className="text-lg font-bold">Hostel Workflow Status</h2>
                  <p className="text-xs text-slate-400">End-to-end complaint lifecycle</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3.5">
              {[
                { title: "1. Quick Issue Lodging", desc: "Submit complaints with category, room, and optional photo.", icon: CheckCircle2 },
                { title: "2. Live Status Tracking", desc: "Track progress from Pending to Assigned and Resolved.", icon: Clock3 },
                { title: "3. Warden / Admin Actions", desc: "Review reports, assign maintenance staff, and update state.", icon: ShieldCheck }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10">
                  <item.icon className="mt-0.5 shrink-0 text-indigo-400" size={20} />
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-300">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/40 p-4 text-xs text-indigo-200">
              💡 <strong>Admin Note:</strong> To access administrative tools, log in with admin credentials or create an admin using <code className="rounded bg-indigo-900 px-1 py-0.5">npm run create-admin</code>.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Authentication (Login / Register) Component
function Auth({ register = false }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("hostelfix_user") || "null");

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (register && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await api(register ? "/auth/register" : "/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });
      localStorage.setItem("hostelfix_token", data.token);
      localStorage.setItem("hostelfix_user", JSON.stringify(data.user));
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center justify-center px-4 py-12">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 inline-flex rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-2xl font-black text-slate-900">{register ? "Create Account" : "Welcome Back"}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {register ? "Sign up to lodge and track hostel issues" : "Log in with your email and password"}
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertTriangle size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {register && (
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Full Name</label>
                <input
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Email Address</label>
              <input
                required
                type="email"
                placeholder="name@hostel.edu"
                className="field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Password</label>
              <input
                required
                minLength="6"
                type="password"
                placeholder="••••••••"
                className="field"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {register && (
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Confirm Password</label>
                <input
                  required
                  minLength="6"
                  type="password"
                  placeholder="••••••••"
                  className="field"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Processing...
                </>
              ) : register ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {register ? "Already have an account?" : "New to HostelFix?"}{" "}
            <Link
              to={register ? "/login" : "/register"}
              className="font-bold text-indigo-600 hover:text-indigo-700"
            >
              {register ? "Login here" : "Create an account"}
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

// Student Dashboard Component
function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("hostelfix_user") || "null");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [activeModalImage, setActiveModalImage] = useState(null);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const data = await api("/complaints");
      setItems(data);
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "student") {
      loadComplaints();
    }
  }, []);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setSubmitting(true);

    try {
      const formData = new FormData(e.target);
      const payload = Object.fromEntries(formData);
      const newComplaint = await api("/complaints", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setItems((prev) => [newComplaint, ...prev]);
      setMsg({ type: "success", text: "Complaint lodged successfully! You can track its status below." });
      e.target.reset();
      setImagePreview("");
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Student Portal</span>
            <h1 className="text-3xl font-black text-slate-900">Welcome, {user.name}</h1>
            <p className="mt-1 text-sm text-slate-500">Report room issues and check resolution progress.</p>
          </div>
          <button
            onClick={loadComplaints}
            className="btn-secondary self-start text-xs sm:self-center"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Status
          </button>
        </div>

        {/* Global Notifications */}
        {msg.text && (
          <div
            className={`my-6 flex items-center justify-between rounded-2xl border p-4 text-sm ${
              msg.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {msg.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <span>{msg.text}</span>
            </div>
            <button onClick={() => setMsg({ type: "", text: "" })} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.35fr]">
          {/* New Complaint Form */}
          <div>
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
                <Wrench size={20} className="text-indigo-600" /> Lodge New Complaint
              </h2>
              <p className="mt-1 text-xs text-slate-500">Provide details for the maintenance team.</p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Issue Title *</label>
                  <input
                    name="title"
                    required
                    placeholder="e.g. Leaking bathroom pipe"
                    className="field"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Category *</label>
                  <select name="category" required className="field bg-white">
                    <option value="">Select Category</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Wi-Fi / Internet">Wi-Fi / Internet</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">Hostel Block *</label>
                    <input
                      name="block"
                      required
                      placeholder="e.g. Block B"
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">Room No *</label>
                    <input
                      name="room"
                      required
                      placeholder="e.g. 304"
                      className="field"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Problem Description *</label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    placeholder="Describe the issue in detail..."
                    className="field"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Image URL (Optional)</label>
                  <input
                    name="imageUrl"
                    placeholder="https://example.com/photo.jpg"
                    className="field"
                    onChange={(e) => setImagePreview(e.target.value.trim())}
                  />
                  {imagePreview && (
                    <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                      <p className="mb-1 text-[11px] font-semibold text-slate-500">Image Preview:</p>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-28 w-full rounded-lg object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-3.5 text-sm"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Complaint"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Complaints History */}
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">My Complaint History</h2>
                <p className="text-xs text-slate-500">
                  {items.length} total {items.length === 1 ? "complaint" : "complaints"} filed
                </p>
              </div>

              <div className="relative">
                <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-indigo-500 sm:w-48"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mt-4 flex flex-wrap gap-1.5 border-b border-slate-200 pb-3">
              {["All", "Pending", "Assigned", "In Progress", "Resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                    filterStatus === status
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Complaints List */}
            <div className="mt-4 space-y-3">
              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">
                  <RefreshCw size={24} className="mx-auto animate-spin text-indigo-600" />
                  <p className="mt-2 text-sm">Loading complaints...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
                  <ClipboardList size={36} className="mx-auto text-slate-300" />
                  <h3 className="mt-3 font-bold text-slate-700">No complaints found</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {searchQuery || filterStatus !== "All"
                      ? "Try changing your search term or filter."
                      : "You have not lodged any maintenance complaints yet."}
                  </p>
                </div>
              ) : (
                filteredItems.map((c) => (
                  <div
                    key={c._id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <CategoryBadge category={c.category} />
                          <h3 className="font-bold text-slate-900">{c.title}</h3>
                        </div>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          <Building size={12} className="mr-1 inline text-slate-400" />
                          Block {c.block} · Room {c.room} · Lodged on {new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>

                    <p className="mt-3 text-sm text-slate-600">{c.description}</p>

                    {c.imageUrl && (
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => setActiveModalImage(c.imageUrl)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          <ImageIcon size={13} className="text-indigo-600" /> View Attached Photo
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {activeModalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setActiveModalImage(null)}
        >
          <div className="relative max-h-[85vh] max-w-2xl overflow-hidden rounded-2xl bg-white p-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X size={18} />
            </button>
            <img
              src={activeModalImage}
              alt="Complaint Attachment"
              className="max-h-[80vh] w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </Layout>
  );
}

// Stat Card Component
function StatCard({ title, value, Icon, colorClass, iconBg }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} ${colorClass}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("hostelfix_user") || "null");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalImage, setActiveModalImage] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api("/complaints");
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      loadData();
    }
  }, []);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    setError("");
    try {
      const updated = await api(`/complaints/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setItems((prev) => prev.map((item) => (item._id === id ? { ...item, ...updated } : item)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  const stats = {
    total: items.length,
    pending: items.filter((x) => x.status === "Pending").length,
    active: items.filter((x) => x.status === "Assigned" || x.status === "In Progress").length,
    resolved: items.filter((x) => x.status === "Resolved").length
  };

  const filtered = items.filter((item) => {
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    const studentName = item.student?.name || "";
    const studentEmail = item.student?.email || "";
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studentEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Top bar */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
              <ShieldCheck size={14} className="text-indigo-400" /> Admin & Warden Portal
            </div>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Maintenance Management</h1>
            <p className="mt-1 text-sm text-slate-500">Review student complaints and update resolution status.</p>
          </div>
          <button
            onClick={loadData}
            className="btn-secondary self-start text-xs sm:self-center"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Data
          </button>
        </div>

        {error && (
          <div className="my-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={() => setError("")}><X size={16} /></button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Complaints"
            value={stats.total}
            Icon={ClipboardList}
            colorClass="text-slate-800"
            iconBg="bg-slate-100"
          />
          <StatCard
            title="Pending Review"
            value={stats.pending}
            Icon={AlertTriangle}
            colorClass="text-amber-700"
            iconBg="bg-amber-100"
          />
          <StatCard
            title="In Progress"
            value={stats.active}
            Icon={Clock3}
            colorClass="text-blue-700"
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Resolved"
            value={stats.resolved}
            Icon={CheckCircle2}
            colorClass="text-emerald-700"
            iconBg="bg-emerald-100"
          />
        </div>

        {/* Main Complaints List */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">All Hostel Complaints</h2>
              <p className="mt-0.5 text-xs text-slate-500">Filter, search, and update complaint progress.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student, room, title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none focus:border-indigo-500 sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50/50 px-6 py-3">
            {["All", "Pending", "Assigned", "In Progress", "Resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                  filterStatus === status
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status} {status !== "All" && `(${items.filter((x) => x.status === status).length})`}
              </button>
            ))}
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-16 text-center text-slate-400">
                <RefreshCw size={28} className="mx-auto animate-spin text-indigo-600" />
                <p className="mt-2 text-sm">Loading complaints data...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <ClipboardList size={36} className="mx-auto text-slate-300" />
                <h3 className="mt-3 font-bold text-slate-700">No complaints matching filter</h3>
                <p className="mt-1 text-xs text-slate-400">Try selecting another status tab or clear the search.</p>
              </div>
            ) : (
              filtered.map((c) => (
                <div key={c._id} className="p-6 transition-colors hover:bg-slate-50/50">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <CategoryBadge category={c.category} />
                        <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                        <StatusBadge status={c.status} />
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>
                          <Building size={13} className="mr-1 inline text-slate-400" />
                          Block {c.block} · Room {c.room}
                        </span>
                        <span>
                          <User size={13} className="mr-1 inline text-slate-400" />
                          {c.student ? `${c.student.name} (${c.student.email})` : "Student info unavailable"}
                        </span>
                        <span>
                          <Clock3 size={13} className="mr-1 inline text-slate-400" />
                          {new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-slate-700 leading-relaxed">{c.description}</p>

                      {c.imageUrl && (
                        <div className="mt-3">
                          <button
                            onClick={() => setActiveModalImage(c.imageUrl)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                          >
                            <ImageIcon size={14} className="text-indigo-600" /> View Attached Photo
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:min-w-[280px]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Update Status
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {["Pending", "Assigned", "In Progress", "Resolved"].map((status) => {
                          const isCurrent = c.status === status;
                          const isUpdating = busyId === c._id;
                          return (
                            <button
                              key={status}
                              disabled={isCurrent || isUpdating}
                              onClick={() => handleStatusChange(c._id, status)}
                              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
                                isCurrent
                                  ? "bg-slate-900 text-white shadow-sm cursor-default"
                                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                              }`}
                            >
                              {isCurrent && <Check size={11} className="mr-1 inline" />}
                              {status}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Image Preview Modal */}
      {activeModalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setActiveModalImage(null)}
        >
          <div className="relative max-h-[85vh] max-w-2xl overflow-hidden rounded-2xl bg-white p-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X size={18} />
            </button>
            <img
              src={activeModalImage}
              alt="Complaint Attachment"
              className="max-h-[80vh] w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth register />} />
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
