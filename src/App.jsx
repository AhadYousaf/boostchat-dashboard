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
  tag: (c) => ({ background:c+"22", color:c, border:`1px solid ${c}33`, borderRadius:5, padding:"2px 8px", fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4 }),
};

// ─── LOADING SPINNER ─────────────────────────────────────────────────────────
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
    setLoading(true);
    setError("");
    try {
      const data = await api("/auth/login", { method:"POST", body: form });
      localStorage.setItem("oc_token", data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

      {/* Left panel */}
      <div style={{ flex:1, background:"linear-gradient(135deg,#080810,#0e0e1a,#0d0820)", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"40px 48px", position:"relative", overflow:"hidden" }}>
        {/* Glow */}
        <div style={{ position:"absolute", top:"40%", left:"40%", transform:"translate(-50%,-50%)", width:500, height:500, background:"radial-gradient(circle,rgba(124,90,240,0.1),transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"20%", right:"10%", width:300, height:300, background:"radial-gradient(circle,rgba(62,207,178,0.06),transparent 70%)", pointerEvents:"none" }}/>

        {/* Back + Logo */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <a href="/landing.html" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
            <div style={{ width:36, height:36, borderRadius:9, background:"linear-gradient(135deg,#7c5af0,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>⚡</div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:19, color:"#e8e8f5" }}>Boost<span style={{ color:"#7c5af0" }}>Chat</span></span>
          </a>
          <a href="/landing.html" style={{ display:"flex", alignItems:"center", gap:6, color:"#6060a0", fontSize:13, textDecoration:"none", border:"1px solid #1e1e35", borderRadius:8, padding:"6px 14px", transition:"color 0.2s" }}
            onMouseOver={e=>e.currentTarget.style.color="#e8e8f5"} onMouseOut={e=>e.currentTarget.style.color="#6060a0"}>
            ← Back to site
          </a>
        </div>

        {/* Center content */}
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(124,90,240,0.1)", border:"1px solid rgba(124,90,240,0.25)", borderRadius:100, padding:"5px 14px", fontSize:11, fontWeight:700, color:"#a78bfa", letterSpacing:0.5, marginBottom:28 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#3ecfb2", boxShadow:"0 0 8px #3ecfb2", animation:"pulse 2s infinite", display:"inline-block" }}></span>
            PRIVATE · INVITE ONLY
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px,4vw,58px)", fontWeight:800, letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:16, color:"#e8e8f5" }}>
            Your business.<br/>
            <span style={{ background:"linear-gradient(135deg,#7c5af0,#3ecfb2)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Fully wired.</span>
          </h1>
          <p style={{ color:"#6060a0", fontSize:15, lineHeight:1.7, maxWidth:380, marginBottom:32 }}>
            Sign in to access your BoostChat dashboard and manage your operations in real time.
          </p>
          <a href="https://t.me/yeyeyewepaid" target="_blank" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#0088cc", color:"#fff", borderRadius:10, padding:"12px 24px", fontSize:14, fontWeight:700, textDecoration:"none", boxShadow:"0 8px 24px rgba(0,136,204,0.3)" }}>
            ✈ Contact on Telegram
          </a>
        </div>

        {/* Bottom stat cards */}
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

      {/* Right panel - login form */}
      <div style={{ width:460, background:"#0e0e1a", display:"flex", flexDirection:"column", justifyContent:"center", padding:"48px", borderLeft:"1px solid #1e1e35" }}>
        <div style={{ marginBottom:36 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, marginBottom:6, color:"#e8e8f5", letterSpacing:"-0.5px" }}>Welcome back</h2>
          <p style={{ color:"#5050a0", fontSize:14 }}>Sign in to your BoostChat account.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#6060a0", marginBottom:6, letterSpacing:0.3 }}>USERNAME OR EMAIL</label>
            <input
              className="login-input"
              value={form.username}
              onChange={e => setForm({...form, username:e.target.value})}
              placeholder="Enter your username..."
              style={{ width:"100%", background:"#12121f", border:`1px solid ${error?"#e05050":"#1e1e35"}`, borderRadius:10, padding:"12px 16px", color:"#e8e8f5", fontSize:14, fontFamily:"inherit" }}
              autoComplete="username"
            />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#6060a0", marginBottom:6, letterSpacing:0.3 }}>PASSWORD</label>
            <input
              className="login-input"
              type="password"
              value={form.password}
              onChange={e => setForm({...form, password:e.target.value})}
              placeholder="Enter your password..."
              style={{ width:"100%", background:"#12121f", border:"1px solid #1e1e35", borderRadius:10, padding:"12px 16px", color:"#e8e8f5", fontSize:14, fontFamily:"inherit" }}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={{ background:"rgba(224,80,80,0.1)", border:"1px solid rgba(224,80,80,0.25)", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#f87171", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
              ⚠ {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ width:"100%", background: loading?"#5a4ab0":"#7c5af0", border:"none", borderRadius:10, padding:"13px", color:"#fff", fontSize:15, fontWeight:700, cursor: loading?"not-allowed":"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 8px 24px rgba(124,90,240,0.3)", transition:"all 0.2s" }}>
            {loading ? <div style={{ width:18, height:18, border:"2px solid #ffffff44", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/> : null}
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>

        <div style={{ textAlign:"center", marginTop:24, fontSize:12, color:"#3a3a6a", lineHeight:1.6 }}>
          Don't have access?{" "}
          <a href="https://t.me/yeyeyewepaid" target="_blank" style={{ color:"#7c5af0", textDecoration:"none", fontWeight:600 }}>Contact us on Telegram</a>
        </div>
      </div>
    </div>
  );
  

  return (
    <div style={{ display:"flex", height:"100vh", background:"#0d0d12", fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes spin { to { transform:rotate(360deg); } }
        input::placeholder { color:#404060; }
      `}</style>

      {/* Left panel */}
      <div style={{ flex:1, background:"linear-gradient(135deg,#0d0820,#1a1035,#0d1525)", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"48px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)", width:400, height:400, background:"radial-gradient(circle,#6c4fd833,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:40, left:48, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#6c4fd8,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>💬</div>
          <span style={{ fontWeight:800, fontSize:18, background:"linear-gradient(90deg,#a78bfa,#60a5fa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Boost Chat</span>
        </div>
        <h1 style={{ fontSize:32, fontWeight:900, color:"#fff", marginBottom:12, lineHeight:1.2 }}>Boost Chat</h1>
        <p style={{ color:"#8080a0", fontSize:15, lineHeight:1.6, maxWidth:400 }}>
          Interested in incorporating Boost Chat into your business operations? Reach out to the developer via Telegram for direct assistance and consultation.
        </p>
        <div style={{ marginTop:24 }}>
          <button style={{ ...S.btn("#0088cc"), borderRadius:20, fontSize:13 }}>✈ fearganni</button>
        </div>
      </div>

      {/* Right panel - login form */}
      <div style={{ width:480, background:"#13131a", display:"flex", flexDirection:"column", justifyContent:"center", padding:"48px", borderLeft:"1px solid #1e1e2e" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
          <div>
            <h2 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>Boost Chat</h2>
            <p style={{ color:"#6060a0", fontSize:13 }}>Streamlining Support, Amplifying Success.</p>
          </div>
          <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#6c4fd8,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>💬</div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:14 }}>
            <input
              value={form.username}
              onChange={e => setForm({...form, username:e.target.value})}
              placeholder="Email Address or Username"
              style={{ ...S.input, padding:"12px 16px", border: error ? "1px solid #e05050" : "1px solid #2a2a3e" }}
              autoComplete="username"
            />
          </div>
          <div style={{ marginBottom:14 }}>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({...form, password:e.target.value})}
              placeholder="Password"
              style={{ ...S.input, padding:"12px 16px" }}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={{ background:"#e0505022", border:"1px solid #e0505044", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#f87171", marginBottom:14 }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#a0a0c0", cursor:"pointer" }}>
              <input type="checkbox" defaultChecked style={{ accentColor:"#6c4fd8" }}/> Remember Me
            </label>
            <span style={{ fontSize:13, color:"#6c4fd8", cursor:"pointer" }}>Lost password?</span>
          </div>

          <button type="submit" disabled={loading}
            style={{ ...S.btn("#34d398"), width:"100%", justifyContent:"center", fontSize:14, padding:"12px", marginBottom:12, opacity: loading ? 0.7 : 1 }}>
            {loading ? <Spinner size={16}/> : null}
            {loading ? "Signing in..." : "Sign me in"}
          </button>
        </form>

        <div style={{ textAlign:"center", marginTop:8, fontSize:12, color:"#4040a0" }}>
          Need access? Contact the administrator for an invite link.
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
  const pts = data.map((d, i) => `${(i/(data.length-1||1))*w},${h-(d[valueKey]/max)*(h-10)-5}`);
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
const TopBar = ({ page, setPage, user, onLogout, showNotifs, setShowNotifs }) => (
  <div style={S.topbar}>
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#6c4fd8,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>💬</div>
      <span style={{ fontWeight:800, fontSize:15, background:"linear-gradient(90deg,#a78bfa,#60a5fa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Boost chat</span>
    </div>
    <div style={{ display:"flex", gap:6 }}>
      {["Customers","Tickets","Analytics","Reports","Logs"].map(p => {
        const id = p.toLowerCase();
        const active = page === id;
        return (
          <button key={p} onClick={() => setPage(id)}
            style={{ ...S.btnOutline, fontSize:12, padding:"5px 12px", display:"flex", alignItems:"center", gap:5,
              background: active ? "#6c4fd822" : "transparent",
              color: active ? "#a78bfa" : "#a0a0c0",
              border: active ? "1px solid #6c4fd855" : "1px solid #2a2a3e" }}>
            {{"customers":"👥","tickets":"#","analytics":"📊","reports":"📋","logs":"📄"}[id]} {p}
          </button>
        );
      })}
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ position:"relative" }}>
        <button onClick={e => { e.stopPropagation(); setShowNotifs(v => !v); }}
          style={{ ...S.btnOutline, padding:"5px 10px", position:"relative" }}>
          🔔
          <span style={{ position:"absolute", top:-5, right:-5, background:"#e05050", borderRadius:"50%", width:17, height:17, fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700 }}>!</span>
        </button>
        {showNotifs && (
          <div style={{ position:"absolute", right:0, top:42, width:300, ...S.card, zIndex:100, boxShadow:"0 20px 60px #00000090" }} onClick={e => e.stopPropagation()}>
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
    <div style={{ width: collapsed ? 52 : 220, background:"#13131a", borderRight:"1px solid #1e1e2e", display:"flex", flexDirection:"column", transition:"width 0.2s", flexShrink:0, overflow:"hidden" }}>
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
        {[{id:"hub",label:"Hub",icon:"⊞"},{id:"purchase",label:"Purchase",icon:"🛒"},{id:"bots",label:"Bots",icon:"🤖"},{id:"nodes",label:"Nodes",icon:"⬡"}].map(item => (
          <button key={item.id} onClick={() => { setPage(item.id); setSelectedNode(null); }}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, border:"none",
              background: page===item.id ? "#6c4fd822" : "transparent",
              color: page===item.id ? "#a78bfa" : "#c0c0e0",
              cursor:"pointer", fontSize:13, fontWeight: page===item.id ? 700 : 400,
              marginBottom:2, justifyContent: collapsed ? "center" : "flex-start" }}>
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
                  <button onClick={() => { setSelectedNode(isOpen ? null : node); setPage(isOpen ? "nodes" : "node-detail"); }}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:8, border:"none",
                      background: isOpen ? "#6c4fd822" : "transparent",
                      color: isOpen ? "#a78bfa" : "#c0c0e0",
                      cursor:"pointer", fontSize:13, marginBottom:2 }}>
                    <div style={{ width:26, height:26, borderRadius:7, background: isOpen?"#6c4fd833":"#1e1e2e", border: isOpen?"1px solid #6c4fd855":"1px solid #2a2a3e", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, flexShrink:0, color: isOpen?"#a78bfa":"#c0c0e0" }}>
                      {node.name[0].toUpperCase()}
                    </div>
                    <span style={{ flex:1, textAlign:"left" }}>{node.name}</span>
                    <span style={{ color:"#6060a0", fontSize:11 }}>{isOpen ? "▼" : "›"}</span>
                  </button>
                  {isOpen && (
                    <div style={{ marginLeft:12, marginBottom:4, borderLeft:"1px solid #2a2a3e", paddingLeft:12 }}>
                      {["overview","customers","tickets","analytics","reports","logs"].map(sub => (
                        <button key={sub} onClick={() => setPage(sub==="overview"?"node-detail":sub)}
                          style={{ width:"100%", display:"flex", alignItems:"center", gap:6, padding:"6px 8px", borderRadius:6, border:"none",
                            background:"transparent", color: page===(sub==="overview"?"node-detail":sub) ? "#a78bfa" : "#8080a0",
                            cursor:"pointer", fontSize:12, marginBottom:1 }}>
                          <span style={{ width:5, height:5, borderRadius:"50%", background: page===(sub==="overview"?"node-detail":sub)?"#a78bfa":"#4040a0", flexShrink:0, display:"inline-block" }}></span>
                          <span style={{ textTransform:"capitalize" }}>{sub}</span>
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
                background: isProfilePage ? "#6c4fd822" : "transparent",
                color: isProfilePage ? "#a78bfa" : "#c0c0e0",
                cursor:"pointer", fontSize:13, marginBottom:2 }}>
              <span style={{ fontSize:15 }}>👤</span>
              <span style={{ flex:1, textAlign:"left" }}>Profile</span>
              <span style={{ color:"#6060a0", fontSize:11 }}>{profileOpen ? "▼" : "›"}</span>
            </button>
            {profileOpen && (
              <div style={{ marginLeft:12, marginBottom:4, borderLeft:"1px solid #2a2a3e", paddingLeft:12 }}>
                {["settings","notifications"].map(sub => (
                  <button key={sub} onClick={() => { setPage(sub); setSelectedNode(null); }}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:6, padding:"6px 8px", borderRadius:6, border:"none",
                      background:"transparent", color: page===sub ? "#a78bfa" : "#8080a0",
                      cursor:"pointer", fontSize:12, marginBottom:1 }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background: page===sub?"#a78bfa":"#4040a0", flexShrink:0, display:"inline-block" }}></span>
                    <span style={{ textTransform:"capitalize" }}>{sub}</span>
                  </button>
                ))}
              </div>
            )}
            <button style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, border:"none", background:"transparent", color:"#c0c0e0", cursor:"pointer", fontSize:13, marginBottom:2 }}>
              <span style={{ fontSize:15 }}>🚪</span>
              <span style={{ flex:1, textAlign:"left" }}>Sign-out</span>
              <span style={{ color:"#3a3a5a" }}>›</span>
            </button>
          </>
        )}
      </div>
      <button onClick={() => setCollapsed(!collapsed)} style={{ margin:"8px 6px 10px", padding:"8px", borderRadius:8, border:"none", background:"#1e1e2e", color:"#6060a0", cursor:"pointer", fontSize:14 }}>
        {collapsed ? "»" : "«"}
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
    // Aggregate stats from all nodes
    const load = async () => {
      if (!nodes.length) return;
      let totalRevenue = 0, totalTickets = 0, activeUsers = 0;
      for (const node of nodes) {
        try {
          const data = await api(`/analytics/${node.id}?period=1`);
          totalRevenue += parseFloat(data.overview?.total_revenue || 0);
          totalTickets += parseInt(data.overview?.paid_tickets || 0);
          activeUsers += parseInt(data.overview?.unique_customers || 0);
        } catch {}
      }
      setStats({ revenue: totalRevenue, paidTickets: totalTickets, activeUsers });
    };
    load();
  }, [nodes]);

  return (
    <div>
      <h1 style={{ margin:"0 0 4px", fontSize:24, fontWeight:800 }}>Dashboard</h1>
      <p style={{ margin:"0 0 24px", color:"#6060a0", fontSize:13 }}>View your analytics and statistics for your bots and webapps.</p>

      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:20, marginBottom:24 }}>
        <div style={{ ...S.card, padding:"32px 28px", background:"linear-gradient(135deg,#1a1030,#1e1535 60%,#0d1525)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:24, top:"50%", transform:"translateY(-50%)", fontSize:90, opacity:0.1 }}>💬</div>
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
          { label:"TODAY'S ACTIVE USERS", value: stats?.activeUsers ?? "—", icon:"👥", color:"#f59e0b" },
          { label:"TODAY'S PAID TICKETS", value: stats?.paidTickets ?? "—", icon:"🎫", color:"#60a5fa" },
          { label:"ACTIVE NODES", value: nodes.length, icon:"⬡", color:"#a78bfa" },
        ].map((s,i) => (
          <div key={i} style={{ ...S.card, padding:"20px 24px", flex:1, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:16, top:16, fontSize:44, opacity:0.12 }}>{s.icon}</div>
            <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1.5, color:s.color+"88", marginBottom:8, fontWeight:700 }}>{s.label}</div>
            <div style={{ fontSize:32, fontWeight:900, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ ...S.card }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", gap:8 }}>
          <span>⬡</span><span style={{ fontWeight:700, fontSize:13 }}>Your Nodes</span>
        </div>
        {nodes.length === 0 ? (
          <div style={{ padding:"32px", textAlign:"center", color:"#4040a0" }}>
            <div style={{ fontSize:32, marginBottom:12 }}>⬡</div>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:8 }}>No nodes yet</div>
            <div style={{ fontSize:13, marginBottom:16 }}>Create your first node to get started</div>
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
            <span style={{ ...S.badge("#34d398") }}>{node.status}</span>
            <span style={{ color:"#3a3a5a" }}>›</span>
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
      await api("/nodes", { method:"POST", body: form });
      setForm({ name:"", timezone:"America/New_York", domain:"" });
      setShowForm(false);
      refreshNodes();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const deleteNode = async (id) => {
    if (!confirm("Delete this node? This cannot be undone.")) return;
    try {
      await api(`/nodes/${id}`, { method:"DELETE" });
      refreshNodes();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 style={{ margin:"0 0 4px", fontSize:24, fontWeight:800 }}>Nodes</h1>
      <p style={{ margin:"0 0 24px", color:"#6060a0", fontSize:13 }}>Manage your own nodes or create new ones with ease!</p>

      <div style={{ ...S.card, marginBottom:24 }}>
        <div onClick={() => setShowForm(!showForm)} style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", borderBottom: showForm ? "1px solid #1e1e2e" : "none" }}>
          <span style={{ color:"#a78bfa" }}>+</span>
          <span style={{ fontWeight:700, fontSize:14 }}>Add a new node</span>
          <span style={{ marginLeft:"auto", color:"#6060a0" }}>{showForm ? "▲" : "▼"}</span>
        </div>
        {showForm && (
          <div style={{ padding:"20px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div>
                <label style={{ display:"block", fontSize:12, color:"#8080a0", marginBottom:5, fontWeight:600 }}>Node name *</label>
                <input style={S.input} placeholder="e.g. Sam, QuickEats..." value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
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

      {nodesLoading ? (
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"32px", color:"#6060a0" }}><Spinner/> Loading nodes...</div>
      ) : nodes.length === 0 ? (
        <div style={{ ...S.card, padding:"48px", textAlign:"center", color:"#4040a0" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>⬡</div>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>No nodes yet</div>
          <div style={{ fontSize:13 }}>Create your first node above to get started.</div>
        </div>
      ) : nodes.map(node => (
        <div key={node.id} style={{ ...S.card, marginBottom:16 }}>
          <div style={{ padding:"14px 20px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontWeight:700, fontSize:13, color:"#8080a0" }}>{node.name}</span>
            <span style={S.badge("#34d398")}>{node.status}</span>
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

// ─── NODE DETAIL ─────────────────────────────────────────────────────────────
const NodeDetailPage = ({ node, setPage, refreshNodes }) => {
  const [tab, setTab] = useState("overview");
  const [nodeData, setNodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [botForm, setBotForm] = useState({ platform:"telegram", token:"", bot_name:"" });
  const [addingBot, setAddingBot] = useState(false);
  const [showBotForm, setShowBotForm] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api(`/nodes/${node.id}`);
        setNodeData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [node.id]);

  const addBot = async () => {
    if (!botForm.token) return;
    setAddingBot(true);
    try {
      await api(`/nodes/${node.id}/bots`, { method:"POST", body: botForm });
      setBotForm({ platform:"telegram", token:"", bot_name:"" });
      setShowBotForm(false);
      const data = await api(`/nodes/${node.id}`);
      setNodeData(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingBot(false);
    }
  };

  const removeBot = async (botId) => {
    if (!confirm("Remove this bot?")) return;
    try {
      await api(`/nodes/${node.id}/bots/${botId}`, { method:"DELETE" });
      const data = await api(`/nodes/${node.id}`);
      setNodeData(data);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:4, color:"#6060a0", fontSize:13 }}>
        <span onClick={() => setPage("nodes")} style={{ cursor:"pointer", color:"#a78bfa" }}>Nodes</span> / <span>{node.name}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ margin:"0 0 4px", fontSize:22, fontWeight:800 }}>{node.name}</h1>
          <p style={{ margin:0, color:"#6060a0", fontSize:13 }}>Manage, customize and configure your Boost Chat node.</p>
        </div>
      </div>

      <div style={{ display:"flex", gap:2, marginBottom:20, borderBottom:"1px solid #1e1e2e" }}>
        {["overview","bots","workers"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:"8px 16px", border:"none", background:"transparent", color: tab===t?"#a78bfa":"#6060a0", cursor:"pointer", fontSize:13, fontWeight:700, textTransform:"capitalize", borderBottom: tab===t?"2px solid #a78bfa":"2px solid transparent", marginBottom:-1 }}>
            {t}
          </button>
        ))}
      </div>

      {loading ? <div style={{ display:"flex", gap:12, padding:"32px", color:"#6060a0" }}><Spinner/> Loading...</div> : (
        <>
          {tab === "overview" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div style={{ ...S.card, padding:"20px" }}>
                <div style={{ fontSize:13, fontWeight:700, marginBottom:14 }}>Node Info</div>
                {[["Name",nodeData?.node?.name],["Type",nodeData?.node?.type],["Timezone",nodeData?.node?.timezone],["Status",nodeData?.node?.status],["Created",nodeData?.node?.created_at ? new Date(nodeData.node.created_at).toLocaleDateString() : "—"]].map(([k,v]) => (
                  <div key={k} style={{ fontSize:13, marginBottom:8 }}>
                    <span style={{ color:"#6060a0" }}>⊙ {k} </span>
                    <span style={{ color: v==="active"?"#34d398":"#e2e2f0" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ ...S.card, padding:"20px" }}>
                <div style={{ fontSize:13, fontWeight:700, marginBottom:14 }}>Connected Bots</div>
                {nodeData?.bots?.length === 0 ? (
                  <div style={{ color:"#4040a0", fontSize:13 }}>No bots connected yet.<br/>Go to the Bots tab to add one.</div>
                ) : nodeData?.bots?.map(bot => (
                  <div key={bot.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, padding:"8px 12px", background:"#1a1a28", borderRadius:8, border:"1px solid #2a2a3e" }}>
                    <span style={{ color: bot.platform==="telegram"?"#60a5fa":bot.platform==="revolt"?"#ff4654":"#7289da", fontWeight:900 }}>
                      {bot.platform==="telegram"?"✈":bot.platform==="revolt"?"R":"◈"}
                    </span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:700 }}>{bot.bot_name || bot.platform}</div>
                      <div style={{ fontSize:10, color:"#5050a0", textTransform:"capitalize" }}>{bot.platform}</div>
                    </div>
                    <span style={{ ...S.badge("#34d398"), fontSize:10 }}>active</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "bots" && (
            <div>
              <div style={{ ...S.card, marginBottom:16 }}>
                <div style={{ padding:"14px 20px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontWeight:700, fontSize:13 }}>Connected Bots ({nodeData?.bots?.length || 0})</span>
                  <button onClick={() => setShowBotForm(!showBotForm)} style={{ ...S.btn(), fontSize:12, padding:"5px 12px" }}>+ Add Bot</button>
                </div>
                {showBotForm && (
                  <div style={{ padding:"16px 20px", borderBottom:"1px solid #1e1e2e", background:"#1a1a28" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:12 }}>
                      <div>
                        <label style={{ display:"block", fontSize:12, color:"#8080a0", marginBottom:5 }}>Platform</label>
                        <select style={S.input} value={botForm.platform} onChange={e=>setBotForm({...botForm,platform:e.target.value})}>
                          <option value="telegram">Telegram</option>
                          <option value="discord">Discord</option>
                          <option value="revolt">Revolt</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display:"block", fontSize:12, color:"#8080a0", marginBottom:5 }}>Bot Token</label>
                        <input style={S.input} placeholder="Paste bot token..." value={botForm.token} onChange={e=>setBotForm({...botForm,token:e.target.value})}/>
                      </div>
                      <div>
                        <label style={{ display:"block", fontSize:12, color:"#8080a0", marginBottom:5 }}>Bot Name</label>
                        <input style={S.input} placeholder="e.g. Sam Tele" value={botForm.bot_name} onChange={e=>setBotForm({...botForm,bot_name:e.target.value})}/>
                      </div>
                    </div>
                    <button onClick={addBot} disabled={addingBot} style={{ ...S.btn(), fontSize:12 }}>
                      {addingBot ? <Spinner size={14}/> : null}
                      {addingBot ? "Adding..." : "Add Bot"}
                    </button>
                  </div>
                )}
                <div style={{ padding:"12px 20px" }}>
                  {!nodeData?.bots?.length ? (
                    <div style={{ padding:"20px", textAlign:"center", color:"#4040a0", fontSize:13 }}>No bots yet. Add your first bot above!</div>
                  ) : nodeData.bots.map(bot => (
                    <div key={bot.id} style={{ display:"flex", alignItems:"center", padding:"12px 16px", background:"#1a1a28", borderRadius:10, marginBottom:8, border:"1px solid #2a2a3e" }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:"#2a2a3e", display:"flex", alignItems:"center", justifyContent:"center", marginRight:12, fontWeight:900, color: bot.platform==="telegram"?"#60a5fa":bot.platform==="revolt"?"#ff4654":"#7289da" }}>
                        {bot.platform==="telegram"?"✈":bot.platform==="revolt"?"R":"◈"}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700 }}>{bot.bot_name || "Unnamed bot"}</div>
                        <div style={{ fontSize:11, color:"#5050a0", textTransform:"capitalize" }}>{bot.platform} · Added {new Date(bot.created_at).toLocaleDateString()}</div>
                      </div>
                      <span style={{ ...S.badge("#34d398"), marginRight:12 }}>✓ Active</span>
                      <button onClick={() => removeBot(bot.id)} style={{ ...S.btn("#e05050"), fontSize:11, padding:"5px 12px" }}>✕ Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "workers" && (
            <div style={S.card}>
              <div style={{ padding:"14px 20px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontWeight:700, fontSize:13 }}>Workers ({nodeData?.workers?.length || 0})</span>
              </div>
              {!nodeData?.workers?.length ? (
                <div style={{ padding:"32px", textAlign:"center", color:"#4040a0", fontSize:13 }}>No workers assigned yet. Use invite links to add workers.</div>
              ) : nodeData.workers.map(w => (
                <div key={w.id} style={{ padding:"12px 20px", borderBottom:"1px solid #1a1a2a", display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#6c4fd8,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14 }}>
                    {w.username[0].toUpperCase()}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700 }}>{w.username}</div>
                    <div style={{ fontSize:11, color:"#5050a0", textTransform:"capitalize" }}>{w.role}</div>
                  </div>
                  <span style={S.badge("#a78bfa")}>{w.cut_percentage}% cut</span>
                </div>
              ))}
            </div>
          )}
        </>
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedNode) params.append("node_id", selectedNode.id);
        if (tab === "banned") params.append("banned", "true");
        const data = await api(`/customers?${params}`);
        setCustomers(data.customers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedNode, tab]);

  const filtered = customers.filter(c =>
    [c.username, c.display_name, c.telegram_id?.toString()].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <h1 style={{ margin:"0 0 4px", fontSize:24, fontWeight:800 }}>Customers</h1>
      <p style={{ margin:"0 0 20px", color:"#6060a0", fontSize:13 }}>
        {selectedNode ? `Showing customers from node: ${selectedNode.name}` : "Showing all customers across all nodes."}
      </p>
      <div style={S.card}>
        <div style={{ padding:"12px 20px", borderBottom:"1px solid #1e1e2e", display:"flex", gap:4 }}>
          {[["all","All"],["paid","Paid"],["banned","Banned"]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding:"6px 16px", borderRadius:8, border:"none", background:tab===id?"#6c4fd822":"transparent", color:tab===id?"#a78bfa":"#6060a0", cursor:"pointer", fontSize:13, fontWeight:tab===id?700:400 }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ padding:"10px 20px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ color:"#6060a0" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by username, name or ID..." style={{ ...S.input, border:"none", background:"transparent", padding:"4px 0" }}/>
        </div>
        {loading ? (
          <div style={{ padding:"32px", display:"flex", alignItems:"center", gap:12, color:"#6060a0" }}><Spinner/> Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:"32px", textAlign:"center", color:"#4040a0", fontSize:13 }}>No customers yet. They'll appear here when they message your Telegram bot.</div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
              <thead>
                <tr style={{ borderBottom:"1px solid #1e1e2e" }}>
                  {["Telegram ID","Username","Display Name","Tickets","Paid","Revenue",""].map(h => (
                    <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:10, color:"#6060a0", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c,i) => (
                  <tr key={c.id} style={{ borderBottom:"1px solid #1a1a2a", background:i%2===0?"transparent":"#ffffff03" }}>
                    <td style={{ padding:"10px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:28, height:28, borderRadius:7, background:"#6c4fd822", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>💬</div>
                        <span style={{ fontSize:12, color:"#6060a0" }}>{c.telegram_id}</span>
                      </div>
                    </td>
                    <td style={{ padding:"10px 16px", fontSize:13 }}>
                      {c.username ? <span style={{ color:"#60a5fa" }}>⊙ {c.username}</span> : <span style={{ color:"#4040a0" }}>⊘ No username</span>}
                    </td>
                    <td style={{ padding:"10px 16px", fontSize:13 }}>{c.display_name}</td>
                    <td style={{ padding:"10px 16px" }}><span style={S.badge("#60a5fa")}># {c.total_tickets || 0}</span></td>
                    <td style={{ padding:"10px 16px" }}><span style={S.badge("#f59e0b")}># {c.paid_tickets || 0}</span></td>
                    <td style={{ padding:"10px 16px" }}><span style={S.badge("#34d398")}>$ {parseFloat(c.total_revenue||0).toFixed(2)}</span></td>
                    <td style={{ padding:"10px 16px" }}><button style={{ ...S.btnOutline, fontSize:12 }}>View ▾</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── TICKETS PAGE ─────────────────────────────────────────────────────────────
const TicketsPage = ({ selectedNode }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedNode) params.append("node_id", selectedNode.id);
      if (filter !== "all") params.append("status", filter);
      params.append("limit", "50");
      const data = await api(`/tickets?${params}`);
      setTickets(data.tickets || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedNode, filter]);

  useEffect(() => { load(); }, [load]);

  const filtered = tickets.filter(t =>
    [t.customer_username, t.customer_display, t.service_name].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const statusColor = (s) => ({ open:"#f59e0b", in_progress:"#60a5fa", paid:"#34d398", closed:"#6060a0", cancelled:"#e05050" }[s] || "#6060a0");

  return (
    <div style={{ display:"flex", height:"100%", margin:"-28px -32px" }}>
      <div style={{ width:200, background:"#13131a", borderRight:"1px solid #1e1e2e", padding:"14px 10px", flexShrink:0, display:"flex", flexDirection:"column" }}>
        <div style={{ fontSize:10, color:"#3a3a5a", textTransform:"uppercase", letterSpacing:1, marginBottom:8, padding:"0 6px" }}>
          {selectedNode ? selectedNode.name.toUpperCase() : "ALL NODES"}
        </div>
        {[["all","≡","Overview"],["open","✉","Open"],["in_progress","⟳","In Progress"],["paid","✓","Paid"],["closed","✕","Closed"]].map(([id,icon,label]) => (
          <button key={id} onClick={() => setFilter(id)}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, border:"none",
              background: filter===id?"#6c4fd822":"transparent", color: filter===id?"#a78bfa":"#c0c0e0", cursor:"pointer", fontSize:13, marginBottom:2 }}>
            <span>{icon}</span>
            <span style={{ flex:1, textAlign:"left" }}>{label}</span>
          </button>
        ))}
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"10px 20px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tickets, services..." style={{ ...S.input, width:280 }}/>
          <button onClick={load} style={{ ...S.btnOutline, fontSize:12 }}>↻ Refresh</button>
        </div>
        <div style={{ overflowY:"auto", flex:1 }}>
          {loading ? (
            <div style={{ padding:"32px", display:"flex", alignItems:"center", gap:12, color:"#6060a0" }}><Spinner/> Loading tickets...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding:"48px", textAlign:"center", color:"#4040a0" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>🎫</div>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>No tickets yet</div>
              <div style={{ fontSize:13 }}>Tickets will appear here when customers message your Telegram bot.</div>
            </div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead style={{ position:"sticky", top:0, background:"#13131a", zIndex:5 }}>
                <tr style={{ borderBottom:"1px solid #1e1e2e" }}>
                  <th style={{ width:32, padding:"10px 12px" }}></th>
                  <th style={{ padding:"10px 16px", textAlign:"left", fontSize:10, color:"#6060a0", fontWeight:700 }}>Customer</th>
                  <th style={{ padding:"10px 16px", textAlign:"left", fontSize:10, color:"#6060a0", fontWeight:700 }}>Service</th>
                  <th style={{ padding:"10px 16px", textAlign:"left", fontSize:10, color:"#6060a0", fontWeight:700 }}>Status</th>
                  <th style={{ padding:"10px 16px", textAlign:"left", fontSize:10, color:"#6060a0", fontWeight:700 }}>Worker</th>
                  <th style={{ padding:"10px 16px", textAlign:"left", fontSize:10, color:"#6060a0", fontWeight:700 }}>Amount</th>
                  <th style={{ padding:"10px 16px", textAlign:"right", fontSize:10, color:"#6060a0", fontWeight:700 }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t,i) => (
                  <tr key={t.id} style={{ borderBottom:"1px solid #1a1a2a", background:t.status==="cancelled"?"#e0505010":i%2===0?"#34d39806":"transparent", cursor:"pointer" }}>
                    <td style={{ padding:"10px 12px", textAlign:"center" }}>
                      <span style={{ color: statusColor(t.status), fontWeight:700 }}>{t.status==="cancelled"?"✕":"✓"}</span>
                    </td>
                    <td style={{ padding:"10px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:28, height:28, borderRadius:"50%", background:"#2a2a3e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>
                          {(t.customer_username||t.customer_display||"?")[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize:13, color:"#60a5fa" }}>⊙ {t.customer_username || t.customer_display || "Unknown"}</span>
                      </div>
                    </td>
                    <td style={{ padding:"10px 16px", fontSize:13, fontWeight:600 }}>{t.service_name || "—"}</td>
                    <td style={{ padding:"10px 16px" }}><span style={S.badge(statusColor(t.status))}>{t.status}</span></td>
                    <td style={{ padding:"10px 16px", fontSize:13, color:"#8080a0" }}>{t.worker_username || "—"}</td>
                    <td style={{ padding:"10px 16px" }}><span style={S.badge("#34d398")}>$ {parseFloat(t.amount_paid||0).toFixed(2)}</span></td>
                    <td style={{ padding:"10px 16px", fontSize:11, color:"#6060a0", textAlign:"right", whiteSpace:"nowrap" }}>
                      {new Date(t.updated_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div style={{ padding:"10px 20px", borderTop:"1px solid #1e1e2e", display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:12, color:"#6060a0", flexShrink:0 }}>
          <span>{filtered.length} shown / {total} total</span>
        </div>
      </div>
    </div>
  );
};

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
const AnalyticsPage = ({ selectedNode, nodes }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");
  const targetNode = selectedNode || nodes[0];

  useEffect(() => {
    if (!targetNode) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api(`/analytics/${targetNode.id}?period=${period}`);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [targetNode, period]);

  if (!targetNode) return (
    <div style={{ padding:"48px", textAlign:"center", color:"#4040a0" }}>
      <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>No nodes yet</div>
      <div style={{ fontSize:13 }}>Create a node first to see analytics.</div>
    </div>
  );

  return (
    <div style={{ margin:"-28px -32px" }}>
      {loading ? (
        <div style={{ padding:"48px", display:"flex", alignItems:"center", gap:12, color:"#6060a0" }}><Spinner/> Loading analytics...</div>
      ) : (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", borderBottom:"1px solid #1e1e2e" }}>
            {[
              { label:"TOTAL TICKETS", value:`# ${data?.overview?.total_tickets||0}`, color:"#60a5fa" },
              { label:"TOTAL REVENUE", value:`$ ${parseFloat(data?.overview?.total_revenue||0).toFixed(2)}`, color:"#34d398" },
              { label:"PAID TICKETS", value:`# ${data?.overview?.paid_tickets||0}`, color:"#f59e0b" },
            ].map((s,i) => (
              <div key={i} style={{ padding:"20px 28px", background:s.color+"10", borderRight:i<2?"1px solid #1e1e2e":"none" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                  <div style={{ fontSize:10, color:s.color+"88", fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>{s.label}</div>
                  {i===0 && (
                    <select value={period} onChange={e=>setPeriod(e.target.value)} style={{ ...S.input, width:"auto", padding:"3px 8px", fontSize:11 }}>
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                    </select>
                  )}
                </div>
                <div style={{ fontSize:28, fontWeight:900, color:s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:"24px 32px" }}>
            <div style={{ ...S.card, marginBottom:20 }}>
              <div style={{ padding:"14px 20px", borderBottom:"1px solid #1e1e2e", fontWeight:700, fontSize:13 }}>📈 Revenue Over Time — {targetNode.name}</div>
              <div style={{ padding:"20px" }}>
                <MiniChart data={data?.daily || []} color="#60a5fa" valueKey="revenue"/>
                {data?.daily?.length === 0 && <div style={{ textAlign:"center", color:"#4040a0", fontSize:13, marginTop:8 }}>No revenue data yet for this period.</div>}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              <div style={S.card}>
                <div style={{ padding:"12px 16px", borderBottom:"1px solid #1e1e2e", fontWeight:700, fontSize:13 }}>🛎 Top Services</div>
                {!data?.services?.length ? (
                  <div style={{ padding:"20px", color:"#4040a0", fontSize:13 }}>No service data yet.</div>
                ) : (
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr style={{ borderBottom:"1px solid #1e1e2e" }}>
                      {["Service","Tickets","Revenue"].map(h=><th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:10, color:"#6060a0", fontWeight:700 }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {data.services.map((s,i) => (
                        <tr key={i} style={{ borderBottom:"1px solid #1a1a2a" }}>
                          <td style={{ padding:"8px 12px", fontSize:12 }}>{s.service_name}</td>
                          <td style={{ padding:"8px 12px" }}><span style={S.badge("#60a5fa")}># {s.tickets}</span></td>
                          <td style={{ padding:"8px 12px" }}><span style={S.badge("#34d398")}>$ {parseFloat(s.revenue).toFixed(2)}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div style={S.card}>
                <div style={{ padding:"12px 16px", borderBottom:"1px solid #1e1e2e", fontWeight:700, fontSize:13 }}>👥 Top Workers</div>
                {!data?.workers?.length ? (
                  <div style={{ padding:"20px", color:"#4040a0", fontSize:13 }}>No worker data yet.</div>
                ) : (
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr style={{ borderBottom:"1px solid #1e1e2e" }}>
                      {["Worker","Tickets","Revenue","Cut"].map(h=><th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:10, color:"#6060a0", fontWeight:700 }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {data.workers.map((w,i) => (
                        <tr key={i} style={{ borderBottom:"1px solid #1a1a2a" }}>
                          <td style={{ padding:"8px 12px", fontSize:12 }}>{w.username}</td>
                          <td style={{ padding:"8px 12px" }}><span style={S.badge("#60a5fa")}># {w.tickets}</span></td>
                          <td style={{ padding:"8px 12px" }}><span style={S.badge("#34d398")}>$ {parseFloat(w.revenue).toFixed(2)}</span></td>
                          <td style={{ padding:"8px 12px" }}><span style={S.badge("#e05050")}>{w.cut_percentage}%</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
const SettingsPage = ({ user }) => {
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const Row = ({ label, value, desc, onManage, manageColor }) => (
    <div style={{ display:"flex", alignItems:"center", padding:"16px 20px", background:"#1a1a28", borderRadius:10, marginBottom:8, border:"1px solid #2a2a3e" }}>
      {desc && <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#6c4fd8,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, marginRight:14, flexShrink:0 }}>💬</div>}
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:700 }}>{label}</div>
        {value && <div style={{ fontSize:12, color:"#6060a0", marginTop:2 }}>{value}</div>}
        {desc && <div style={{ fontSize:12, color:"#6060a0", marginTop:2 }}>{desc}</div>}
      </div>
      {onManage
        ? <button style={{ ...S.btn(manageColor||"#f59e0b"), fontSize:12, padding:"6px 16px" }}>Manage</button>
        : <button style={{ ...S.btnOutline, fontSize:12, padding:"6px 16px" }} onClick={() => { setEditField(label); setEditValue(""); }}>Edit</button>
      }
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:4, color:"#6060a0", fontSize:13 }}>
        <span style={{ color:"#a78bfa" }}>Boost Chat</span> / <span style={{ color:"#a78bfa" }}>Profile</span> / <span>Settings</span>
      </div>
      <h1 style={{ margin:"0 0 4px", fontSize:24, fontWeight:800 }}>Settings</h1>
      <p style={{ margin:"0 0 24px", color:"#6060a0", fontSize:13 }}>Modify account information, and change critical settings for your account.</p>

      <div style={{ ...S.card, marginBottom:28, overflow:"hidden", position:"relative", height:190 }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#1a1035,#2d1b60,#0d1525)" }}/>
        <div style={{ position:"absolute", right:40, top:"50%", transform:"translateY(-50%)", fontSize:130, opacity:0.07 }}>💬</div>
        <div style={{ position:"relative", zIndex:1, padding:"28px", display:"flex", alignItems:"center", gap:20 }}>
          <div style={{ width:76, height:76, borderRadius:20, background:"linear-gradient(135deg,#6c4fd8,#4a90e2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, fontWeight:900, border:"3px solid #ffffff18", cursor:"pointer" }}>
            {user?.username?.[0]?.toUpperCase() || "U"}
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
        <Row label="Email" value={user?.email || "Not set"}/>
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
          <div style={{ ...S.card, padding:"28px", width:420, boxShadow:"0 20px 60px #00000090" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin:"0 0 4px", fontSize:16, fontWeight:700 }}>Edit {editField}</h3>
            <p style={{ margin:"0 0 16px", color:"#6060a0", fontSize:13 }}>Update your {editField.toLowerCase()} below.</p>
            <input style={{ ...S.input, marginBottom:16 }} placeholder={`New ${editField.toLowerCase()}...`} value={editValue} onChange={e=>setEditValue(e.target.value)}/>
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
  const [page, setPage] = useState("hub");
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [nodesLoading, setNodesLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  // Check existing session
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("oc_token");
      if (!token) { setAuthChecked(true); return; }
      try {
        const data = await api("/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem("oc_token");
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  const loadNodes = useCallback(async () => {
    if (!user) return;
    setNodesLoading(true);
    try {
      const data = await api("/nodes");
      setNodes(data.nodes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setNodesLoading(false);
    }
  }, [user]);

  useEffect(() => { loadNodes(); }, [loadNodes]);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem("oc_token");
    setUser(null);
    setNodes([]);
    setPage("hub");
  };

  const fullHeight = ["tickets","analytics","logs"].includes(page);

  if (!authChecked) return (
    <div style={{ ...S.root, alignItems:"center", justifyContent:"center" }}>
      <style>{"* { box-sizing:border-box; } @keyframes spin { to { transform:rotate(360deg); } }"}</style>
      <Spinner size={32}/>
    </div>
  );

  if (!user) return <LoginPage onLogin={handleLogin}/>;

  const renderPage = () => {
    switch(page) {
      case "hub": return <HubPage user={user} nodes={nodes} setPage={setPage} setSelectedNode={setSelectedNode}/>;
      case "nodes": return <NodesPage nodes={nodes} nodesLoading={nodesLoading} refreshNodes={loadNodes} setSelectedNode={setSelectedNode} setPage={setPage}/>;
      case "node-detail": return selectedNode ? <NodeDetailPage node={selectedNode} setPage={setPage} refreshNodes={loadNodes}/> : null;
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
        ::-webkit-scrollbar-thumb:hover { background:#353550; }
        input::placeholder { color:#404060; }
        select { appearance:none; }
        select option { background:#16161f; color:#e2e2f0; }
        button { font-family:inherit; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
      <TopBar page={page} setPage={setPage} user={user} onLogout={handleLogout} showNotifs={showNotifs} setShowNotifs={setShowNotifs}/>
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        <Sidebar page={page} setPage={setPage} nodes={nodes} nodesLoading={nodesLoading} selectedNode={selectedNode} setSelectedNode={setSelectedNode} collapsed={collapsed} setCollapsed={setCollapsed}/>
        <div style={{ flex:1, overflowY: fullHeight?"hidden":"auto", padding: fullHeight?0:"28px 32px", background:"#0d0d12", display: fullHeight?"flex":"block", flexDirection: fullHeight?"column":undefined }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
