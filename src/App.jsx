import { useState, useEffect, useCallback } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const API = "https://onechat-backend-production.up.railway.app/api";

// ─── API HELPER ──────────────────────────────────────────────────────────────
const api = async (path, options = {}) => {
  const token = localStorage.getItem("oc_token");
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  root: { display:"flex", flexDirection:"column", height:"100vh", background:"#0d0d12", color:"#e2e2f0", fontFamily:"'DM Sans','Segoe UI',sans-serif", overflow:"hidden" },
  topbar: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", height:50, background:"#13131a", borderBottom:"1px solid #1e1e2e", flexShrink:0, zIndex:20 },
  card: { background:"#16161f", border:"1px solid #1e1e2e", borderRadius:12 },
  badge: (c) => ({ background:c+"22", color:c, border:`1px solid ${c}44`, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }),
  btn: (c="#6c4fd8") => ({ background:c, border:"none", borderRadius:8, padding:"7px 16px", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:6 }),
  btnOutline: { background:"transparent", border:"1px solid #2a2a3e", borderRadius:8, padding:"6px 14px", color:"#a0a0c0", cursor:"pointer", fontSize:13 },
  input: { background:"#1e1e2e", border:"1px solid #2a2a3e", borderRadius:8, padding:"8px 12px", color:"#e2e2f0", fontSize:13, outline:"none", width:"100%", fontFamily:"inherit" },
};

// ─── SPINNER ─────────────────────────────────────────────────────────────────
const Spinner = ({ size = 20 }) => (
  <div style={{ width:size, height:size, border:`2px solid #2a2a3e`, borderTop:`2px solid #a78bfa`, borderRadius:"50%", animation:"spin 0.8s linear infinite", flexShrink:0 }}/>
);

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [form, setForm] = useState({ username:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const data = await api("/auth/login", { method:"POST", body: form });
      localStorage.setItem("oc_token", data.token);
      onLogin(data.user);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display:"flex", height:"100vh", background:"#080810", fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        input::placeholder { color:#3a3a6a; }
        .login-input:focus { border-color:#7c5af0 !important; outline:none; }
      `}</style>
      <div style={{ flex:1, background:"linear-gradient(135deg,#080810,#0e0e1a,#0d0820)", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"40px 48px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"40%", left:"40%", transform:"translate(-50%,-50%)", width:500, height:500, background:"radial-gradient(circle,rgba(124,90,240,0.1),transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <a href="/landing.html" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
            <div style={{ width:36, height:36, borderRadius:9, background:"linear-gradient(135deg,#7c5af0,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>⚡</div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:19, color:"#e8e8f5" }}>Boost<span style={{ color:"#7c5af0" }}>Chat</span></span>
          </a>
          <a href="/landing.html" style={{ display:"flex", alignItems:"center", gap:6, color:"#6060a0", fontSize:13, textDecoration:"none", border:"1px solid #1e1e35", borderRadius:8, padding:"6px 14px" }}>← Back to site</a>
        </div>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(124,90,240,0.1)", border:"1px solid rgba(124,90,240,0.25)", borderRadius:100, padding:"5px 14px", fontSize:11, fontWeight:700, color:"#a78bfa", letterSpacing:0.5, marginBottom:28 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#3ecfb2", boxShadow:"0 0 8px #3ecfb2", animation:"pulse 2s infinite", display:"inline-block" }}></span>
            PRIVATE · INVITE ONLY
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px,4vw,58px)", fontWeight:800, letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:16, color:"#e8e8f5" }}>
            Your business.<br/>
            <span style={{ background:"linear-gradient(135deg,#7c5af0,#3ecfb2)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Fully wired.</span>
          </h1>
          <p style={{ color:"#6060a0", fontSize:15, lineHeight:1.7, maxWidth:380, marginBottom:32 }}>Sign in to access your BoostChat dashboard and manage your operations in real time.</p>
          <a href="https://t.me/yeyeyewepaid" target="_blank" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#0088cc", color:"#fff", borderRadius:10, padding:"12px 24px", fontSize:14, fontWeight:700, textDecoration:"none" }}>✈ Contact on Telegram</a>
        </div>
        <div style={{ display:"flex", gap:16 }}>
          {[["⚡","Real-time","Operations"],["🔒","100%","Private"],["24/7","Always","Online"]].map(([icon,val,label],i) => (
            <div key={i} style={{ flex:1, background:"rgba(255,255,255,0.03)", border:"1px solid #1e1e35", borderRadius:12, padding:"14px 16px" }}>
              <div style={{ fontSize:18, marginBottom:6 }}>{icon}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#e8e8f5" }}>{val}</div>
              <div style={{ fontSize:11, color:"#5050a0", marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width:460, background:"#0e0e1a", display:"flex", flexDirection:"column", justifyContent:"center", padding:"48px", borderLeft:"1px solid #1e1e35" }}>
        <div style={{ marginBottom:36 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, marginBottom:6, color:"#e8e8f5", letterSpacing:"-0.5px" }}>Welcome back</h2>
          <p style={{ color:"#5050a0", fontSize:14 }}>Sign in to your BoostChat account.</p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#6060a0", marginBottom:6 }}>USERNAME OR EMAIL</label>
            <input className="login-input" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="Enter your username..."
              style={{ width:"100%", background:"#12121f", border:`1px solid ${error?"#e05050":"#1e1e35"}`, borderRadius:10, padding:"12px 16px", color:"#e8e8f5", fontSize:14, fontFamily:"inherit" }} autoComplete="username"/>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#6060a0", marginBottom:6 }}>PASSWORD</label>
            <input className="login-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter your password..."
              style={{ width:"100%", background:"#12121f", border:"1px solid #1e1e35", borderRadius:10, padding:"12px 16px", color:"#e8e8f5", fontSize:14, fontFamily:"inherit" }} autoComplete="current-password"/>
          </div>
          {error && <div style={{ background:"rgba(224,80,80,0.1)", border:"1px solid rgba(224,80,80,0.25)", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#f87171", marginBottom:16 }}>⚠ {error}</div>}
          <button type="submit" disabled={loading} style={{ width:"100%", background:"#7c5af0", border:"none", borderRadius:10, padding:"13px", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 8px 24px rgba(124,90,240,0.3)" }}>
            {loading ? <div style={{ width:18, height:18, border:"2px solid #ffffff44", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/> : null}
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>
        <div style={{ textAlign:"center", marginTop:24, fontSize:12, color:"#3a3a6a" }}>
          Don't have access?{" "}
          <a href="https://t.me/yeyeyewepaid" target="_blank" style={{ color:"#7c5af0", textDecoration:"none", fontWeight:600 }}>Contact us on Telegram</a>
        </div>
      </div>
    </div>
  );
};

// ─── MINI CHART ──────────────────────────────────────────────────────────────
const MiniChart = ({ data = [], color = "#6c4fd8", valueKey = "revenue" }) => {
  if (!data.length) return <div style={{ height:160, display:"flex", alignItems:"center", justifyContent:"center", color:"#3a3a5a", fontSize:12 }}>No data yet</div>;
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  const w = 600, h = 160;
  const pts = data.map((d,i) => `${(i/(data.length-1||1))*w},${h-(d[valueKey]/max)*(h-10)-5}`);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width:"100%", height:160 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill="url(#cg)"/>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>
    </svg>
  );
};

// ─── TOP BAR ─────────────────────────────────────────────────────────────────
const TopBar = ({ user, onLogout, showNotifs, setShowNotifs, setPage, setSelectedNode }) => (
  <div style={S.topbar}>
    <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => { setPage("hub"); setSelectedNode(null); }}>
      <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#7c5af0,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>⚡</div>
      <span style={{ fontWeight:800, fontSize:15, background:"linear-gradient(90deg,#a78bfa,#60a5fa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>BoostChat</span>
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ position:"relative" }}>
        <button onClick={e=>{ e.stopPropagation(); setShowNotifs(v=>!v); }} style={{ ...S.btnOutline, padding:"5px 10px", position:"relative" }}>
          🔔
          <span style={{ position:"absolute", top:-5, right:-5, background:"#e05050", borderRadius:"50%", width:17, height:17, fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700 }}>!</span>
        </button>
        {showNotifs && (
          <div style={{ position:"absolute", right:0, top:42, width:300, ...S.card, zIndex:100, boxShadow:"0 20px 60px #00000090" }} onClick={e=>e.stopPropagation()}>
            <div style={{ padding:"12px 16px", borderBottom:"1px solid #1e1e2e", fontWeight:700, fontSize:13 }}>Notifications</div>
            <div style={{ padding:"20px", textAlign:"center", color:"#5050a0", fontSize:13 }}>No new notifications</div>
          </div>
        )}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, background:"#1e1e2e", border:"1px solid #2a2a3e", borderRadius:8, padding:"4px 12px", cursor:"pointer", fontSize:13 }} onClick={onLogout}>
        <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#6c4fd8,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>
          {user?.username?.[0]?.toUpperCase() || "U"}
        </div>
        {user?.username || "User"} ▾
      </div>
    </div>
  </div>
);

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const Sidebar = ({ page, setPage, nodes, nodesLoading, selectedNode, setSelectedNode, collapsed, setCollapsed }) => {
  const profilePages = ["settings","notifications"];
  const isProfilePage = profilePages.includes(page);
  const [profileOpen, setProfileOpen] = useState(isProfilePage);

  return (
    <div style={{ width:collapsed?52:220, background:"#13131a", borderRight:"1px solid #1e1e2e", display:"flex", flexDirection:"column", transition:"width 0.2s", flexShrink:0, overflow:"hidden" }}>
      {!collapsed && (
        <div style={{ padding:"14px 10px", borderBottom:"1px solid #1e1e2e" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"6px 8px", borderRadius:10, background:"#1e1e2e" }}>
            <div style={{ width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#6c4fd8,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:800, flexShrink:0 }}>S</div>
            <div><div style={{ fontWeight:700, fontSize:14 }}>Samchip</div><div style={{ fontSize:11, color:"#6060a0" }}>Business</div></div>
            <div style={{ marginLeft:"auto", color:"#6060a0" }}>›</div>
          </div>
        </div>
      )}
      <div style={{ padding:"8px 6px", flex:1, overflowY:"auto" }}>
        {!collapsed && <div style={{ fontSize:10, color:"#3a3a5a", padding:"4px 8px 4px", textTransform:"uppercase", letterSpacing:1.2 }}>Navigation</div>}
        {[{id:"hub",label:"Hub",icon:"⊞"},{id:"bots",label:"Bots",icon:"🤖"},{id:"nodes",label:"Nodes",icon:"⬡"}].map(item => (
          <button key={item.id} onClick={() => { setPage(item.id); setSelectedNode(null); }}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, border:"none",
              background:page===item.id?"#6c4fd822":"transparent", color:page===item.id?"#a78bfa":"#c0c0e0",
              cursor:"pointer", fontSize:13, fontWeight:page===item.id?700:400, marginBottom:2, justifyContent:collapsed?"center":"flex-start" }}>
            <span style={{ fontSize:15 }}>{item.icon}</span>
            {!collapsed && <span style={{ flex:1, textAlign:"left" }}>{item.label}</span>}
          </button>
        ))}

        {!collapsed && (
          <>
            <div style={{ fontSize:10, color:"#3a3a5a", padding:"12px 8px 4px", textTransform:"uppercase", letterSpacing:1.2 }}>Nodes</div>
            {nodesLoading ? (
              <div style={{ padding:"8px 10px", display:"flex", alignItems:"center", gap:8 }}><Spinner size={14}/><span style={{ fontSize:12, color:"#6060a0" }}>Loading...</span></div>
            ) : nodes.length === 0 ? (
              <div style={{ padding:"8px 10px", fontSize:12, color:"#4040a0" }}>No nodes yet</div>
            ) : nodes.map(node => {
              const isOpen = selectedNode?.id === node.id;
              return (
                <div key={node.id}>
                  <button onClick={() => { setSelectedNode(isOpen?null:node); setPage(isOpen?"nodes":"node-detail"); }}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:8, border:"none",
                      background:isOpen?"#6c4fd822":"transparent", color:isOpen?"#a78bfa":"#c0c0e0", cursor:"pointer", fontSize:13, marginBottom:2 }}>
                    <div style={{ width:26, height:26, borderRadius:7, background:isOpen?"#6c4fd833":"#1e1e2e", border:isOpen?"1px solid #6c4fd855":"1px solid #2a2a3e", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, flexShrink:0, color:isOpen?"#a78bfa":"#c0c0e0" }}>
                      {node.name[0].toUpperCase()}
                    </div>
                    <span style={{ flex:1, textAlign:"left" }}>{node.name}</span>
                    <span style={{ color:"#6060a0", fontSize:11 }}>{isOpen?"▼":"›"}</span>
                  </button>
                  {isOpen && (
                    <div style={{ marginLeft:12, marginBottom:4, borderLeft:"1px solid #2a2a3e", paddingLeft:12 }}>
                      {[["settings","Settings"],["customers","Customers"],["tickets","Tickets"],["analytics","Analytics"],["reports","Reports"],["logs","Logs"]].map(([sub,label]) => (
                        <button key={sub} onClick={() => setPage(sub==="settings"?"node-detail":sub)}
                          style={{ width:"100%", display:"flex", alignItems:"center", gap:6, padding:"6px 8px", borderRadius:6, border:"none",
                            background:"transparent", color:page===(sub==="settings"?"node-detail":sub)?"#a78bfa":"#8080a0", cursor:"pointer", fontSize:12, marginBottom:1 }}>
                          <span style={{ width:5, height:5, borderRadius:"50%", background:page===(sub==="settings"?"node-detail":sub)?"#a78bfa":"#4040a0", flexShrink:0, display:"inline-block" }}></span>
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ fontSize:10, color:"#3a3a5a", padding:"12px 8px 4px", textTransform:"uppercase", letterSpacing:1.2 }}>Account</div>
            <button onClick={() => setProfileOpen(!profileOpen)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, border:"none",
                background:isProfilePage?"#6c4fd822":"transparent", color:isProfilePage?"#a78bfa":"#c0c0e0", cursor:"pointer", fontSize:13, marginBottom:2 }}>
              <span style={{ fontSize:15 }}>👤</span>
              <span style={{ flex:1, textAlign:"left" }}>Profile</span>
              <span style={{ color:"#6060a0", fontSize:11 }}>{profileOpen?"▼":"›"}</span>
            </button>
            {profileOpen && (
              <div style={{ marginLeft:12, marginBottom:4, borderLeft:"1px solid #2a2a3e", paddingLeft:12 }}>
                {["settings","notifications"].map(sub => (
                  <button key={sub} onClick={() => { setPage(sub); setSelectedNode(null); }}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:6, padding:"6px 8px", borderRadius:6, border:"none",
                      background:"transparent", color:page===sub?"#a78bfa":"#8080a0", cursor:"pointer", fontSize:12, marginBottom:1 }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:page===sub?"#a78bfa":"#4040a0", flexShrink:0, display:"inline-block" }}></span>
                    <span style={{ textTransform:"capitalize" }}>{sub}</span>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => { localStorage.removeItem("oc_token"); window.location.reload(); }}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, border:"none", background:"transparent", color:"#c0c0e0", cursor:"pointer", fontSize:13, marginBottom:2 }}>
              <span style={{ fontSize:15 }}>🚪</span>
              <span style={{ flex:1, textAlign:"left" }}>Sign-out</span>
            </button>
          </>
        )}
      </div>
      <button onClick={() => setCollapsed(!collapsed)} style={{ margin:"8px 6px 10px", padding:"8px", borderRadius:8, border:"none", background:"#1e1e2e", color:"#6060a0", cursor:"pointer", fontSize:14 }}>
        {collapsed?"»":"«"}
      </button>
    </div>
  );
};

// ─── HUB PAGE ────────────────────────────────────────────────────────────────
const HubPage = ({ user, nodes, setPage, setSelectedNode }) => {
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState(true);
  useEffect(() => {
    setTimeout(() => setToast(false), 4000);
    const load = async () => {
      if (!nodes.length) return;
      let totalRevenue=0, totalTickets=0, activeUsers=0;
      for (const node of nodes) {
        try {
          const data = await api(`/analytics/${node.id}?period=1`);
          totalRevenue += parseFloat(data.overview?.total_revenue||0);
          totalTickets += parseInt(data.overview?.paid_tickets||0);
          activeUsers += parseInt(data.overview?.unique_customers||0);
        } catch {}
      }
      setStats({ revenue:totalRevenue, paidTickets:totalTickets, activeUsers });
    };
    load();
  }, [nodes]);

  return (
    <div>
      <h1 style={{ margin:"0 0 4px", fontSize:24, fontWeight:800 }}>Dashboard</h1>
      <p style={{ margin:"0 0 24px", color:"#6060a0", fontSize:13 }}>View your analytics and statistics for your bots and webapps.</p>
      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:20, marginBottom:24 }}>
        <div style={{ ...S.card, padding:"32px 28px", background:"linear-gradient(135deg,#1a1030,#1e1535 60%,#0d1525)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:24, top:"50%", transform:"translateY(-50%)", fontSize:90, opacity:0.1 }}>⚡</div>
          <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:2, color:"#a78bfa66", marginBottom:10, fontWeight:700 }}>WELCOME BACK</div>
          <div style={{ fontSize:30, fontWeight:900, color:"#a78bfa", marginBottom:10 }}>{user?.username?.toUpperCase()}!</div>
          <p style={{ margin:"0 0 20px", color:"#8080a0", fontSize:13, lineHeight:1.6, maxWidth:300 }}>We are happy to see you again. Your dashboard is ready.</p>
          <button onClick={() => setPage("nodes")} style={{ ...S.btn(), fontSize:13 }}>Go to your nodes →</button>
        </div>
        <div style={{ ...S.card, padding:"28px", background:"linear-gradient(135deg,#0d1a10,#122010)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:20, top:20, fontSize:70, opacity:0.06, fontWeight:900 }}>$</div>
          <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:2, color:"#34d39866", marginBottom:8, fontWeight:700 }}>TODAY'S REVENUE</div>
          <div style={{ fontSize:40, fontWeight:900, color:"#34d398", marginBottom:8 }}>
            {stats ? `$${stats.revenue.toFixed(2)}` : <Spinner/>}
          </div>
          <div style={{ fontSize:12, color:"#5060a0", lineHeight:1.6 }}>Live data from all your active nodes.</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:16, marginBottom:24 }}>
        {[
          { label:"TODAY'S ACTIVE USERS", value:stats?.activeUsers??"—", icon:"👥", color:"#f59e0b" },
          { label:"TODAY'S PAID TICKETS", value:stats?.paidTickets??"—", icon:"🎫", color:"#60a5fa" },
          { label:"ACTIVE NODES", value:nodes.length, icon:"⬡", color:"#a78bfa" },
        ].map((s,i) => (
          <div key={i} style={{ ...S.card, padding:"20px 24px", flex:1, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:16, top:16, fontSize:44, opacity:0.12 }}>{s.icon}</div>
            <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1.5, color:s.color+"88", marginBottom:8, fontWeight:700 }}>{s.label}</div>
            <div style={{ fontSize:32, fontWeight:900, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", gap:8 }}>
          <span>⬡</span><span style={{ fontWeight:700, fontSize:13 }}>Your Nodes</span>
        </div>
        {nodes.length===0 ? (
          <div style={{ padding:"32px", textAlign:"center", color:"#4040a0" }}>
            <div style={{ fontSize:32, marginBottom:12 }}>⬡</div>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:8 }}>No nodes yet</div>
            <button onClick={() => setPage("nodes")} style={{ ...S.btn(), margin:"0 auto" }}>+ Create Node</button>
          </div>
        ) : nodes.map(node => (
          <div key={node.id} onClick={() => { setSelectedNode(node); setPage("node-detail"); }}
            style={{ padding:"12px 18px", borderBottom:"1px solid #1a1a2a", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
            <div style={{ width:34, height:34, borderRadius:9, background:"#1e1e2e", border:"1px solid #2a2a3e", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, flexShrink:0 }}>{node.name[0].toUpperCase()}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700 }}>{node.name}</div>
              <div style={{ fontSize:11, color:"#5050a0" }}>{node.type} · {node.timezone}</div>
            </div>
            <span style={{ background:"#34d39822", color:"#34d398", border:"1px solid #34d39844", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{node.status}</span>
          </div>
        ))}
        <div style={{ padding:"12px 18px" }}>
          <button onClick={() => setPage("nodes")} style={{ ...S.btn(), fontSize:12 }}>+ Add new node</button>
        </div>
      </div>
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, background:"#22c55e", color:"#fff", borderRadius:10, padding:"12px 20px", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:8, boxShadow:"0 8px 30px #22c55e44", zIndex:999 }}>
          ✓ Successfully signed in.
        </div>
      )}
    </div>
  );
};

// ─── BOTS PAGE ────────────────────────────────────────────────────────────────
const BotsPage = ({ nodes, refreshNodes }) => {
  const [allBots, setAllBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ node_id:"", platform:"telegram", token:"", bot_name:"" });
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let bots = [];
      for (const node of nodes) {
        const data = await api(`/nodes/${node.id}`);
        (data.bots||[]).forEach(b => bots.push({ ...b, nodeName:node.name, nodeId:node.id }));
      }
      setAllBots(bots);
    } catch {}
    finally { setLoading(false); }
  }, [nodes]);

  useEffect(() => { load(); }, [load]);

  const telegramBots = allBots.filter(b => b.platform==="telegram");
  const boostBots = allBots.filter(b => b.platform==="revolt" || b.platform==="boostchat");

  const addBot = async () => {
    if (!form.token || !form.node_id) return;
    setAdding(true);
    try {
      await api(`/nodes/${form.node_id}/bots`, { method:"POST", body: form });
      setShowForm(false);
      setForm({ node_id:"", platform:"telegram", token:"", bot_name:"" });
      load();
    } catch (err) { alert(err.message); }
    finally { setAdding(false); }
  };

  const removeBot = async (nodeId, botId) => {
    if (!confirm("Remove this bot?")) return;
    try {
      await api(`/nodes/${nodeId}/bots/${botId}`, { method:"DELETE" });
      load();
    } catch (err) { alert(err.message); }
  };

  const BotSection = ({ title, icon, color, bots, platform }) => (
    <div style={{ ...S.card, marginBottom:24 }}>
      <div style={{ padding:"14px 20px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ width:22, height:22, borderRadius:6, background:color+"22", border:`1px solid ${color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color }}>{icon}</span>
          <span style={{ fontWeight:700, fontSize:14 }}>{title}</span>
        </div>
        <button onClick={() => { setForm({...form, platform}); setShowForm(true); }} style={{ ...S.btn("#1e1e2e"), border:"1px solid #2a2a3e", color:"#a0a0c0", fontSize:12 }}>+ Add bot</button>
      </div>

      <div style={{ padding:"16px 20px 6px" }}>
        <div style={{ fontSize:13, fontWeight:700, marginBottom:4 }}>Your connected {title}</div>
        <p style={{ fontSize:12, color:"#6060a0", marginBottom:16, lineHeight:1.6 }}>
          {platform==="telegram"
            ? "Telegram bots are third-party applications that run inside Telegram. Users can interact with bots by sending them messages, commands, and inline requests."
            : "BoostChat bots power your internal worker chat system. Workers receive and reply to customer tickets directly through the BoostChat interface."}
        </p>

        {loading ? <div style={{ display:"flex", gap:10, padding:"12px 0", color:"#6060a0" }}><Spinner size={14}/> Loading...</div>
        : bots.length === 0 ? (
          <div style={{ background:"#1a1a28", border:"1px solid #2a2a3e", borderRadius:10, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <div>
              <div style={{ fontSize:13, color:"#6060a0" }}>No bot(s) have been added yet.</div>
              <div style={{ fontSize:12, color:"#4040a0" }}>Once you add a new bot, it will show up here.</div>
            </div>
            <button onClick={() => { setForm({...form,platform}); setShowForm(true); }} style={{ ...S.btn(), fontSize:12 }}>Add a new bot</button>
          </div>
        ) : bots.map(bot => (
          <div key={bot.id} style={{ background:"#1a1a28", border:"1px solid #2a2a3e", borderRadius:10, padding:"14px 20px", display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:color+"22", display:"flex", alignItems:"center", justifyContent:"center", color, fontSize:16, fontWeight:900 }}>{icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:13, fontWeight:700 }}>{bot.bot_name || "Unnamed bot"}</span>
                <span style={{ background:"#34d39822", color:"#34d398", border:"1px solid #34d39844", borderRadius:4, padding:"1px 8px", fontSize:10, fontWeight:700 }}>TOKEN VALID</span>
              </div>
              <div style={{ fontSize:11, color:"#5050a0" }}>This bot was added on {new Date(bot.created_at).toLocaleDateString()} · Node: {bot.nodeName}</div>
            </div>
            <button style={{ ...S.btn("#1e1e2e"), border:"1px solid #2a2a3e", color:"#60a5fa", fontSize:12 }}>✦ Edit</button>
            <button onClick={() => removeBot(bot.nodeId, bot.id)} style={{ ...S.btn("#e05050"), fontSize:12 }}>✕ Remove</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h1 style={{ margin:"0 0 4px", fontSize:24, fontWeight:800 }}>Bots</h1>
      <p style={{ margin:"0 0 24px", color:"#6060a0", fontSize:13 }}>Manage the different bots connected to your account.</p>

      <div style={{ ...S.card, marginBottom:24, background:"linear-gradient(135deg,#1a1a28,#1e1e30)", padding:"20px 24px" }}>
        <h3 style={{ fontWeight:800, fontSize:16, marginBottom:8 }}>Just getting started?</h3>
        <p style={{ fontSize:13, color:"#8080a0", lineHeight:1.7, maxWidth:700 }}>
          Bots are the foundation of your service, enabling seamless communication across various platform APIs.
          Connect your Telegram bots to start receiving customer tickets, and add a BoostChat bot to power your internal worker chat.
        </p>
      </div>

      <BotSection title="Telegram bots" icon="✈" color="#60a5fa" bots={telegramBots} platform="telegram"/>
      <BotSection title="BoostChat bots" icon="⚡" color="#a78bfa" bots={boostBots} platform="boostchat"/>

      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"#00000088", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }} onClick={() => setShowForm(false)}>
          <div style={{ ...S.card, padding:"28px", width:500, boxShadow:"0 20px 60px #00000090" }} onClick={e=>e.stopPropagation()}>
            <h3 style={{ margin:"0 0 4px", fontSize:16, fontWeight:700 }}>Add a new bot</h3>
            <p style={{ margin:"0 0 20px", color:"#6060a0", fontSize:13 }}>Connect a bot to one of your nodes.</p>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:12, color:"#8080a0", marginBottom:5, fontWeight:600 }}>Node</label>
              <select style={S.input} value={form.node_id} onChange={e=>setForm({...form,node_id:e.target.value})}>
                <option value="">Select a node...</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:12, color:"#8080a0", marginBottom:5, fontWeight:600 }}>Platform</label>
              <select style={S.input} value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})}>
                <option value="telegram">Telegram</option>
                <option value="boostchat">BoostChat</option>
              </select>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:12, color:"#8080a0", marginBottom:5, fontWeight:600 }}>Bot Token</label>
              <input style={S.input} placeholder="Paste bot token..." value={form.token} onChange={e=>setForm({...form,token:e.target.value})}/>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:"block", fontSize:12, color:"#8080a0", marginBottom:5, fontWeight:600 }}>Bot Name</label>
              <input style={S.input} placeholder="e.g. Sam Tele" value={form.bot_name} onChange={e=>setForm({...form,bot_name:e.target.value})}/>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button style={S.btnOutline} onClick={() => setShowForm(false)}>Cancel</button>
              <button style={S.btn()} disabled={adding} onClick={addBot}>
                {adding ? <Spinner size={14}/> : null}
                {adding ? "Adding..." : "Add Bot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── NODES PAGE ───────────────────────────────────────────────────────────────
const NodesPage = ({ nodes, nodesLoading, refreshNodes, setSelectedNode, setPage }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", timezone:"America/New_York", domain:"" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const createNode = async () => {
    if (!form.name) return setError("Node name is required");
    setCreating(true); setError("");
    try {
      await api("/nodes", { method:"POST", body:form });
      setForm({ name:"", timezone:"America/New_York", domain:"" });
      setShowForm(false);
      refreshNodes();
    } catch (err) { setError(err.message); }
    finally { setCreating(false); }
  };

  const deleteNode = async (id) => {
    if (!confirm("Delete this node?")) return;
    try { await api(`/nodes/${id}`, { method:"DELETE" }); refreshNodes(); }
    catch (err) { alert(err.message); }
  };

  return (
    <div>
      <h1 style={{ margin:"0 0 4px", fontSize:24, fontWeight:800 }}>Nodes</h1>
      <p style={{ margin:"0 0 24px", color:"#6060a0", fontSize:13 }}>Manage your own nodes or create new ones with ease!</p>
      <div style={{ ...S.card, marginBottom:24 }}>
        <div onClick={() => setShowForm(!showForm)} style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", borderBottom:showForm?"1px solid #1e1e2e":"none" }}>
          <span style={{ color:"#a78bfa" }}>+</span>
          <span style={{ fontWeight:700, fontSize:14 }}>Add a new node</span>
          <span style={{ marginLeft:"auto", color:"#6060a0" }}>{showForm?"▲":"▼"}</span>
        </div>
        {showForm && (
          <div style={{ padding:"20px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div>
                <label style={{ display:"block", fontSize:12, color:"#8080a0", marginBottom:5, fontWeight:600 }}>Node name *</label>
                <input style={S.input} placeholder="e.g. Sam" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
              </div>
              <div>
                <label style={{ display:"block", fontSize:12, color:"#8080a0", marginBottom:5, fontWeight:600 }}>Timezone</label>
                <input style={S.input} value={form.timezone} onChange={e=>setForm({...form,timezone:e.target.value})}/>
              </div>
              <div>
                <label style={{ display:"block", fontSize:12, color:"#8080a0", marginBottom:5, fontWeight:600 }}>Business domain (optional)</label>
                <input style={S.input} placeholder="mydomain.com" value={form.domain} onChange={e=>setForm({...form,domain:e.target.value})}/>
              </div>
            </div>
            {error && <div style={{ color:"#f87171", fontSize:12, marginBottom:12 }}>⚠ {error}</div>}
            <button onClick={createNode} disabled={creating} style={{ ...S.btn(), fontSize:13 }}>
              {creating ? <Spinner size={14}/> : null}
              {creating ? "Creating..." : "+ Create business node"}
            </button>
          </div>
        )}
      </div>
      {nodesLoading ? <div style={{ display:"flex", gap:12, padding:"32px", color:"#6060a0" }}><Spinner/> Loading...</div>
      : nodes.length===0 ? (
        <div style={{ ...S.card, padding:"48px", textAlign:"center", color:"#4040a0" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>⬡</div>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>No nodes yet</div>
        </div>
      ) : nodes.map(node => (
        <div key={node.id} style={{ ...S.card, marginBottom:16 }}>
          <div style={{ padding:"14px 20px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontWeight:700, fontSize:13 }}>{node.name}</span>
            <span style={{ background:"#34d39822", color:"#34d398", border:"1px solid #34d39844", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{node.status}</span>
          </div>
          <div style={{ padding:"20px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              {[["Node name",node.name],["Type",node.type],["Timezone",node.timezone],["Created",new Date(node.created_at).toLocaleDateString()]].map(([k,v]) => (
                <div key={k} style={{ fontSize:12 }}><span style={{ color:"#6060a0" }}>⊙ {k} </span><span>{v}</span></div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => { setSelectedNode(node); setPage("node-detail"); }} style={{ ...S.btn("#4a90e2"), fontSize:12 }}>✏ Manage</button>
              <button onClick={() => deleteNode(node.id)} style={{ ...S.btn("#e05050"), fontSize:12 }}>✕ Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


// ─── TELEGRAM SETTINGS TAB ───────────────────────────────────────────────────
const TelegramSettingsTab = ({ node }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [commands, setCommands] = useState([]);
  const [services, setServices] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newCmd, setNewCmd] = useState({ cmd:"", desc:"", message_content:"", attached_services:[] });
  const [newService, setNewService] = useState({ name:"", open_message_content:"", attached_questions:[] });
  const [newQuestion, setNewQuestion] = useState({ question:"", question_type:"text", options:[] });
  const [expandedCmd, setExpandedCmd] = useState(null);
  const [expandedSvc, setExpandedSvc] = useState(null);
  const [expandedQ, setExpandedQ] = useState(null);
  const [dragSvc, setDragSvc] = useState(null);
  const [dragQ, setDragQ] = useState(null);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await api(`/nodes/${node.id}/settings`);
      setCommands(data.commands || []);
      setServices(data.services || []);
      setQuestions(data.questions || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadSettings(); }, [node.id]);

  const saveAll = async () => {
    setSaving(true); setError(""); setSuccess("");
    try {
      await api(`/nodes/${node.id}/settings`, {
        method: "PUT",
        body: { commands, services, questions }
      });
      setSuccess("Settings saved!");
      setTimeout(() => setSuccess(""), 3000);
      await loadSettings();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const addCommand = () => {
    if (!newCmd.cmd) return;
    setCommands([...commands, { ...newCmd, id: Date.now().toString() }]);
    setNewCmd({ cmd:"", desc:"", message_content:"", attached_services:[] });
  };

  const addService = () => {
    if (!newService.name) return;
    setServices([...services, { ...newService, id: Date.now().toString() }]);
    setNewService({ name:"", open_message_content:"", attached_questions:[] });
  };

  const addQuestion = () => {
    if (!newQuestion.question) return;
    setQuestions([...questions, { ...newQuestion, id: Date.now().toString() }]);
    setNewQuestion({ question:"", question_type:"text", options:[] });
  };

  const toggleServiceOnCommand = (cmdId, svcName) => {
    setCommands(commands.map(c => {
      if (c.id !== cmdId && c.cmd !== cmdId) return c;
      const attached = c.attached_services || [];
      return { ...c, attached_services: attached.includes(svcName)
        ? attached.filter(s => s !== svcName)
        : [...attached, svcName] };
    }));
  };

  const toggleQuestionOnService = (svcId, qId) => {
    setServices(services.map(s => {
      if (s.id !== svcId) return s;
      const attached = s.attached_questions || [];
      return { ...s, attached_questions: attached.includes(qId)
        ? attached.filter(q => q !== qId)
        : [...attached, qId] };
    }));
  };

  if (loading) return <div style={{ padding:"32px", display:"flex", gap:12, color:"#6060a0" }}><Spinner size={14}/> Loading settings...</div>;

  // Drag helpers
  const onDragStartSvc = (e, name) => { setDragSvc(name); e.dataTransfer.effectAllowed = "move"; };
  const onDragStartQ = (e, qId) => { setDragQ(qId); e.dataTransfer.effectAllowed = "move"; };

  return (
    <div>
      {error && <div style={{ background:"#e0505022", border:"1px solid #e0505044", borderRadius:8, padding:"10px 14px", color:"#f87171", fontSize:13, marginBottom:16 }}>⚠ {error}</div>}
      {success && <div style={{ background:"#34d39822", border:"1px solid #34d39844", borderRadius:8, padding:"10px 14px", color:"#34d398", fontSize:13, marginBottom:16 }}>✓ {success}</div>}

      {/* ── COMMANDS ── */}
      <div style={{ ...S.card, marginBottom:16 }}>
        <div style={{ padding:"12px 20px", borderBottom:"1px solid #1e1e2e" }}>
          <div style={{ fontWeight:700, fontSize:13, color:"#60a5fa" }}>Commands</div>
          <div style={{ fontSize:12, color:"#6060a0", marginTop:2 }}>Configure your bot commands. The /start command shows the service menu.</div>
        </div>
        <div style={{ padding:"16px 20px" }}>
          {commands.map((c, i) => (
            <div key={c.id || i} style={{ background:"#1a1a28", border:"1px solid #2a2a3e", borderRadius:8, padding:"10px 16px", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:expandedCmd===i?8:0 }}>
                <div>
                  <span style={{ color:"#60a5fa", fontWeight:700, fontSize:13 }}>{c.cmd}</span>
                  <span style={{ color:"#6060a0", fontSize:12, marginLeft:8 }}>{c.desc}</span>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={() => setExpandedCmd(expandedCmd===i?null:i)} style={{ ...S.btnOutline, fontSize:11, padding:"3px 10px" }}>
                    {expandedCmd===i?"▲":"▼"}
                  </button>
                  <button onClick={() => { if(window.confirm("Delete this command?")) setCommands(commands.filter((_,j)=>j!==i)); }} style={{ ...S.btnOutline, fontSize:11, padding:"3px 10px", color:"#e05050", borderColor:"#e0505044" }}>✕</button>
                </div>
              </div>
              {expandedCmd===i && (
                <div style={{ marginTop:8 }}>
                  <div style={{ fontSize:11, color:"#6060a0", marginBottom:6, fontWeight:600 }}>Welcome message</div>
                  <textarea value={c.message_content||""} onChange={e => setCommands(commands.map((cmd,j)=>j===i?{...cmd,message_content:e.target.value}:cmd))}
                    style={{ ...S.input, minHeight:60, resize:"vertical", fontSize:12, marginBottom:10 }} placeholder="Message shown when customer uses this command..."/>
                  <div style={{ fontSize:11, color:"#6060a0", marginBottom:6, fontWeight:600 }}>Command image (sent before message)</div>
                  {c.message_image && (
                    <div style={{ marginBottom:8, position:"relative", display:"inline-block" }}>
                      <img src={c.message_image} alt="Command" style={{ maxWidth:180, maxHeight:120, borderRadius:8, border:"1px solid #2a2a3e", display:"block" }}/>
                      <button onClick={() => { if(window.confirm("Remove this image?")) setCommands(commands.map((cmd,j)=>j===i?{...cmd,message_image:null}:cmd)); }}
                        style={{ position:"absolute", top:-6, right:-6, background:"#e05050", border:"none", borderRadius:"50%", width:20, height:20, color:"#fff", cursor:"pointer", fontSize:11 }}>✕</button>
                    </div>
                  )}
                  <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", background:"#1a1a28", border:"1px dashed #2a2a3e", borderRadius:8, padding:"8px 14px", fontSize:12, color:"#6060a0", marginBottom:10, width:"fit-content" }}>
                    📷 {c.message_image ? "Change image" : "Upload image"}
                    <input type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = ev => setCommands(commands.map((cmd,j)=>j===i?{...cmd,message_image:ev.target.result}:cmd));
                      reader.readAsDataURL(file);
                    }}/>
                  </label>
                  {c.cmd === '/start' && (
                    <>
                      <div style={{ fontSize:11, color:"#6060a0", marginBottom:8, fontWeight:600 }}>Attached services — click to toggle, drag to reorder (2 per row in bot)</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                        {services.map(s => (
                          <button key={s.id||s.name} onClick={() => toggleServiceOnCommand(c.id||c.cmd, s.name)}
                            style={{ padding:"3px 10px", borderRadius:6, border:"1px solid",
                              borderColor:(c.attached_services||[]).includes(s.name)?"#60a5fa44":"#2a2a3e",
                              background:(c.attached_services||[]).includes(s.name)?"#60a5fa22":"transparent",
                              color:(c.attached_services||[]).includes(s.name)?"#60a5fa":"#8080a0",
                              cursor:"pointer", fontSize:11 }}>
                            {(c.attached_services||[]).includes(s.name)?"✓ ":"+ "}{s.name}
                          </button>
                        ))}
                        {services.length===0 && <span style={{ fontSize:11, color:"#4040a0" }}>Add services first</span>}
                      </div>
                      {(c.attached_services||[]).length > 0 && (
                        <>
                          <div style={{ fontSize:11, color:"#6060a0", marginBottom:6, fontWeight:600 }}>Button order (drag to rearrange — 2 per row in bot)</div>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                            {(c.attached_services||[]).map((name, idx) => (
                              <div key={name}
                                draggable
                                onDragStart={e => onDragStartSvc(e, name)}
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => {
                                  e.preventDefault();
                                  if (!dragSvc || dragSvc===name) return;
                                  setCommands(commands.map(cm => {
                                    if (cm.id !== c.id && cm.cmd !== c.cmd) return cm;
                                    const list = [...(cm.attached_services||[])];
                                    const fi = list.indexOf(dragSvc), ti = list.indexOf(name);
                                    if (fi===-1||ti===-1) return cm;
                                    list.splice(fi,1); list.splice(ti,0,dragSvc);
                                    return {...cm, attached_services:list};
                                  }));
                                  setDragSvc(null);
                                }}
                                style={{ background:"#12121f", border:`1px solid ${dragSvc===name?"#60a5fa":"#2a2a3e"}`,
                                  borderRadius:8, padding:"8px 12px", fontSize:12, cursor:"grab",
                                  display:"flex", alignItems:"center", gap:8, userSelect:"none",
                                  opacity: dragSvc && dragSvc!==name ? 0.6 : 1 }}>
                                <span style={{ color:"#4040a0", fontSize:14 }}>⠿</span>
                                <span style={{ flex:1 }}>{name}</span>
                                <span style={{ fontSize:10, color:"#4040a0" }}>#{idx+1}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <input style={{ ...S.input, flex:"0 0 120px" }} placeholder="/command" value={newCmd.cmd} onChange={e=>setNewCmd({...newCmd,cmd:e.target.value})}/>
            <input style={{ ...S.input, flex:1 }} placeholder="Description" value={newCmd.desc} onChange={e=>setNewCmd({...newCmd,desc:e.target.value})}/>
            <button onClick={addCommand} style={{ ...S.btn(), fontSize:12, whiteSpace:"nowrap" }}>+ Add</button>
          </div>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <div style={{ ...S.card, marginBottom:16 }}>
        <div style={{ padding:"12px 20px", borderBottom:"1px solid #1e1e2e" }}>
          <div style={{ fontWeight:700, fontSize:13, color:"#34d398" }}>Services</div>
          <div style={{ fontSize:12, color:"#6060a0", marginTop:2 }}>Services appear as buttons when customers use /start. Attach questions to each service.</div>
        </div>
        <div style={{ padding:"16px 20px" }}>
          {services.map((s, i) => (
            <div key={s.id||i} style={{ background:"#1a1a28", border:"1px solid #2a2a3e", borderRadius:8, padding:"10px 16px", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:13, fontWeight:600 }}>{s.name}</span>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={() => setExpandedSvc(expandedSvc===i?null:i)} style={{ ...S.btnOutline, fontSize:11, padding:"3px 10px" }}>
                    {expandedSvc===i?"▲":"···"}
                  </button>
                  <button onClick={() => { if(window.confirm("Delete this service?")) setServices(services.filter((_,j)=>j!==i)); }} style={{ ...S.btnOutline, fontSize:11, padding:"3px 10px", color:"#e05050", borderColor:"#e0505044" }}>✕</button>
                </div>
              </div>
              {expandedSvc===i && (
                <div style={{ marginTop:10 }}>
                  <div style={{ fontSize:11, color:"#6060a0", marginBottom:6, fontWeight:600 }}>Open message (shown when customer selects this service)</div>
                  <textarea value={s.open_message_content||""} onChange={e => setServices(services.map((sv,j)=>j===i?{...sv,open_message_content:e.target.value}:sv))}
                    style={{ ...S.input, minHeight:50, resize:"vertical", fontSize:12, marginBottom:10 }} placeholder="e.g. Thanks for choosing this service! Please answer the following questions..."/>
                  <div style={{ fontSize:11, color:"#6060a0", marginBottom:6, fontWeight:600 }}>Attached questions — click to toggle, drag to reorder</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                    {questions.map(q => (
                      <button key={q.id||q.question} onClick={() => toggleQuestionOnService(s.id||s.name, q.id)}
                        style={{ padding:"3px 10px", borderRadius:6, border:"1px solid",
                          borderColor:(s.attached_questions||[]).includes(q.id)?"#34d39844":"#2a2a3e",
                          background:(s.attached_questions||[]).includes(q.id)?"#34d39822":"transparent",
                          color:(s.attached_questions||[]).includes(q.id)?"#34d398":"#8080a0",
                          cursor:"pointer", fontSize:11 }}>
                        {(s.attached_questions||[]).includes(q.id)?"✓ ":"+ "}{q.question?.slice(0,28)}{(q.question?.length||0)>28?"...":""}
                      </button>
                    ))}
                    {questions.length===0 && <span style={{ fontSize:11, color:"#4040a0" }}>Add questions below first</span>}
                  </div>
                  {(s.attached_questions||[]).length > 0 && (
                    <>
                      <div style={{ fontSize:11, color:"#6060a0", marginBottom:6, fontWeight:600 }}>Question order (drag to rearrange)</div>
                      {(s.attached_questions||[]).map((qId, idx) => {
                        const q = questions.find(q => q.id === qId);
                        if (!q) return null;
                        return (
                          <div key={qId}
                            draggable
                            onDragStart={e => onDragStartQ(e, qId)}
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => {
                              e.preventDefault();
                              if (!dragQ || dragQ===qId) return;
                              setServices(services.map(sv => {
                                if (sv.id !== s.id) return sv;
                                const list = [...(sv.attached_questions||[])];
                                const fi = list.indexOf(dragQ), ti = list.indexOf(qId);
                                if (fi===-1||ti===-1) return sv;
                                list.splice(fi,1); list.splice(ti,0,dragQ);
                                return {...sv, attached_questions:list};
                              }));
                              setDragQ(null);
                            }}
                            style={{ background:"#12121f", border:`1px solid ${dragQ===qId?"#34d398":"#2a2a3e"}`,
                              borderRadius:8, padding:"8px 12px", marginBottom:6, fontSize:12,
                              cursor:"grab", display:"flex", alignItems:"center", gap:8, userSelect:"none",
                              opacity: dragQ && dragQ!==qId ? 0.6 : 1 }}>
                            <span style={{ color:"#4040a0", fontSize:14 }}>⠿</span>
                            <span style={{ flex:1 }}>{q.question}</span>
                            <span style={{ background:"#a78bfa22", color:"#a78bfa", border:"1px solid #a78bfa44", borderRadius:4, padding:"1px 6px", fontSize:10 }}>{q.question_type||"text"}</span>
                            <span style={{ fontSize:10, color:"#4040a0" }}>#{idx+1}</span>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <input style={{ ...S.input, flex:1 }} placeholder="Service name e.g. 🍔 5Guys" value={newService.name} onChange={e=>setNewService({...newService,name:e.target.value})}/>
            <button onClick={addService} style={{ ...S.btn(), fontSize:12, whiteSpace:"nowrap" }}>+ Add</button>
          </div>
        </div>
      </div>

      {/* ── QUESTIONS ── */}
      <div style={{ ...S.card, marginBottom:16 }}>
        <div style={{ padding:"12px 20px", borderBottom:"1px solid #1e1e2e" }}>
          <div style={{ fontWeight:700, fontSize:13, color:"#a78bfa" }}>Questions</div>
          <div style={{ fontSize:12, color:"#6060a0", marginTop:2 }}>Create questions customers must answer when creating a ticket. Attach them to services above.</div>
        </div>
        <div style={{ padding:"16px 20px" }}>
          {questions.map((q, i) => (
            <div key={q.id||i} style={{ background:"#1a1a28", border:"1px solid #2a2a3e", borderRadius:8, padding:"10px 16px", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <span style={{ fontSize:13, color:"#e2e2f0" }}>{q.question}</span>
                  <span style={{ marginLeft:8, background:"#a78bfa22", color:"#a78bfa", border:"1px solid #a78bfa44", borderRadius:4, padding:"1px 7px", fontSize:10, fontWeight:600 }}>{q.question_type||"text"}</span>
                  {q.message_content && (
                    <div style={{ fontSize:11, color:"#6060a0", marginTop:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      💬 {q.message_content}
                    </div>
                  )}
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0, marginLeft:8 }}>
                  <button onClick={() => setExpandedQ(expandedQ===i?null:i)} style={{ ...S.btnOutline, fontSize:11, padding:"3px 10px" }}>
                    {expandedQ===i?"▲":"✏"}
                  </button>
                  <button onClick={() => { if(window.confirm("Delete this question?")) setQuestions(questions.filter((_,j)=>j!==i)); }} style={{ ...S.btnOutline, fontSize:11, padding:"3px 10px", color:"#e05050", borderColor:"#e0505044" }}>✕</button>
                </div>
              </div>
              {expandedQ===i && (
                <div style={{ marginTop:10, borderTop:"1px solid #2a2a3e", paddingTop:10 }}>
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:11, color:"#6060a0", marginBottom:5, fontWeight:600 }}>Question name / label</div>
                    <input style={{ ...S.input, fontSize:12 }} value={q.question||""}
                      onChange={e => setQuestions(questions.map((qq,j)=>j===i?{...qq,question:e.target.value}:qq))}
                      placeholder="Internal label e.g. OrderName"/>
                  </div>
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:11, color:"#6060a0", marginBottom:5, fontWeight:600 }}>Message sent to customer</div>
                    <textarea style={{ ...S.input, minHeight:60, resize:"vertical", fontSize:12 }}
                      value={q.message_content||""}
                      onChange={e => setQuestions(questions.map((qq,j)=>j===i?{...qq,message_content:e.target.value}:qq))}
                      placeholder="e.g. What name would you like on the order? 👤"/>
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:"#6060a0", marginBottom:5, fontWeight:600 }}>Question type</div>
                    <select style={{ ...S.input, fontSize:12 }} value={q.question_type||"text"}
                      onChange={e => setQuestions(questions.map((qq,j)=>j===i?{...qq,question_type:e.target.value}:qq))}>
                      <option value="text">Text</option>
                      <option value="photo">Photo</option>
                      <option value="number">Number</option>
                      <option value="inline_preset_buttons">Buttons</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <input style={{ ...S.input, flex:1 }} placeholder="Question label e.g. OrderName" value={newQuestion.question} onChange={e=>setNewQuestion({...newQuestion,question:e.target.value})}/>
            <select style={{ ...S.input, flex:"0 0 130px" }} value={newQuestion.question_type} onChange={e=>setNewQuestion({...newQuestion,question_type:e.target.value})}>
              <option value="text">Text</option>
              <option value="photo">Photo</option>
              <option value="number">Number</option>
              <option value="inline_preset_buttons">Buttons</option>
            </select>
            <button onClick={addQuestion} style={{ ...S.btn(), fontSize:12, whiteSpace:"nowrap" }}>+ Add</button>
          </div>
        </div>
      </div>

      {/* Save button */}
      <button onClick={saveAll} disabled={saving} style={{ ...S.btn(), fontSize:13, padding:"10px 24px" }}>
        {saving ? <><Spinner size={14}/> Saving...</> : "💾 Save All Settings"}
      </button>
    </div>
  )
};

// ─── REVOLT SETTINGS TAB ────────────────────────────────────────────────────
const RevoltSettingsTab = ({ node }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [revoltGuildId, setRevoltGuildId] = useState("");
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedService, setExpandedService] = useState(null);
  const [serviceCategories, setServiceCategories] = useState({});
  const [ticketNaming, setTicketNaming] = useState({});
  const [enforcedClaiming, setEnforcedClaiming] = useState({});
  const [serviceStatus, setServiceStatus] = useState({});

  useEffect(() => { loadSettings(); }, [node.id]);

  useEffect(() => {
    if (revoltGuildId && revoltGuildId.length > 5) {
      fetchCategories(revoltGuildId);
    }
  }, [revoltGuildId]);

  const loadSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api(`/nodes/${node.id}/settings`);
      const loadedServices = data.services || [];
      setServices(loadedServices);

      const config = data.config || {};
      setRevoltGuildId(config.revolt_guild_id || "");

      const cats = {};
      const naming = {};
      const claiming = {};
      const status = {};

      loadedServices.forEach(service => {
        cats[service.id] = {
          open: service.open_category || "",
          claimed: service.claimed_category || "",
          closed: service.closed_category || ""
        };
        naming[service.id] = {
          opened: service.ticket_opened_format || "ticket-{count}",
          claimed: service.ticket_claimed_format || "claimed-{nickname}-{count}",
          closed: service.ticket_closed_format || "closed-{count}"
        };
        claiming[service.id] = {
          enabled: service.enforced_claiming_enabled || false,
          maxTickets: service.max_claims_per_contractor || 0,
          timeout: service.claim_timeout_seconds || 0
        };
        status[service.id] = {
          isOpen: service.is_service_open !== false,
          isQueueFull: service.is_queue_full || false,
          isQueueOnBreak: service.is_queue_on_break || false
        };
      });

      setServiceCategories(cats);
      setTicketNaming(naming);
      setEnforcedClaiming(claiming);
      setServiceStatus(status);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (guildId) => {
    const id = guildId || revoltGuildId;
    if (!id) return;
    setFetchingCategories(true);
    try {
      const data = await api(`/nodes/${node.id}/revolt-categories?guild_id=${id}`);
      const cats = (data.categories || []).map(cat => ({
        id: cat.id,
        name: cat.title || cat.name || cat.id
      }));
      setCategories(cats);
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
    } finally {
      setFetchingCategories(false);
    }
  };

  const saveSettings = async () => {
    if (!revoltGuildId) { setError("Guild ID is required"); return; }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updatedServices = services.map(s => ({
        ...s,
        // Store category ID (not name) for reliable routing
        open_category: serviceCategories[s.id]?.open || "",
        claimed_category: serviceCategories[s.id]?.claimed || "",
        closed_category: serviceCategories[s.id]?.closed || "",
        ticket_opened_format: ticketNaming[s.id]?.opened || "ticket-{count}",
        ticket_claimed_format: ticketNaming[s.id]?.claimed || "claimed-{nickname}-{count}",
        ticket_closed_format: ticketNaming[s.id]?.closed || "closed-{count}",
        enforced_claiming_enabled: enforcedClaiming[s.id]?.enabled || false,
        max_claims_per_contractor: enforcedClaiming[s.id]?.maxTickets || 0,
        claim_timeout_seconds: enforcedClaiming[s.id]?.timeout || 0,
        is_service_open: serviceStatus[s.id]?.isOpen !== false,
        is_queue_full: serviceStatus[s.id]?.isQueueFull || false,
        is_queue_on_break: serviceStatus[s.id]?.isQueueOnBreak || false
      }));

      await api(`/nodes/${node.id}/settings`, {
        method: "PUT",
        body: {
          services: updatedServices,
          revolt_guild_id: revoltGuildId
        }
      });

      setSuccess("✅ Settings saved!");
      setTimeout(() => setSuccess(""), 3000);
      await loadSettings();
    } catch (err) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Helper — find category name by ID for display
  const getCatName = (id) => {
    if (!id) return "";
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : id;
  };

  if (loading) return <div style={{ color: "#6060a0" }}>Loading settings...</div>;

  return (
    <div>
      {error && (
        <div style={{ background: "#e05050", color: "#fff", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          ❌ {error}
        </div>
      )}
      {success && (
        <div style={{ background: "#34d398", color: "#fff", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          {success}
        </div>
      )}

      {/* Guild ID */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#f87171" }}>⚡</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Revolt Server Configuration</span>
          {fetchingCategories && <span style={{ fontSize: 11, color: "#6060a0", marginLeft: "auto" }}>Loading categories...</span>}
          {!fetchingCategories && categories.length > 0 && (
            <span style={{ fontSize: 11, color: "#34d398", marginLeft: "auto" }}>✓ {categories.length} categories loaded</span>
          )}
        </div>
        <div style={{ padding: "20px" }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Guild ID</label>
          <input
            style={S.input}
            value={revoltGuildId}
            onChange={e => setRevoltGuildId(e.target.value)}
            placeholder="Enter your Revolt server/guild ID..."
          />
          <div style={{ fontSize: 11, color: "#4040a0", marginTop: 4 }}>
            Categories load automatically once a valid Guild ID is entered.
          </div>
        </div>
      </div>

      {/* Services */}
      {services.length === 0 ? (
        <div style={{ ...S.card, padding: 20, textAlign: "center", color: "#6060a0" }}>
          No services created yet. Create services in the Telegram tab first.
        </div>
      ) : services.map(service => (
        <div key={service.id} style={{ ...S.card, marginBottom: 12 }}>
          <div
            onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
            style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", borderBottom: expandedService === service.id ? "1px solid #1e1e2e" : "none" }}
          >
            <span>{expandedService === service.id ? "▼" : "▶"}</span>
            <span style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>{service.name}</span>
            {serviceCategories[service.id]?.open ? (
              <span style={{ fontSize: 11, color: "#34d398" }}>
                ✓ {getCatName(serviceCategories[service.id].open)}
              </span>
            ) : (
              <span style={{ fontSize: 11, color: "#f59e0b" }}>⚠ Not configured</span>
            )}
          </div>

          {expandedService === service.id && (
            <div style={{ padding: "20px" }}>

              {/* Category Selection */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#a78bfa" }}>Category settings</div>
                {categories.length === 0 && (
                  <div style={{ fontSize: 12, color: "#f59e0b", marginBottom: 12 }}>
                    ⚠ Enter a valid Guild ID above to load categories.
                  </div>
                )}
                {[
                  { key: "open", label: "Open category" },
                  { key: "claimed", label: "Claimed category" },
                  { key: "closed", label: "Closed category" }
                ].map(({ key, label }) => (
                  <div key={key} style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>
                    <select
                      style={S.input}
                      value={serviceCategories[service.id]?.[key] || ""}
                      onChange={e => setServiceCategories({
                        ...serviceCategories,
                        [service.id]: { ...serviceCategories[service.id], [key]: e.target.value }
                      })}
                    >
                      <option value="">Select category...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Ticket Naming */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#a78bfa" }}>Ticket naming</div>
                <div style={{ fontSize: 12, color: "#6060a0", marginBottom: 12 }}>
                  Options: {"{nickname}"} = contractor name, {"{count}"} = ticket number
                </div>
                {[
                  { key: "opened", label: "Opened", placeholder: "ticket-{count}" },
                  { key: "claimed", label: "Claimed", placeholder: "claimed-{nickname}-{count}" },
                  { key: "closed", label: "Closed", placeholder: "closed-{count}" }
                ].map(({ key, label, placeholder }) => (
                  <div key={key} style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>
                    <input
                      style={S.input}
                      placeholder={placeholder}
                      value={ticketNaming[service.id]?.[key] || ""}
                      onChange={e => setTicketNaming({
                        ...ticketNaming,
                        [service.id]: { ...ticketNaming[service.id], [key]: e.target.value }
                      })}
                    />
                  </div>
                ))}
              </div>

              {/* Enforced Claiming */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#a78bfa" }}>Enforced claiming</div>
                <label style={{ fontSize: 12, color: "#6060a0", fontWeight: 600, marginBottom: 8, display: "block" }}>
                  <input
                    type="checkbox"
                    checked={enforcedClaiming[service.id]?.enabled || false}
                    onChange={e => setEnforcedClaiming({
                      ...enforcedClaiming,
                      [service.id]: { ...enforcedClaiming[service.id], enabled: e.target.checked }
                    })}
                    style={{ marginRight: 8 }}
                  />
                  Enabled?
                </label>
                {[
                  { key: "maxTickets", label: "Max tickets per contractor" },
                  { key: "timeout", label: "Timeout (seconds)" }
                ].map(({ key, label }) => (
                  <div key={key} style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>
                    <input
                      type="number"
                      style={S.input}
                      value={enforcedClaiming[service.id]?.[key] || 0}
                      onChange={e => setEnforcedClaiming({
                        ...enforcedClaiming,
                        [service.id]: { ...enforcedClaiming[service.id], [key]: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                ))}
              </div>

              {/* Service Status */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#a78bfa" }}>Service status</div>
                {[
                  { key: "isOpen", label: "Service open?" },
                  { key: "isQueueFull", label: "Queue full?" },
                  { key: "isQueueOnBreak", label: "Queue on break?" }
                ].map(({ key, label }) => (
                  <label key={key} style={{ fontSize: 12, color: "#6060a0", fontWeight: 600, marginBottom: 8, display: "block" }}>
                    <input
                      type="checkbox"
                      checked={key === "isOpen" ? serviceStatus[service.id]?.isOpen !== false : serviceStatus[service.id]?.[key] || false}
                      onChange={e => setServiceStatus({
                        ...serviceStatus,
                        [service.id]: { ...serviceStatus[service.id], [key]: e.target.checked }
                      })}
                      style={{ marginRight: 8 }}
                    />
                    {label}
                  </label>
                ))}
              </div>

            </div>
          )}
        </div>
      ))}

      {/* Save Button */}
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        <button onClick={saveSettings} disabled={saving} style={{ ...S.btn("#34d398"), fontSize: 13, padding: "10px 20px" }}>
          {saving ? "💾 Saving..." : "✅ Save All Settings"}
        </button>
        <button onClick={loadSettings} style={{ ...S.btnOutline, fontSize: 13, padding: "10px 20px" }}>
          ↻ Reload
        </button>
      </div>
    </div>
  );
};

// ─── NODE DETAIL ─────────────────────────────────────────────────────────────
const NodeDetailPage = ({ node, setPage, refreshNodes, initialTab }) => {
  const [tab, setTab] = useState(initialTab || "Node Overview");
  const [nodeData, setNodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cutModal, setCutModal] = useState(false);
  const [cutPct, setCutPct] = useState("10");

  // Telegram tab state
  const [commands, setCommands] = useState([{ cmd:"/start", desc:"Start a brand new conversation with us #1" }]);
  const [newCmd, setNewCmd] = useState({ cmd:"", desc:"" });
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

  // Bot form
  const [botForm, setBotForm] = useState({ platform:"telegram", token:"", bot_name:"" });
  const [addingBot, setAddingBot] = useState(false);
  const [showBotForm, setShowBotForm] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try { const data = await api(`/nodes/${node.id}`); setNodeData(data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [node.id]);

  const addBot = async () => {
    if (!botForm.token) return;
    setAddingBot(true);
    try {
      await api(`/nodes/${node.id}/bots`, { method:"POST", body:botForm });
      setBotForm({ platform:"telegram", token:"", bot_name:"" });
      setShowBotForm(false);
      const data = await api(`/nodes/${node.id}`);
      setNodeData(data);
    } catch (err) { alert(err.message); }
    finally { setAddingBot(false); }
  };

  const removeBot = async (botId) => {
    if (!confirm("Remove this bot?")) return;
    try {
      await api(`/nodes/${node.id}/bots/${botId}`, { method:"DELETE" });
      const data = await api(`/nodes/${node.id}`);
      setNodeData(data);
    } catch (err) { alert(err.message); }
  };

  const tabs = ["Node Overview","Telegram","BoostChat","Webapp","Accounting"];
  const tabColors = { "Node Overview":"#a78bfa", "Telegram":"#60a5fa", "BoostChat":"#f87171", "Webapp":"#c084fc", "Accounting":"#34d398" };

  const SectionCard = ({ icon, title, children, color="#a78bfa" }) => (
    <div style={{ ...S.card, marginBottom:16 }}>
      <div style={{ padding:"12px 20px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ color }}>{icon}</span>
        <span style={{ fontWeight:700, fontSize:13 }}>{title}</span>
      </div>
      <div style={{ padding:"20px" }}>{children}</div>
    </div>
  );

  const SettingRow = ({ icon, title, desc, color="#a78bfa" }) => (
    <div style={{ display:"flex", alignItems:"center", padding:"12px 16px", background:"#1a1a28", borderRadius:8, marginBottom:8, border:"1px solid #2a2a3e" }}>
      <span style={{ marginRight:12, fontSize:16 }}>{icon}</span>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:600, color }}>{title}</div>
        <div style={{ fontSize:12, color:"#6060a0", marginTop:2 }}>{desc}</div>
      </div>
      <button style={{ ...S.btnOutline, fontSize:11, padding:"4px 12px" }}>···</button>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:4, color:"#6060a0", fontSize:13 }}>
        <span onClick={() => setPage("nodes")} style={{ cursor:"pointer", color:"#a78bfa" }}>Nodes</span> / <span>{node.name}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ margin:"0 0 4px", fontSize:22, fontWeight:800 }}>{node.name}</h1>
          <p style={{ margin:0, color:"#6060a0", fontSize:13 }}>Manage, customize and configure your BoostChat node.</p>
        </div>
        <button style={{ ...S.btn("#e05050"), fontSize:12 }}>↻ Restart bot processes ▾</button>
      </div>

      <div style={{ display:"flex", gap:2, marginBottom:20, borderBottom:"1px solid #1e1e2e" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => { setTab(t); window.location.hash = 'node-detail:' + node.id + ':' + encodeURIComponent(t); }}
            style={{ padding:"8px 16px", border:"none", background:"transparent",
              color:tab===t?(tabColors[t]||"#a78bfa"):"#6060a0", cursor:"pointer", fontSize:13, fontWeight:700,
              borderBottom:tab===t?`2px solid ${tabColors[t]||"#a78bfa"}`:"2px solid transparent", marginBottom:-1, display:"flex", alignItems:"center", gap:6 }}>
            {{"Node Overview":"⬡","Telegram":"✈","BoostChat":"⚡","Webapp":"🌐","Accounting":"💰"}[t]} {t}
          </button>
        ))}
      </div>

      {loading ? <div style={{ display:"flex", gap:12, padding:"32px", color:"#6060a0" }}><Spinner/> Loading...</div> : (
        <>
          {/* ── NODE OVERVIEW ── */}
          {tab==="Node Overview" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16 }}>
              <div>
                {nodeData?.bots?.filter(b=>b.platform==="revolt"||b.platform==="boostchat").map(bot => (
                  <SectionCard key={bot.id} icon="⚡" title="BoostChat bot" color="#f87171">
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                      {[["Bot name",bot.bot_name],["Status","Active"],["Platform ID",bot.id?.slice(0,16)+"..."],["Bot Username",bot.bot_name]].map(([k,v]) => (
                        <div key={k} style={{ fontSize:13 }}>
                          <div style={{ color:"#6060a0", fontSize:11, marginBottom:2 }}>⊙ {k}</div>
                          <div style={{ color:k==="Status"?"#34d398":"#e2e2f0" }}>{v||"—"}</div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                ))}
                {nodeData?.bots?.filter(b=>b.platform==="telegram").map(bot => (
                  <SectionCard key={bot.id} icon="✈" title="Telegram bot" color="#60a5fa">
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                      {[["Bot name",bot.bot_name],["Status","Active"],["Platform ID",bot.id?.slice(0,16)+"..."],["Platform name","—"],["Platform username",bot.bot_name]].map(([k,v]) => (
                        <div key={k} style={{ fontSize:13 }}>
                          <div style={{ color:"#6060a0", fontSize:11, marginBottom:2 }}>⊙ {k}</div>
                          <div style={{ color:k==="Status"?"#34d398":"#e2e2f0" }}>{v||"—"}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop:14 }}>
                      <button style={{ ...S.btn("#e05050"), fontSize:12 }}>↻ Restart Telegram bot</button>
                    </div>
                  </SectionCard>
                ))}
                {(!nodeData?.bots?.length) && (
                  <div style={{ ...S.card, padding:"32px", textAlign:"center", color:"#4040a0", fontSize:13 }}>No bots connected. Add bots from the Bots page.</div>
                )}
              </div>
              <div style={S.card}>
                <div style={{ padding:"14px 18px", borderBottom:"1px solid #1e1e2e", fontWeight:700, fontSize:13 }}>Node info</div>
                <div style={{ padding:"16px 18px" }}>
                  {[["Node name",nodeData?.node?.name],["Timezone",nodeData?.node?.timezone],["Type",nodeData?.node?.type],["Status",nodeData?.node?.status],["Creation",nodeData?.node?.created_at?`Created ${new Date(nodeData.node.created_at).toLocaleDateString()}`:"—"]].map(([k,v]) => (
                    <div key={k} style={{ fontSize:13, marginBottom:10 }}>
                      <div style={{ color:"#6060a0", fontSize:11, marginBottom:2 }}>⊙ {k}</div>
                      <div style={{ color:v==="active"?"#34d398":"#e2e2f0" }}>{v||"—"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TELEGRAM ── */}
                    {tab==="Telegram" && (
            <div>
              <TelegramSettingsTab node={node}/>
            </div>
          )}
          {tab==="BoostChat" && (
            <div>
              <RevoltSettingsTab node={node}/>
            </div>
          )}
          {tab==="Webapp" && (
            <div style={{ ...S.card, padding:"48px", textAlign:"center", color:"#4040a0" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>🌐</div>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>Webapp integration</div>
              <div style={{ fontSize:13 }}>Web app settings coming soon.</div>
            </div>
          )}

          {/* ── ACCOUNTING ── */}
          {tab==="Accounting" && (
            <div>
              <SectionCard icon="💰" title="Accounting Settings" color="#34d398">
                <h3 style={{ fontSize:16, fontWeight:800, marginBottom:6 }}>Accounting customisation</h3>
                <p style={{ fontSize:13, color:"#6060a0", marginBottom:20, lineHeight:1.7 }}>
                  Customize your accounting settings and streamline your financial management. Configure automatic payout requests, adjust default cut percentages, and manage your contractors and accounting settings all in one place.
                </p>
                <div style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>General customisation</div>
                <div style={{ background:"#1a1a28", border:"1px solid #2a2a3e", borderRadius:8, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#34d398" }}>💲 Default cut percentage</div>
                    <div style={{ fontSize:12, color:"#6060a0", marginTop:2 }}>Change the default cut percentage that gets set when new contractors are added.</div>
                  </div>
                  <button onClick={() => setCutModal(true)} style={{ ...S.btnOutline, fontSize:11, padding:"4px 12px" }}>···</button>
                </div>

                <div style={{ marginTop:20 }}>
                  <div style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>Workers ({nodeData?.workers?.length||0})</div>
                  {!nodeData?.workers?.length ? (
                    <div style={{ color:"#4040a0", fontSize:13 }}>No workers assigned yet.</div>
                  ) : nodeData.workers.map(w => (
                    <div key={w.id} style={{ background:"#1a1a28", border:"1px solid #2a2a3e", borderRadius:8, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#6c4fd8,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{w.username[0].toUpperCase()}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700 }}>{w.username}</div>
                        <div style={{ fontSize:11, color:"#6060a0", textTransform:"capitalize" }}>{w.role}</div>
                      </div>
                      <span style={{ background:"#34d39822", color:"#34d398", border:"1px solid #34d39844", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{w.cut_percentage}% cut</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}
        </>
      )}

      {/* Cut % Modal */}
      {cutModal && (
        <div style={{ position:"fixed", inset:0, background:"#00000088", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }} onClick={() => setCutModal(false)}>
          <div style={{ ...S.card, padding:"28px", width:420 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <h3 style={{ fontSize:16, fontWeight:700 }}>Change default cut percentage</h3>
              <button style={{ ...S.btnOutline, padding:"4px 10px" }} onClick={() => setCutModal(false)}>✕</button>
            </div>
            <label style={{ display:"block", fontSize:12, color:"#8080a0", marginBottom:6 }}>Cut percentage</label>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
              <span style={{ background:"#1e1e2e", border:"1px solid #2a2a3e", borderRadius:"8px 0 0 8px", padding:"8px 12px", color:"#6060a0", fontSize:13 }}>#</span>
              <input style={{ ...S.input, borderRadius:"0 8px 8px 0", borderLeft:"none" }} value={cutPct} onChange={e=>setCutPct(e.target.value)}/>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ ...S.btn("#34d398"), flex:1, justifyContent:"center" }}>Update cut percentage</button>
              <button style={{ ...S.btn("#f59e0b"), flex:1, justifyContent:"center" }}>Overwrite all contractors</button>
              <button style={S.btnOutline} onClick={() => setCutModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── CUSTOMERS PAGE ───────────────────────────────────────────────────────────
const CustomersPage = ({ selectedNode }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedNode) params.append("node_id", selectedNode.id);
      if (tab === "banned") params.append("banned", "true");
      if (search) params.append("search", search);
      params.append("page", page);
      params.append("limit", limit);
      const data = await api(`/customers?${params}`);
      setCustomers(data.customers || []);
      setTotal(data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [selectedNode, tab, search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [tab, search, selectedNode]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 style={{ margin:"0 0 4px", fontSize:24, fontWeight:800 }}>Customers</h1>
      <p style={{ margin:"0 0 20px", color:"#6060a0", fontSize:13 }}>
        {selectedNode ? `Showing customers from node: ${selectedNode.name}` : "Showing all customers across all nodes."}
      </p>
      <div style={S.card}>
        <div style={{ padding:"12px 20px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:4 }}>
            {[["all","All"],["banned","Banned"]].map(([id,label]) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ padding:"6px 16px", borderRadius:8, border:"none",
                  background:tab===id?"#6c4fd822":"transparent",
                  color:tab===id?"#a78bfa":"#6060a0", cursor:"pointer", fontSize:13, fontWeight:tab===id?700:400 }}>
                {label}
              </button>
            ))}
          </div>
          <span style={{ fontSize:12, color:"#6060a0" }}>{total} total</span>
        </div>
        <div style={{ padding:"10px 20px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ color:"#6060a0" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by username, name or Telegram ID..."
            style={{ ...S.input, border:"none", background:"transparent", padding:"4px 0" }}/>
        </div>
        {loading
          ? <div style={{ padding:"32px", display:"flex", alignItems:"center", gap:12, color:"#6060a0" }}><Spinner/> Loading...</div>
          : customers.length === 0
            ? <div style={{ padding:"32px", textAlign:"center", color:"#4040a0", fontSize:13 }}>No customers yet.</div>
            : (
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:650 }}>
                  <thead>
                    <tr style={{ borderBottom:"1px solid #1e1e2e" }}>
                      {["Telegram ID","Username","Display Name","Tickets","Paid","Revenue"].map(h => (
                        <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:10, color:"#6060a0", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c,i) => (
                      <tr key={c.id}
                        style={{ borderBottom:"1px solid #1a1a2a", background:i%2===0?"transparent":"#ffffff03" }}
                        onMouseEnter={e => e.currentTarget.style.background="#1a1a28"}
                        onMouseLeave={e => e.currentTarget.style.background=i%2===0?"transparent":"#ffffff03"}>
                        <td style={{ padding:"10px 16px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <div style={{ width:28, height:28, borderRadius:7, background:"#6c4fd822", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>💬</div>
                            <span style={{ fontSize:12, color:"#6060a0", fontFamily:"monospace" }}>{c.telegram_id}</span>
                          </div>
                        </td>
                        <td style={{ padding:"10px 16px", fontSize:13 }}>
                          {c.username
                            ? <span style={{ color:"#60a5fa" }}>⊙ {c.username}</span>
                            : <span style={{ color:"#3a3a6a" }}>⊘ No username</span>}
                        </td>
                        <td style={{ padding:"10px 16px", fontSize:13 }}>{c.display_name || "—"}</td>
                        <td style={{ padding:"10px 16px" }}>
                          <span style={{ background:"#60a5fa22", color:"#60a5fa", border:"1px solid #60a5fa44", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>
                            # {c.total_tickets||0}
                          </span>
                        </td>
                        <td style={{ padding:"10px 16px" }}>
                          <span style={{ background:"#f59e0b22", color:"#f59e0b", border:"1px solid #f59e0b44", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>
                            # {c.paid_tickets||0}
                          </span>
                        </td>
                        <td style={{ padding:"10px 16px" }}>
                          <span style={{ background:"#34d39822", color:"#34d398", border:"1px solid #34d39844", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>
                            $ {parseFloat(c.total_revenue||0).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        <div style={{ padding:"10px 20px", borderTop:"1px solid #1e1e2e", display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:12, color:"#6060a0" }}>
          <span>Page {page} of {totalPages||1} · {total} customers</span>
          <div style={{ display:"flex", gap:4 }}>
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
              style={{ ...S.btnOutline, padding:"4px 10px", fontSize:12, opacity:page===1?0.4:1 }}>‹ Prev</button>
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page>=totalPages}
              style={{ ...S.btnOutline, padding:"4px 10px", fontSize:12, opacity:page>=totalPages?0.4:1 }}>Next ›</button>
          </div>
        </div>
      </div>
    </div>
  );
};
// ─── TICKETS PAGE ─────────────────────────────────────────────────────────────
// ─── TICKET DETAIL PANEL ─────────────────────────────────────────────────────
const TicketDetailPanel = ({ ticket, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api(`/tickets/${ticket.id}`);
        setDetail(data);
        // Load question answers
        const ans = await api(`/tickets/${ticket.id}/answers`).catch(() => ({ answers: [] }));
        setAnswers(ans.answers || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [ticket.id]);

  const summarize = async () => {
    if (!detail?.messages?.length) return;
    setSummarizing(true);
    try {
      const conversation = detail.messages.map(m =>
        `${m.sender_name || m.sender_type}: ${m.content || '[media]'}`
      ).join('\n');
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [{ role: 'user', content: `Summarize this customer support conversation in 2-3 sentences. Focus on what the customer needed, what the worker did, and the outcome:

${conversation}` }]
        })
      });
      const data = await res.json();
      setSummary(data.content?.[0]?.text || 'Could not generate summary.');
    } catch (err) { setSummary('Could not generate summary.'); }
    finally { setSummarizing(false); }
  };

  const sc = { open:"#f59e0b", pending:"#f59e0b", in_progress:"#60a5fa", paid:"#34d398", closed:"#6060a0", cancelled:"#e05050" };
  const statusColor = sc[ticket.status] || "#6060a0";
  const hasPaid = parseFloat(ticket.amount_paid || 0) > 0;

  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  const formatDate = (d) => new Date(d).toLocaleDateString([], { month:'short', day:'numeric', year:'numeric' });

  return (
    <div style={{ width:440, borderLeft:"1px solid #1e1e2e", background:"#0f0f17", display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"12px 16px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#6c4fd8,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, flexShrink:0 }}>
          {(ticket.customer_username || ticket.customer_display || "?")[0].toUpperCase()}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#60a5fa", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {ticket.customer_username ? `@${ticket.customer_username}` : ticket.customer_display || "Unknown"}
          </div>
          <div style={{ fontSize:10, color:"#5a5a80" }}>
            {ticket.telegram_id || ticket.customer_telegram_id || ""} · #{ticket.ticket_number}
          </div>
        </div>
        <span style={{ background:statusColor+"22", color:statusColor, border:`1px solid ${statusColor}44`, borderRadius:4, padding:"2px 8px", fontSize:10, fontWeight:700 }}>
          {ticket.status}
        </span>
        <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#6060a0", cursor:"pointer", fontSize:18, lineHeight:1, padding:"2px 4px" }}>✕</button>
      </div>

      <div style={{ flex:1, overflowY:"auto" }}>
        {loading ? (
          <div style={{ padding:"32px", display:"flex", alignItems:"center", gap:10, color:"#6060a0" }}><Spinner size={16}/> Loading...</div>
        ) : (
          <>
            {/* AI Summary */}
            <div style={{ padding:"12px 16px", borderBottom:"1px solid #1e1e2e" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#a78bfa" }}>✦ AI Summarization</span>
                <button onClick={summarize} disabled={summarizing}
                  style={{ background:"#6c4fd822", border:"1px solid #6c4fd844", borderRadius:6, padding:"2px 10px", color:"#a78bfa", cursor:"pointer", fontSize:10, fontWeight:600 }}>
                  {summarizing ? "Generating..." : "Generate"}
                </button>
              </div>
              {summary ? (
                <div style={{ fontSize:12, color:"#c0c0e0", lineHeight:1.6, background:"#1a1a2e", borderRadius:8, padding:"10px 12px", border:"1px solid #2a2a4e" }}>
                  {summary}
                </div>
              ) : (
                <div style={{ fontSize:11, color:"#4a4a70", fontStyle:"italic" }}>Click Generate to summarize this conversation with AI.</div>
              )}
            </div>

            {/* Payment info */}
            {hasPaid && (
              <div style={{ padding:"10px 16px", borderBottom:"1px solid #1e1e2e", background:"rgba(52,211,152,0.05)" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#34d398", marginBottom:4 }}>💰 Payment Recorded</div>
                <div style={{ fontSize:12, color:"#c0c0e0" }}>
                  ${parseFloat(ticket.amount_paid).toFixed(2)} · marked by {ticket.worker_username || "worker"} · {ticket.closed_at ? formatDate(ticket.closed_at) : "—"}
                </div>
              </div>
            )}

            {/* Question answers */}
            {answers.length > 0 && (
              <div style={{ padding:"10px 16px", borderBottom:"1px solid #1e1e2e" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#6060a0", marginBottom:8 }}>Question Data ({answers.length})</div>
                {answers.map((a, i) => (
                  <div key={i} style={{ marginBottom:6 }}>
                    <div style={{ fontSize:10, color:"#5a5a80", fontWeight:600 }}>{i+1}. {a.question}</div>
                    <div style={{ fontSize:12, color:"#c0c0e0", marginTop:2, paddingLeft:8 }}>
                      {a.media_url
                        ? <a href={a.media_url} target="_blank" style={{ color:"#60a5fa" }}>📷 View photo</a>
                        : a.customer_answer || "—"}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Chat log */}
            <div style={{ padding:"10px 16px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#6060a0", marginBottom:12 }}>
                START OF THE CONVERSATION
              </div>
              {!detail?.messages?.length ? (
                <div style={{ fontSize:12, color:"#4a4a70", textAlign:"center", padding:"20px 0" }}>No messages yet.</div>
              ) : (
                detail.messages.map((m, i) => {
                  const isWorker = m.sender_type === 'worker';
                  const isCustomer = m.sender_type === 'customer';
                  const prevMsg = detail.messages[i - 1];
                  const showDate = !prevMsg || formatDate(m.created_at) !== formatDate(prevMsg.created_at);
                  return (
                    <div key={m.id || i}>
                      {showDate && (
                        <div style={{ textAlign:"center", fontSize:10, color:"#4a4a70", margin:"12px 0 8px", fontWeight:600 }}>
                          {formatDate(m.created_at)}
                        </div>
                      )}
                      <div style={{ display:"flex", gap:8, marginBottom:8, flexDirection:isWorker?"row-reverse":"row" }}>
                        <div style={{ width:24, height:24, borderRadius:"50%", background:isWorker?"#6c4fd8":"#2a2a4e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, flexShrink:0, marginTop:2 }}>
                          {(m.sender_name || m.sender_type || "?")[0].toUpperCase()}
                        </div>
                        <div style={{ maxWidth:"75%", minWidth:0 }}>
                          <div style={{ fontSize:10, color:"#5a5a80", marginBottom:2, textAlign:isWorker?"right":"left" }}>
                            {m.sender_name || (isWorker ? "Worker" : "Customer")}
                          </div>
                          <div style={{ background:isWorker?"#2a1a4e":"#1a1a28", border:isWorker?"1px solid #3a2a5e":"1px solid #2a2a3e", borderRadius:isWorker?"12px 12px 2px 12px":"12px 12px 12px 2px", padding:"7px 10px", fontSize:12, color:"#e0e0f0", lineHeight:1.5, wordBreak:"break-word" }}>
                            {m.content || (m.media_url ? <a href={m.media_url} target="_blank" style={{ color:"#60a5fa" }}>📷 View media</a> : "—")}
                          </div>
                          <div style={{ fontSize:9, color:"#4a4a70", marginTop:2, textAlign:isWorker?"right":"left" }}>
                            {formatTime(m.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div style={{ textAlign:"center", fontSize:10, color:"#4a4a70", marginTop:12, fontWeight:600 }}>
                END OF THE CONVERSATION
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const TicketsPage = ({ selectedNode }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState({ all:0, open:0, closed:0, paid:0 });
  const [page, setPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const limit = 50;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedNode) params.append("node_id", selectedNode.id);
      if (filter !== "all") params.append("status", filter);
      params.append("limit", limit);
      params.append("page", page);
      const data = await api(`/tickets?${params}`);
      setTickets(data.tickets || []);
      setTotal(data.total || 0);
      if (data.counts) setCounts(data.counts);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [selectedNode, filter, page]);

  useEffect(() => { load(); }, [load]);

  const filtered = tickets.filter(t =>
    [t.customer_username, t.customer_display, t.service_name, t.worker_username].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const statusColor = (s) => ({ open:"#f59e0b", pending:"#f59e0b", in_progress:"#60a5fa", paid:"#34d398", closed:"#6060a0", cancelled:"#e05050", deleted:"#e05050" }[s] || "#6060a0");
  const statusLabel = (s) => ({ open:"Open", pending:"Pending", in_progress:"Active", paid:"Paid", closed:"Closed", cancelled:"Cancelled", deleted:"Deleted" }[s] || s);
  const timeAgo = (date) => {
    const s = Math.floor((new Date() - new Date(date)) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    return `${Math.floor(s/86400)}d ago`;
  };

  const totalPages = Math.ceil(total / limit);

  const filterItems = [
    ["all","All","#a78bfa", null],
    ["open","Open","#60a5fa", counts.open],
    ["closed","Closed","#e05050", counts.closed],
    ["paid","Paid","#34d398", counts.paid],
    ["cancelled","Cancelled","#f59e0b", null],
  ];

  return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
      {/* Left filter sidebar */}
      <div style={{ width:150, background:"#13131a", borderRight:"1px solid #1e1e2e", padding:"10px 6px", flexShrink:0, display:"flex", flexDirection:"column", gap:2 }}>
        <div style={{ fontSize:9, color:"#3a3a5a", textTransform:"uppercase", letterSpacing:1.2, marginBottom:8, padding:"0 8px" }}>
          {selectedNode ? selectedNode.name.toUpperCase() : "ALL NODES"}
        </div>
        {filterItems.map(([id, label, color, count]) => (
          <button key={id} onClick={() => { setFilter(id); setPage(1); }}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"6px 10px", borderRadius:6, border:"none",
              background:filter===id?"rgba(108,79,216,0.15)":"transparent",
              color:filter===id?"#a78bfa":"#9090b8", cursor:"pointer", fontSize:12,
              fontWeight:filter===id?700:400, transition:"all 0.15s" }}>
            {id === "all"
              ? <span style={{ fontSize:13, lineHeight:1 }}>≡</span>
              : <span style={{ width:7, height:7, borderRadius:"50%", background:color, flexShrink:0, display:"inline-block" }}/>}
            <span style={{ flex:1, textAlign:"left" }}>{label}</span>
            {count != null && (
              <span style={{ fontSize:10, fontWeight:700, color, background:color+"22", border:`1px solid ${color}44`, borderRadius:4, padding:"0px 5px", lineHeight:"16px" }}>
                {count >= 1000 ? `${(count/1000).toFixed(1)}k` : count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
        {/* Toolbar */}
        <div style={{ padding:"8px 14px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tickets..."
            style={{ background:"#1a1a28", border:"1px solid #2a2a3e", borderRadius:6, padding:"5px 10px", color:"#e2e2f0", fontSize:12, outline:"none", flex:1, maxWidth:280 }}/>
          <span style={{ fontSize:11, color:"#6060a0", whiteSpace:"nowrap" }}>{total} total</span>
          <button onClick={load} style={{ ...S.btnOutline, fontSize:11, padding:"4px 10px", marginLeft:"auto" }}>↻</button>
        </div>

        {/* Table */}
        <div style={{ overflowY:"auto", flex:1 }}>
          {loading ? (
            <div style={{ padding:"32px", display:"flex", alignItems:"center", gap:12, color:"#6060a0" }}><Spinner/> Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding:"48px", textAlign:"center", color:"#4040a0" }}>
              <div style={{ fontSize:28, marginBottom:10 }}>🎫</div>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>No tickets</div>
              <div style={{ fontSize:13 }}>Tickets will appear here when customers message your bot.</div>
            </div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse", tableLayout:"fixed" }}>
              <colgroup>
                <col style={{ width:28 }}/>
                <col style={{ width:"22%" }}/>
                <col style={{ width:"18%" }}/>
                <col style={{ width:"14%" }}/>
                <col style={{ width:"18%" }}/>
                <col style={{ width:"12%" }}/>
                <col style={{ width:"12%" }}/>
              </colgroup>
              <thead style={{ position:"sticky", top:0, background:"#13131a", zIndex:5 }}>
                <tr style={{ borderBottom:"1px solid #1e1e2e" }}>
                  <th style={{ padding:"8px 8px" }}></th>
                  <th style={{ padding:"8px 12px", textAlign:"left", fontSize:10, color:"#6060a0", fontWeight:700 }}>CUSTOMER</th>
                  <th style={{ padding:"8px 12px", textAlign:"left", fontSize:10, color:"#6060a0", fontWeight:700 }}>SERVICE</th>
                  <th style={{ padding:"8px 12px", textAlign:"left", fontSize:10, color:"#6060a0", fontWeight:700 }}>STATUS</th>
                  <th style={{ padding:"8px 12px", textAlign:"left", fontSize:10, color:"#6060a0", fontWeight:700 }}>WORKER</th>
                  <th style={{ padding:"8px 12px", textAlign:"left", fontSize:10, color:"#6060a0", fontWeight:700 }}>PAID</th>
                  <th style={{ padding:"8px 12px", textAlign:"right", fontSize:10, color:"#6060a0", fontWeight:700 }}>TIME</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const sc = statusColor(t.status);
                  const hasPaid = parseFloat(t.amount_paid || 0) > 0;
                  const isSelected = selectedTicket?.id === t.id;
                  return (
                    <tr key={t.id}
                      onClick={() => setSelectedTicket(isSelected ? null : t)}
                      style={{ borderBottom:"1px solid #1a1a2a", cursor:"pointer",
                        background: isSelected ? "#1e1a3e" : hasPaid ? "rgba(52,211,152,0.04)" : "transparent" }}
                      onMouseEnter={e => e.currentTarget.style.background = isSelected ? "#1e1a3e" : hasPaid ? "rgba(52,211,152,0.08)" : "#1a1a28"}
                      onMouseLeave={e => e.currentTarget.style.background = isSelected ? "#1e1a3e" : hasPaid ? "rgba(52,211,152,0.04)" : "transparent"}>
                      <td style={{ padding:"8px 8px", textAlign:"center" }}>
                        <div style={{ width:7, height:7, borderRadius:"50%", background:sc, margin:"0 auto" }}/>
                      </td>
                      <td style={{ padding:"8px 12px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ width:24, height:24, borderRadius:"50%", background:"#2a2a4e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>
                            {(t.customer_username || t.customer_display || "?")[0].toUpperCase()}
                          </div>
                          <span style={{ fontSize:12, color:"#60a5fa", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {t.customer_username ? `@${t.customer_username}` : t.customer_display || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding:"8px 12px" }}>
                        <span style={{ fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}>
                          {t.service_name || "—"}
                        </span>
                      </td>
                      <td style={{ padding:"8px 12px" }}>
                        <span style={{ background:sc+"22", color:sc, border:`1px solid ${sc}44`, borderRadius:4, padding:"2px 7px", fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>
                          {statusLabel(t.status)}
                        </span>
                      </td>
                      <td style={{ padding:"8px 12px" }}>
                        {t.worker_username
                          ? <span style={{ fontSize:12, color:"#a78bfa", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}>{t.worker_username}</span>
                          : <span style={{ color:"#3a3a6a", fontSize:11 }}>—</span>}
                      </td>
                      <td style={{ padding:"8px 12px" }}>
                        {hasPaid
                          ? <span style={{ background:"#34d39822", color:"#34d398", border:"1px solid #34d39844", borderRadius:4, padding:"2px 7px", fontSize:10, fontWeight:700 }}>
                              ${parseFloat(t.amount_paid).toFixed(2)}
                            </span>
                          : <span style={{ color:"#3a3a6a", fontSize:11 }}>—</span>}
                      </td>
                      <td style={{ padding:"8px 12px", fontSize:11, color:"#6060a0", textAlign:"right", whiteSpace:"nowrap" }}>
                        {timeAgo(t.updated_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div style={{ padding:"8px 16px", borderTop:"1px solid #1e1e2e", display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:11, color:"#6060a0", flexShrink:0 }}>
          <span>{filtered.length} shown / {total} total</span>
          <div style={{ display:"flex", gap:4 }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
              style={{ ...S.btnOutline, padding:"3px 8px", fontSize:11, opacity:page===1?0.4:1 }}>‹</button>
            <span style={{ padding:"3px 8px", fontSize:11, color:"#a0a0c0" }}>Page {page} of {totalPages||1}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page>=totalPages}
              style={{ ...S.btnOutline, padding:"3px 8px", fontSize:11, opacity:page>=totalPages?0.4:1 }}>›</button>
          </div>
        </div>
      </div>

      {/* Ticket detail panel */}
      {selectedTicket && (
        <TicketDetailPanel ticket={selectedTicket} onClose={() => setSelectedTicket(null)}/>
      )}
    </div>
  );
};

// ─── INTERACTIVE CHART ───────────────────────────────────────────────────────
const InteractiveChart = ({ data = [], height = 220 }) => {
  const [hover, setHover] = useState(null);
  if (!data.length) return <div style={{ height, display:"flex", alignItems:"center", justifyContent:"center", color:"#3a3a5a", fontSize:12 }}>No data yet</div>;
  const maxRev = Math.max(...data.map(d => parseFloat(d.revenue)||0), 1);
  const w = 800, h = height, pad = 40;
  const revPts = data.map((d,i) => ({ x:(i/(data.length-1||1))*(w-pad*2)+pad, y:h-pad-(parseFloat(d.revenue||0)/maxRev)*(h-pad*2), d }));
  const proPts = data.map((d,i) => ({ x:(i/(data.length-1||1))*(w-pad*2)+pad, y:h-pad-(parseFloat(d.profit||0)/maxRev)*(h-pad*2), d }));
  const revPath = revPts.map((p,i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
  const proPath = proPts.map((p,i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
  const revFill = `${revPath} L${revPts[revPts.length-1].x},${h-pad} L${pad},${h-pad} Z`;
  const yLabels = [0,0.25,0.5,0.75,1].map(t => ({ y:h-pad-(t*(h-pad*2)), label:`$${(maxRev*t).toFixed(0)}` }));
  const step = Math.max(1, Math.floor(data.length/6));
  return (
    <div style={{ position:"relative" }}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width:"100%", height }} preserveAspectRatio="none" onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        {yLabels.map((l,i) => <line key={i} x1={pad} y1={l.y} x2={w-pad} y2={l.y} stroke="#1e1e2e" strokeWidth="1"/>)}
        <path d={revFill} fill="url(#revFill)"/>
        <path d={revPath} fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d={proPath} fill="none" stroke="#34d398" strokeWidth="2" strokeLinejoin="round" strokeDasharray="6 3"/>
        {revPts.map((p,i) => (
          <rect key={i} x={p.x-((w-pad*2)/(data.length*2))} y={pad} width={(w-pad*2)/data.length} height={h-pad*2}
            fill="transparent" style={{ cursor:"crosshair" }}
            onMouseEnter={() => setHover({ ...p.d, px:p.x/w*100 })}/>
        ))}
        {hover && (() => { const pt = revPts.find(p => p.d.date===hover.date); return pt ? <circle cx={pt.x} cy={pt.y} r="5" fill="#60a5fa" stroke="#fff" strokeWidth="2"/> : null; })()}
        {yLabels.map((l,i) => <text key={i} x={pad-4} y={l.y+4} textAnchor="end" fontSize="9" fill="#5a5a80">{l.label}</text>)}
        {data.map((d,i) => i%step===0 ? <text key={i} x={revPts[i]?.x} y={h-8} textAnchor="middle" fontSize="9" fill="#5a5a80">{new Date(d.date).toLocaleDateString([],{month:'short',day:'numeric'})}</text> : null)}
      </svg>
      {hover && (
        <div style={{ position:"absolute", top:20, left:`${Math.min(Math.max(hover.px,10),75)}%`, transform:"translateX(-50%)",
          background:"#16161f", border:"1px solid #2a2a3e", borderRadius:8, padding:"8px 14px", fontSize:12,
          pointerEvents:"none", whiteSpace:"nowrap", zIndex:20, boxShadow:"0 8px 24px #00000080" }}>
          <div style={{ fontWeight:700, color:"#e2e2f0", marginBottom:6 }}>{new Date(hover.date).toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'})}</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#60a5fa", display:"inline-block" }}/>
            <span style={{ color:"#9090b8" }}>Revenue:</span>
            <span style={{ color:"#60a5fa", fontWeight:700 }}>${parseFloat(hover.revenue||0).toFixed(2)}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#34d398", display:"inline-block" }}/>
            <span style={{ color:"#9090b8" }}>Profits:</span>
            <span style={{ color:"#34d398", fontWeight:700 }}>${parseFloat(hover.profit||0).toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── DATE RANGE PICKER ────────────────────────────────────────────────────────
const DateRangePicker = ({ startDate, endDate, onChange }) => {
  const [open, setOpen] = useState(false);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);
  const [viewMonth, setViewMonth] = useState(new Date(startDate));
  const fmt = (d) => d ? new Date(d).toLocaleDateString([],{month:'short',day:'numeric',year:'numeric'}) : '—';
  const presets = [
    { label:'Today', start:new Date(new Date().setHours(0,0,0,0)), end:new Date() },
    { label:'Yesterday', start:new Date(new Date().setDate(new Date().getDate()-1)), end:new Date(new Date().setDate(new Date().getDate()-1)) },
    { label:'Last 7 Days', start:new Date(new Date().setDate(new Date().getDate()-7)), end:new Date() },
    { label:'Last 30 Days', start:new Date(new Date().setDate(new Date().getDate()-30)), end:new Date() },
    { label:'This Month', start:new Date(new Date().getFullYear(),new Date().getMonth(),1), end:new Date(new Date().getFullYear(),new Date().getMonth()+1,0) },
    { label:'Last Month', start:new Date(new Date().getFullYear(),new Date().getMonth()-1,1), end:new Date(new Date().getFullYear(),new Date().getMonth(),0) },
    { label:'Last 3 Months', start:new Date(new Date().getFullYear(),new Date().getMonth()-3,1), end:new Date() },
    { label:'Last 6 Months', start:new Date(new Date().getFullYear(),new Date().getMonth()-6,1), end:new Date() },
  ];
  const daysInMonth = (y,m) => new Date(y,m+1,0).getDate();
  const firstDayOfMonth = (y,m) => new Date(y,m,1).getDay();
  const isSame = (a,b) => a && b && new Date(a).toDateString()===new Date(b).toDateString();
  const isBetween = (d,s,e) => s && e && new Date(d)>=new Date(s) && new Date(d)<=new Date(e);
  const renderCal = (year, month) => {
    const days = daysInMonth(year,month), first = firstDayOfMonth(year,month), cells = [];
    for(let i=0;i<first;i++) cells.push(null);
    for(let d=1;d<=days;d++) cells.push(new Date(year,month,d));
    return cells;
  };
  const vm2 = new Date(viewMonth.getFullYear(), viewMonth.getMonth()+1, 1);
  return (
    <div style={{ position:"relative" }}>
      <button onClick={() => setOpen(!open)}
        style={{ display:"flex", alignItems:"center", gap:8, background:"#1e1e2e", border:"1px solid #2a2a3e",
          borderRadius:8, padding:"6px 14px", color:"#a78bfa", cursor:"pointer", fontSize:12, fontWeight:600 }}>
        📅 {fmt(startDate)} — {fmt(endDate)} ▾
      </button>
      {open && (
        <div style={{ position:"absolute", top:40, left:0, background:"#16161f", border:"1px solid #2a2a3e",
          borderRadius:12, zIndex:100, boxShadow:"0 20px 60px #00000090", display:"flex", minWidth:620 }}
          onClick={e=>e.stopPropagation()}>
          <div style={{ width:140, borderRight:"1px solid #1e1e2e", padding:"12px 8px" }}>
            {presets.map(p => (
              <button key={p.label} onClick={() => { setTempStart(p.start); setTempEnd(p.end); setViewMonth(new Date(p.start)); }}
                style={{ width:"100%", textAlign:"left", background:"transparent", border:"none",
                  cursor:"pointer", padding:"6px 10px", borderRadius:6, fontSize:12,
                  fontWeight:fmt(tempStart)===fmt(p.start)?700:400,
                  color:fmt(tempStart)===fmt(p.start)?"#a78bfa":"#c0c0e0" }}>
                {p.label}
              </button>
            ))}
          </div>
          <div style={{ padding:"16px", flex:1 }}>
            <div style={{ display:"flex", gap:24 }}>
              {[viewMonth, vm2].map((vm,ci) => {
                const y=vm.getFullYear(), m=vm.getMonth(), cells=renderCal(y,m);
                return (
                  <div key={ci} style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                      {ci===0 ? <button onClick={() => setViewMonth(new Date(y,m-1,1))} style={{ background:"transparent", border:"none", color:"#6060a0", cursor:"pointer", fontSize:16 }}>‹</button> : <div/>}
                      <span style={{ fontSize:13, fontWeight:700, color:"#e2e2f0" }}>{vm.toLocaleDateString([],{month:'long'})} {y}</span>
                      {ci===1 ? <button onClick={() => setViewMonth(new Date(y,m+1,1))} style={{ background:"transparent", border:"none", color:"#6060a0", cursor:"pointer", fontSize:16 }}>›</button> : <div/>}
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:4 }}>
                      {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} style={{ textAlign:"center", fontSize:10, color:"#5a5a80", padding:"2px 0" }}>{d}</div>)}
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
                      {cells.map((d,i) => {
                        if(!d) return <div key={i}/>;
                        const isStart=isSame(d,tempStart), isEnd=isSame(d,tempEnd), inRange=isBetween(d,tempStart,tempEnd);
                        return (
                          <button key={i} onClick={() => {
                            if(!tempStart||(tempStart&&tempEnd)){setTempStart(d);setTempEnd(null);}
                            else if(d<tempStart){setTempEnd(tempStart);setTempStart(d);}
                            else{setTempEnd(d);}
                          }}
                            style={{ padding:"5px 0", textAlign:"center", borderRadius:6, border:"none", cursor:"pointer", fontSize:12,
                              fontWeight:isStart||isEnd?700:400,
                              background:isStart||isEnd?"#7c5af0":inRange?"#7c5af022":"transparent",
                              color:isStart||isEnd?"#fff":inRange?"#a78bfa":"#c0c0e0" }}>
                            {d.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8, marginTop:16, paddingTop:12, borderTop:"1px solid #1e1e2e" }}>
              <button onClick={() => { setTempStart(startDate); setTempEnd(endDate); setOpen(false); }} style={{ ...S.btnOutline, fontSize:12 }}>Cancel</button>
              <button onClick={() => { setTempStart(null); setTempEnd(null); }} style={{ background:"#e05050", border:"none", borderRadius:8, padding:"6px 14px", color:"#fff", cursor:"pointer", fontSize:12 }}>Clear 🗑</button>
              <button onClick={() => { if(tempStart&&tempEnd){ onChange(tempStart,tempEnd); setOpen(false); } }} style={{ ...S.btn(), fontSize:12 }}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
const AnalyticsPage = ({ selectedNode, nodes }) => {
  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const defaultEnd = new Date(now.getFullYear(), now.getMonth()+1, 0);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartTab, setChartTab] = useState("revenue");
  const [svcPage, setSvcPage] = useState(1);
  const [ctrPage, setCtrPage] = useState(1);
  const perPage = 10;
  const targetNode = selectedNode || nodes[0];

  const load = useCallback(async () => {
    if (!targetNode) return;
    setLoading(true);
    try {
      const s = startDate.toISOString().split('T')[0];
      const e = endDate.toISOString().split('T')[0];
      const res = await api(`/analytics/${targetNode.id}?start=${s}&end=${e}`);
      setData(res);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [targetNode, startDate, endDate]);

  useEffect(() => { load(); }, [load]);

  if (!targetNode) return <div style={{ padding:"48px", textAlign:"center", color:"#4040a0" }}><div style={{ fontSize:14, fontWeight:700 }}>No nodes yet</div></div>;

  const ov = data?.overview || {};
  const services = data?.services || [];
  const workers = data?.workers || [];
  const daily = data?.daily || [];
  const topCustomers = data?.top_customers || [];
  const totalRevenue = parseFloat(ov.total_revenue||0);
  const totalPaidTickets = parseInt(ov.paid_tickets||0);
  const totalProfits = workers.reduce((sum,w) => sum + (parseFloat(w.revenue||0)*(parseFloat(w.cut_percentage||0)/100)), 0);
  const dailyWithProfit = daily.map(d => ({ ...d, profit: parseFloat(d.revenue||0) * (totalProfits/(totalRevenue||1)) }));
  const svcPages = Math.ceil(services.length/perPage);
  const ctrPages = Math.ceil(workers.length/perPage);
  const svcSlice = services.slice((svcPage-1)*perPage, svcPage*perPage);
  const ctrSlice = workers.slice((ctrPage-1)*perPage, ctrPage*perPage);

  const Badge = ({ value, color }) => (
    <span style={{ background:color+"22", color, border:`1px solid ${color}44`, borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>{value}</span>
  );

  const Pagination = ({ page, pages, setPage }) => {
    if (pages <= 1) return null;
    return (
      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
        <button onClick={() => setPage(1)} disabled={page===1} style={{ background:"transparent", border:"1px solid #2a2a3e", borderRadius:4, padding:"2px 7px", color:"#9090b8", cursor:"pointer", fontSize:12, opacity:page===1?0.4:1 }}>«</button>
        <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ background:"transparent", border:"1px solid #2a2a3e", borderRadius:4, padding:"2px 7px", color:"#9090b8", cursor:"pointer", fontSize:12, opacity:page===1?0.4:1 }}>‹</button>
        {Array.from({length:pages},(_,i)=>i+1).map(n => (
          <button key={n} onClick={() => setPage(n)}
            style={{ background:page===n?"#6c4fd833":"transparent", border:`1px solid ${page===n?"#6c4fd8":"#2a2a3e"}`,
              borderRadius:4, padding:"2px 8px", color:page===n?"#a78bfa":"#9090b8", cursor:"pointer", fontSize:12, fontWeight:page===n?700:400, minWidth:28 }}>{n}</button>
        ))}
        <button onClick={() => setPage(p=>Math.min(pages,p+1))} disabled={page>=pages} style={{ background:"transparent", border:"1px solid #2a2a3e", borderRadius:4, padding:"2px 7px", color:"#9090b8", cursor:"pointer", fontSize:12, opacity:page>=pages?0.4:1 }}>›</button>
        <button onClick={() => setPage(pages)} disabled={page>=pages} style={{ background:"transparent", border:"1px solid #2a2a3e", borderRadius:4, padding:"2px 7px", color:"#9090b8", cursor:"pointer", fontSize:12, opacity:page>=pages?0.4:1 }}>»</button>
      </div>
    );
  };

  return (
    <div style={{ height:"100%", overflow:"auto" }}>
      <div style={{ padding:"10px 20px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, background:"#0d0d12", zIndex:10, flexWrap:"wrap" }}>
        <DateRangePicker startDate={startDate} endDate={endDate} onChange={(s,e) => { setStartDate(s); setEndDate(e); setSvcPage(1); setCtrPage(1); }}/>
        <span style={{ fontSize:12, color:"#5a5a80" }}>compared to previous period</span>
        <div style={{ marginLeft:"auto" }}><span style={{ fontSize:11, color:"#5a5a80" }}>Showing results from {nodes.length} bot{nodes.length!==1?"s":""}</span></div>
      </div>
      {loading ? (
        <div style={{ padding:"48px", display:"flex", alignItems:"center", gap:12, color:"#6060a0" }}><Spinner/> Loading analytics...</div>
      ) : (
        <div style={{ padding:"20px 22px" }}>
          <div style={{ fontSize:11, color:"#5a5a80", fontWeight:600, marginBottom:4 }}>Analytics</div>
          <div style={{ fontSize:12, color:"#4a4a70", marginBottom:16 }}>View your analytics and statistics for your bots and webapps.</div>
          <div style={{ display:"flex", gap:14, marginBottom:20 }}>
            {[
              { label:"PAID TICKETS", value:`# ${totalPaidTickets.toLocaleString()}`, color:"#60a5fa" },
              { label:"REVENUE", value:`$ ${totalRevenue.toFixed(2)}`, color:"#34d398" },
              { label:"PROFITS", value:`$ ${totalProfits.toFixed(2)}`, color:"#f59e0b" },
            ].map((s,i) => (
              <div key={i} style={{ flex:1, background:s.color+"22", border:`1px solid ${s.color}44`, borderRadius:10, padding:"18px 22px", position:"relative", overflow:"hidden", minWidth:0 }}>
                <div style={{ position:"absolute", right:16, top:12, fontSize:48, opacity:0.1, fontWeight:900, color:s.color }}>{i===0?"#":"$"}</div>
                <div style={{ fontSize:9, color:s.color+"cc", fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", marginBottom:10 }}>{s.label}</div>
                <div style={{ fontSize:34, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ ...S.card, marginBottom:20 }}>
            <div style={{ padding:"10px 18px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", gap:2 }}>
              {[["revenue","📈 Revenue/Profits"],["tickets","🎫 Tickets"],["platform","🌐 Platform"]].map(([id,label]) => (
                <button key={id} onClick={() => setChartTab(id)}
                  style={{ background:"transparent", border:"none", padding:"4px 14px", fontSize:12, fontWeight:chartTab===id?700:400, color:chartTab===id?"#a78bfa":"#6060a0", cursor:"pointer", borderBottom:chartTab===id?"2px solid #a78bfa":"2px solid transparent", marginBottom:-1 }}>
                  {label}
                </button>
              ))}
              <div style={{ marginLeft:"auto", fontSize:14, fontWeight:800, color:"#34d398" }}>${totalRevenue.toFixed(2)}</div>
            </div>
            <div style={{ padding:"8px 18px 12px" }}>
              <div style={{ fontSize:10, color:"#5a5a80", fontWeight:600, padding:"6px 0 4px" }}>Revenue/Profits</div>
              <InteractiveChart data={dailyWithProfit} height={220}/>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
            <div style={S.card}>
              <div style={{ padding:"10px 16px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", gap:8 }}>
                <span>🛎</span><span style={{ fontWeight:700, fontSize:13 }}>Services</span>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr style={{ borderBottom:"1px solid #1e1e2e" }}>
                  <th style={{ padding:"6px 12px", textAlign:"left", fontSize:9, color:"#5a5a80", fontWeight:700 }}>SERVICE</th>
                  <th style={{ padding:"6px 8px", textAlign:"center", fontSize:9, color:"#5a5a80", fontWeight:700 }}>TICKETS</th>
                  <th style={{ padding:"6px 8px", textAlign:"center", fontSize:9, color:"#5a5a80", fontWeight:700 }}>REVENUE</th>
                  <th style={{ padding:"6px 8px", textAlign:"center", fontSize:9, color:"#5a5a80", fontWeight:700 }}>PROFITS</th>
                </tr></thead>
                <tbody>
                  {!svcSlice.length ? <tr><td colSpan={4} style={{ padding:"20px", textAlign:"center", color:"#4040a0", fontSize:12 }}>No service data yet.</td></tr>
                  : svcSlice.map((s,i) => (
                    <tr key={i} style={{ borderBottom:"1px solid #191926" }} onMouseEnter={e=>e.currentTarget.style.background="#16161f"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"8px 12px", fontSize:12, maxWidth:150, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.service_name}</td>
                      <td style={{ padding:"6px 8px", textAlign:"center" }}><Badge value={`# ${s.tickets}`} color="#60a5fa"/></td>
                      <td style={{ padding:"6px 8px", textAlign:"center" }}><Badge value={`$ ${parseFloat(s.revenue).toFixed(2)}`} color="#34d398"/></td>
                      <td style={{ padding:"6px 8px", textAlign:"center" }}><Badge value={`$ ${(parseFloat(s.revenue)*0.1).toFixed(2)}`} color="#f59e0b"/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding:"8px 12px", borderTop:"1px solid #1e1e2e", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:11, color:"#5a5a80" }}>{services.length} total</span>
                <Pagination page={svcPage} pages={svcPages} setPage={setSvcPage}/>
              </div>
            </div>
            <div style={S.card}>
              <div style={{ padding:"10px 16px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", gap:8 }}>
                <span>👤</span><span style={{ fontWeight:700, fontSize:13 }}>Contractors</span>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr style={{ borderBottom:"1px solid #1e1e2e" }}>
                  <th style={{ padding:"6px 12px", textAlign:"left", fontSize:9, color:"#5a5a80", fontWeight:700 }}>CONTRACTOR</th>
                  <th style={{ padding:"6px 8px", textAlign:"center", fontSize:9, color:"#5a5a80", fontWeight:700 }}>CUT</th>
                  <th style={{ padding:"6px 8px", textAlign:"center", fontSize:9, color:"#5a5a80", fontWeight:700 }}>TICKETS</th>
                  <th style={{ padding:"6px 8px", textAlign:"center", fontSize:9, color:"#5a5a80", fontWeight:700 }}>REVENUE</th>
                  <th style={{ padding:"6px 8px", textAlign:"center", fontSize:9, color:"#5a5a80", fontWeight:700 }}>PROFITS</th>
                </tr></thead>
                <tbody>
                  {!ctrSlice.length ? <tr><td colSpan={5} style={{ padding:"20px", textAlign:"center", color:"#4040a0", fontSize:12 }}>No contractor data yet.</td></tr>
                  : ctrSlice.map((w,i) => {
                    const profit = parseFloat(w.revenue||0)*(parseFloat(w.cut_percentage||0)/100);
                    return (
                      <tr key={i} style={{ borderBottom:"1px solid #191926" }} onMouseEnter={e=>e.currentTarget.style.background="#16161f"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{ padding:"8px 12px", fontSize:12, fontWeight:600 }}>{w.username}</td>
                        <td style={{ padding:"6px 8px", textAlign:"center" }}><Badge value={`% ${w.cut_percentage||0}`} color="#e05050"/></td>
                        <td style={{ padding:"6px 8px", textAlign:"center" }}><Badge value={`# ${w.tickets}`} color="#60a5fa"/></td>
                        <td style={{ padding:"6px 8px", textAlign:"center" }}><Badge value={`$ ${parseFloat(w.revenue).toFixed(2)}`} color="#34d398"/></td>
                        <td style={{ padding:"6px 8px", textAlign:"center" }}><Badge value={`$ ${profit.toFixed(2)}`} color="#f59e0b"/></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ padding:"8px 12px", borderTop:"1px solid #1e1e2e", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:11, color:"#5a5a80" }}>{workers.length} total</span>
                <Pagination page={ctrPage} pages={ctrPages} setPage={setCtrPage}/>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:14, marginBottom:20 }}>
            {[
              { label:"RETURNING CUSTOMERS", value:`# ${ov.returning_customers||0}`, color:"#e05050" },
              { label:"AVERAGE REVENUE / CUSTOMER", value:`$ ${ov.unique_customers ? (totalRevenue/parseInt(ov.unique_customers)).toFixed(0) : "0"}`, color:"#f87171" },
              { label:"CUSTOMER RETENTION RATE", value:`% ${ov.paid_tickets&&ov.total_tickets ? ((parseInt(ov.paid_tickets)/parseInt(ov.total_tickets))*100).toFixed(0) : "0"}`, color:"#c084fc" },
            ].map((s,i) => (
              <div key={i} style={{ flex:1, background:s.color+"22", border:`1px solid ${s.color}44`, borderRadius:10, padding:"18px 22px", position:"relative", overflow:"hidden", minWidth:0 }}>
                <div style={{ position:"absolute", right:16, top:12, fontSize:48, opacity:0.08, color:s.color, fontWeight:900 }}>{i===0?"↩":i===1?"$":"%"}</div>
                <div style={{ fontSize:9, color:s.color+"cc", fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", marginBottom:10 }}>{s.label}</div>
                <div style={{ fontSize:34, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <div style={{ padding:"10px 16px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", gap:8 }}>
              <span>🏆</span><span style={{ fontWeight:700, fontSize:13 }}>Top Customers</span>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ borderBottom:"1px solid #1e1e2e" }}>
                <th style={{ padding:"6px 12px", textAlign:"left", fontSize:9, color:"#5a5a80", fontWeight:700 }}>CUSTOMER</th>
                <th style={{ padding:"6px 8px", textAlign:"center", fontSize:9, color:"#5a5a80", fontWeight:700 }}>TICKETS CREATED</th>
                <th style={{ padding:"6px 8px", textAlign:"center", fontSize:9, color:"#5a5a80", fontWeight:700 }}>REVENUE</th>
              </tr></thead>
              <tbody>
                {!topCustomers.length ? <tr><td colSpan={3} style={{ padding:"20px", textAlign:"center", color:"#4040a0", fontSize:12 }}>No customer data yet.</td></tr>
                : topCustomers.slice(0,10).map((c,i) => (
                  <tr key={i} style={{ borderBottom:"1px solid #191926" }} onMouseEnter={e=>e.currentTarget.style.background="#16161f"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"8px 12px", fontSize:12, color:"#60a5fa" }}>{c.username ? `@${c.username}` : c.display_name || "Unknown"}</td>
                    <td style={{ padding:"6px 8px", textAlign:"center" }}><Badge value={`# ${c.tickets||0}`} color="#60a5fa"/></td>
                    <td style={{ padding:"6px 8px", textAlign:"center" }}><Badge value={`$ ${parseFloat(c.revenue||0).toFixed(2)}`} color="#34d398"/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
const SettingsPage = ({ user }) => {
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");

  const Row = ({ label, value, desc, onManage, manageColor }) => (
    <div style={{ display:"flex", alignItems:"center", padding:"16px 20px", background:"#1a1a28", borderRadius:10, marginBottom:8, border:"1px solid #2a2a3e" }}>
      {desc && <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#6c4fd8,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, marginRight:14, flexShrink:0 }}>⚡</div>}
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:700 }}>{label}</div>
        {value && <div style={{ fontSize:12, color:"#6060a0", marginTop:2 }}>{value}</div>}
        {desc && <div style={{ fontSize:12, color:"#6060a0", marginTop:2 }}>{desc}</div>}
      </div>
      {onManage
        ? <button style={{ ...S.btn(manageColor||"#f59e0b"), fontSize:12, padding:"6px 16px" }}>Manage</button>
        : <button style={{ ...S.btnOutline, fontSize:12, padding:"6px 16px" }} onClick={() => { setEditField(label); setEditValue(""); }}>Edit</button>}
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:4, color:"#6060a0", fontSize:13 }}>
        <span style={{ color:"#a78bfa" }}>BoostChat</span> / <span style={{ color:"#a78bfa" }}>Profile</span> / <span>Settings</span>
      </div>
      <h1 style={{ margin:"0 0 4px", fontSize:24, fontWeight:800 }}>Settings</h1>
      <p style={{ margin:"0 0 24px", color:"#6060a0", fontSize:13 }}>Modify account information, and change critical settings for your account.</p>
      <div style={{ ...S.card, marginBottom:28, overflow:"hidden", position:"relative", height:190 }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#1a1035,#2d1b60,#0d1525)" }}/>
        <div style={{ position:"absolute", right:40, top:"50%", transform:"translateY(-50%)", fontSize:130, opacity:0.07 }}>⚡</div>
        <div style={{ position:"relative", zIndex:1, padding:"28px", display:"flex", alignItems:"center", gap:20 }}>
          <div style={{ width:76, height:76, borderRadius:20, background:"linear-gradient(135deg,#6c4fd8,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, fontWeight:900, border:"3px solid #ffffff18" }}>
            {user?.username?.[0]?.toUpperCase()||"U"}
          </div>
          <div>
            <div style={{ fontSize:22, fontWeight:800 }}>{user?.username}</div>
            <div style={{ fontSize:13, color:"#8080b0", marginTop:4, textTransform:"capitalize" }}>{user?.role} Account</div>
          </div>
        </div>
      </div>
      <div style={{ marginBottom:28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <span style={{ color:"#a78bfa" }}>⚙</span>
          <h2 style={{ fontSize:18, fontWeight:800 }}>General</h2>
        </div>
        <p style={{ color:"#6060a0", fontSize:13, marginBottom:16 }}>View and update your general account information.</p>
        <Row label="Username" value={user?.username}/>
        <Row label="Email" value={user?.email||"Not set"}/>
        <Row label="Avatar" desc="Upload a custom avatar."/>
        <Row label="Banner" desc="Upload a custom banner for the sidebar."/>
      </div>
      <div style={{ marginBottom:28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <span style={{ color:"#f59e0b" }}>🔒</span>
          <h2 style={{ fontSize:18, fontWeight:800 }}>Password and security</h2>
        </div>
        <p style={{ color:"#6060a0", fontSize:13, marginBottom:16 }}>Change your password and update your security methods.</p>
        <Row label="Password" value="••••••••••••••••••••"/>
        <Row label="Two-factor authentication" desc="Adds an extra layer of security to your account." onManage={() => {}} manageColor="#f59e0b"/>
      </div>
      {editField && (
        <div style={{ position:"fixed", inset:0, background:"#00000088", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }} onClick={() => setEditField(null)}>
          <div style={{ ...S.card, padding:"28px", width:420 }} onClick={e=>e.stopPropagation()}>
            <h3 style={{ margin:"0 0 4px", fontSize:16, fontWeight:700 }}>Edit {editField}</h3>
            <input style={{ ...S.input, marginBottom:16, marginTop:12 }} placeholder={`New ${editField.toLowerCase()}...`} value={editValue} onChange={e=>setEditValue(e.target.value)}/>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button style={S.btnOutline} onClick={() => setEditField(null)}>Cancel</button>
              <button style={S.btn()} onClick={() => setEditField(null)}>Save changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('node-detail:')) return 'node-detail';
    const validPages = ['hub','bots','nodes','node-detail','customers','tickets','analytics','settings','reports','logs','notifications'];
    return validPages.includes(hash) ? hash : 'hub';
  };
  const getInitialNodeId = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('node-detail:')) return hash.split(':')[1] || null;
    return null;
  };
  const getInitialNodeTab = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('node-detail:')) return decodeURIComponent(hash.split(':').slice(2).join(':') || 'Node Overview');
    return 'Node Overview';
  };

  const [page, setPageState] = useState(getInitialPage);
  const [initialNodeId] = useState(getInitialNodeId);
  const [initialNodeTab] = useState(getInitialNodeTab);
  const [selectedNode, setSelectedNode] = useState(null);

  const setPage = (newPage, nodeId, tab) => {
    setPageState(newPage);
    if (newPage === 'node-detail' && nodeId) {
      window.location.hash = 'node-detail:' + nodeId + ':' + encodeURIComponent(tab || 'Node Overview');
    } else {
      window.location.hash = newPage;
    }
  };
  const [nodes, setNodes] = useState([]);
  const [nodesLoading, setNodesLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("oc_token");
      if (!token) { setAuthChecked(true); return; }
      try { const data = await api("/auth/me"); setUser(data.user); }
      catch { localStorage.removeItem("oc_token"); }
      finally { setAuthChecked(true); }
    };
    checkAuth();
  }, []);

  const loadNodes = useCallback(async () => {
    if (!user) return;
    setNodesLoading(true);
    try { const data = await api("/nodes"); setNodes(data.nodes||[]); }
    catch (err) { console.error(err); }
    finally { setNodesLoading(false); }
  }, [user]);

  useEffect(() => { loadNodes(); }, [loadNodes]);

  useEffect(() => {
    if (initialNodeId && nodes.length > 0 && !selectedNode) {
      const found = nodes.find(n => n.id === initialNodeId);
      if (found) setSelectedNode(found);
    }
  }, [nodes, initialNodeId]);

  const handleLogout = () => { localStorage.removeItem("oc_token"); setUser(null); setNodes([]); setPage("hub"); };

  const fullHeight = ["tickets","analytics","logs"].includes(page);

  if (!authChecked) return (
    <div style={{ ...S.root, alignItems:"center", justifyContent:"center" }}>
      <style>{"* { box-sizing:border-box; } @keyframes spin { to { transform:rotate(360deg); } }"}</style>
      <Spinner size={32}/>
    </div>
  );

  if (!user) return <LoginPage onLogin={setUser}/>;

  const renderPage = () => {
    switch(page) {
      case "hub": return <HubPage user={user} nodes={nodes} setPage={setPage} setSelectedNode={setSelectedNode}/>;
      case "bots": return <BotsPage nodes={nodes} refreshNodes={loadNodes}/>;
      case "nodes": return <NodesPage nodes={nodes} nodesLoading={nodesLoading} refreshNodes={loadNodes} setSelectedNode={setSelectedNode} setPage={setPage}/>;
      case "node-detail": return selectedNode?<NodeDetailPage node={selectedNode} setPage={setPage} refreshNodes={loadNodes} initialTab={initialNodeTab}/>:null;
      case "customers": return <CustomersPage selectedNode={selectedNode}/>;
      case "tickets": return <TicketsPage selectedNode={selectedNode}/>;
      case "analytics": return <AnalyticsPage selectedNode={selectedNode} nodes={nodes}/>;
      case "settings": return <SettingsPage user={user}/>;
      case "reports": return <div style={{ padding:"32px" }}><h1 style={{ fontSize:24, fontWeight:800, marginBottom:16 }}>Reports</h1><div style={{ ...S.card, padding:"48px", textAlign:"center", color:"#4040a0" }}>Report generation coming soon.</div></div>;
      case "logs": return <div style={{ padding:"32px" }}><h1 style={{ fontSize:24, fontWeight:800, marginBottom:16 }}>Logs</h1><div style={{ ...S.card, padding:"48px", textAlign:"center", color:"#4040a0" }}>System logs coming soon.</div></div>;
      default: return <HubPage user={user} nodes={nodes} setPage={setPage} setSelectedNode={setSelectedNode}/>;
    }
  };

  return (
    <div style={S.root} onClick={() => showNotifs && setShowNotifs(false)}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:#0d0d12; }
        ::-webkit-scrollbar-thumb { background:#252535; border-radius:3px; }
        input::placeholder { color:#404060; }
        select { appearance:none; }
        select option { background:#16161f; color:#e2e2f0; }
        button { font-family:inherit; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
      <TopBar user={user} onLogout={handleLogout} showNotifs={showNotifs} setShowNotifs={setShowNotifs} setPage={setPage} setSelectedNode={setSelectedNode}/>
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        <Sidebar page={page} setPage={setPage} nodes={nodes} nodesLoading={nodesLoading} selectedNode={selectedNode} setSelectedNode={setSelectedNode} collapsed={collapsed} setCollapsed={setCollapsed}/>
        <div style={{ flex:1, overflowY:fullHeight?"hidden":"auto", padding:fullHeight?0:"28px 32px", background:"#0d0d12", display:fullHeight?"flex":"block", flexDirection:fullHeight?"column":undefined }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}