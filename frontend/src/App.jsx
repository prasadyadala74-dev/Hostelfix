import { useState } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { ShieldCheck, Wrench, ClipboardList, LogOut, ArrowRight, CheckCircle2 } from "lucide-react";
import { api } from "./api";

function Layout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("hostelfix_user") || "null");
  const logout = () => { localStorage.clear(); navigate("/login"); };
  return <div className="min-h-screen">
    <header className="border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-black"><span className="rounded-xl bg-slate-900 p-2 text-white"><Wrench size={18}/></span>HostelFix</Link>
        {user && <div className="flex items-center gap-4"><span className="hidden text-sm text-slate-500 sm:block">Hi, {user.name}</span><button onClick={logout} className="flex items-center gap-1 text-sm font-semibold text-slate-600"><LogOut size={16}/> Logout</button></div>}
      </div>
    </header>{children}
  </div>
}

function Home() {
  return <Layout><main className="mx-auto max-w-6xl px-5 py-16"><div className="grid gap-10 md:grid-cols-2 md:items-center">
    <div><span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">Smart hostel maintenance</span><h1 className="mt-6 text-5xl font-black tracking-tight">Fix hostel problems.<br/><span className="text-indigo-600">Without the paperwork.</span></h1><p className="mt-5 max-w-xl text-lg text-slate-600">HostelFix lets students report issues, track progress and get resolutions while staff and wardens manage maintenance in one place.</p><div className="mt-8 flex gap-3"><Link to="/register" className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">Get started <ArrowRight className="ml-1 inline" size={17}/></Link><Link to="/login" className="rounded-xl border px-5 py-3 font-bold">Login</Link></div></div>
    <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl"><ClipboardList size={34}/><h2 className="mt-6 text-2xl font-bold">One place for every complaint</h2><div className="mt-6 space-y-3">{["Report issues in seconds","Track every status update","Give staff clear details"].map(x=><div className="flex gap-3 rounded-2xl bg-white/10 p-4" key={x}><CheckCircle2 className="text-emerald-400"/><span>{x}</span></div>)}</div></div>
  </div></main></Layout>
}

function Auth({ register=false }) {
  const navigate = useNavigate(); const [form,setForm]=useState({name:"",email:"",password:"",confirmPassword:""}); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  const submit = async e => { e.preventDefault(); setError(""); setLoading(true); try { const data=await api(register?"/auth/register":"/auth/login",{method:"POST",body:JSON.stringify(form)}); localStorage.setItem("hostelfix_token",data.token); localStorage.setItem("hostelfix_user",JSON.stringify(data.user)); navigate("/dashboard"); } catch(e){setError(e.message)} finally{setLoading(false)} };
  return <Layout><main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md items-center px-5 py-10"><div className="w-full rounded-3xl border bg-white p-7 shadow-sm"><div className="mb-7"><div className="mb-4 inline-flex rounded-2xl bg-indigo-50 p-3 text-indigo-600"><ShieldCheck/></div><h1 className="text-3xl font-black">{register?"Create your account":"Welcome back"}</h1><p className="mt-2 text-slate-500">{register?"Start managing hostel issues smarter.":"Sign in to your HostelFix account."}</p></div><form onSubmit={submit} className="space-y-4">
    {register&&<input required placeholder="Full name" className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>}
    <input required type="email" placeholder="Email address" className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
    <input required minLength="6" type="password" placeholder="Password" className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
    {register&&<input required minLength="6" type="password" placeholder="Confirm password" className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})}/>}
    {error&&<p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
    <button disabled={loading} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white disabled:opacity-50">{loading?"Please wait...":register?"Create account":"Login"}</button>
  </form><p className="mt-6 text-center text-sm text-slate-500">{register?"Already have an account? ":"New to HostelFix? "}<Link className="font-bold text-indigo-600" to={register?"/login":"/register"}>{register?"Login":"Create an account"}</Link></p></div></main></Layout>
}

function Dashboard() {
  const navigate=useNavigate(); const user=JSON.parse(localStorage.getItem("hostelfix_user")||"null"); const [items,setItems]=useState([]); const [msg,setMsg]=useState("");
  useState(()=>{api("/complaints").then(setItems).catch(e=>setMsg(e.message));});
  if(!user) return <Navigate to="/login"/>;
  const submit=async e=>{e.preventDefault(); const f=new FormData(e.target); try{const body=Object.fromEntries(f); const c=await api("/complaints",{method:"POST",body:JSON.stringify(body)});setItems([c,...items]);setMsg("Complaint submitted successfully.");e.target.reset()}catch(e){setMsg(e.message)}};
  return <Layout><main className="mx-auto max-w-6xl px-5 py-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-bold text-indigo-600">{user.role.toUpperCase()}</p><h1 className="text-4xl font-black">Dashboard</h1><p className="mt-2 text-slate-500">Report and track hostel maintenance issues.</p></div></div>
  {user.role==="student"&&<div className="mt-8 grid gap-7 lg:grid-cols-[.9fr_1.1fr]"><form onSubmit={submit} className="rounded-3xl border bg-white p-6 shadow-sm"><h2 className="text-xl font-black">New complaint</h2><div className="mt-5 space-y-3"><input name="title" required placeholder="Issue title" className="field"/><select name="category" required className="field"><option value="">Category</option><option>Plumbing</option><option>Electrical</option><option>Cleaning</option><option>Water</option><option>Wi-Fi</option><option>Furniture</option><option>Other</option></select><div className="grid grid-cols-2 gap-3"><input name="block" required placeholder="Block" className="field"/><input name="room" required placeholder="Room" className="field"/></div><textarea name="description" required rows="5" placeholder="Describe the problem..." className="field"/><input name="imageUrl" placeholder="Image URL (optional)" className="field"/><button className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white">Submit complaint</button></div></form><div><h2 className="text-xl font-black">My complaints</h2>{msg&&<p className="my-3 text-sm text-indigo-600">{msg}</p>}<div className="mt-4 space-y-3">{items.length?items.map(c=><div key={c._id} className="rounded-2xl border bg-white p-5"><div className="flex justify-between gap-4"><div><h3 className="font-bold">{c.title}</h3><p className="mt-1 text-sm text-slate-500">{c.category} · Block {c.block}, Room {c.room}</p></div><span className="h-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{c.status}</span></div><p className="mt-3 text-sm text-slate-600">{c.description}</p></div>):<div className="rounded-2xl border border-dashed p-8 text-center text-slate-500">No complaints yet.</div>}</div></div></div>}
  </main></Layout>
}

export default function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Auth/>}/><Route path="/register" element={<Auth register/>}/><Route path="/dashboard" element={<Dashboard/>}/></Routes>}
