// ─── TICKETS PAGE ───────────────────────────────────────────────────────────
const TicketsPage = ({ selectedNode }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
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

  return (
    <div style={{ display:"flex", height:"100%", margin:"-28px -32px", overflow:"hidden" }}>
      {/* Sidebar */}
      <div style={{ width:160, background:"#13131a", borderRight:"1px solid #1e1e2e", padding:"14px 8px", flexShrink:0, display:"flex", flexDirection:"column" }}>
        <div style={{ fontSize:10, color:"#3a3a5a", textTransform:"uppercase", letterSpacing:1, marginBottom:10, padding:"0 6px" }}>
          {selectedNode ? selectedNode.name.toUpperCase() : "ALL NODES"}
        </div>
        {[["all","All"],["open","Open"],["in_progress","Active"],["paid","Paid"],["closed","Closed"],["cancelled","Cancelled"]].map(([id, label]) => {
          const color = statusColor(id === "all" ? "open" : id);
          return (
            <button key={id} onClick={() => { setFilter(id); setPage(1); }}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:8, border:"none",
                background:filter===id?"#6c4fd822":"transparent", color:filter===id?"#a78bfa":"#c0c0e0",
                cursor:"pointer", fontSize:12, marginBottom:2, textAlign:"left" }}>
              {id !== "all" && <span style={{ width:6, height:6, borderRadius:"50%", background:color, flexShrink:0 }}/>}
              {id === "all" && <span style={{ fontSize:14 }}>≡</span>}
              {label}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
        {/* Toolbar */}
        <div style={{ padding:"12px 20px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tickets..." style={{ ...S.input, flex:1, maxWidth:320, fontSize:12, padding:"8px 12px" }}/>
          <span style={{ fontSize:12, color:"#6060a0", whiteSpace:"nowrap", minWidth:"fit-content" }}>{filtered.length} / {total}</span>
          <button onClick={load} style={{ ...S.btnOutline, fontSize:12, padding:"6px 12px" }}>↻</button>
        </div>

        {/* Table */}
        <div style={{ overflowY:"auto", flex:1, overflowX:"auto" }}>
          {loading ? (
            <div style={{ padding:"48px", display:"flex", alignItems:"center", gap:12, color:"#6060a0" }}><Spinner/> Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding:"48px", textAlign:"center", color:"#4040a0" }}>
              <div style={{ fontSize:28, marginBottom:10 }}>🎫</div>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>No tickets</div>
              <div style={{ fontSize:13 }}>Tickets will appear here when customers message your bot.</div>
            </div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:900 }}>
              <colgroup>
                <col style={{ width:40 }}/>
                <col style={{ width:200 }}/>
                <col style={{ width:140 }}/>
                <col style={{ width:110 }}/>
                <col style={{ width:130 }}/>
                <col style={{ width:90 }}/>
                <col style={{ width:100 }}/>
              </colgroup>
              <thead style={{ position:"sticky", top:0, background:"#13131a", zIndex:5 }}>
                <tr style={{ borderBottom:"1px solid #1e1e2e" }}>
                  <th style={{ padding:"10px 8px" }}></th>
                  <th style={{ padding:"10px 12px", textAlign:"left", fontSize:11, color:"#6060a0", fontWeight:700 }}>CUSTOMER</th>
                  <th style={{ padding:"10px 12px", textAlign:"left", fontSize:11, color:"#6060a0", fontWeight:700 }}>SERVICE</th>
                  <th style={{ padding:"10px 12px", textAlign:"left", fontSize:11, color:"#6060a0", fontWeight:700 }}>STATUS</th>
                  <th style={{ padding:"10px 12px", textAlign:"left", fontSize:11, color:"#6060a0", fontWeight:700 }}>WORKER</th>
                  <th style={{ padding:"10px 12px", textAlign:"left", fontSize:11, color:"#6060a0", fontWeight:700 }}>PAID</th>
                  <th style={{ padding:"10px 12px", textAlign:"right", fontSize:11, color:"#6060a0", fontWeight:700 }}>TIME</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const sc = statusColor(t.status);
                  const hasPaid = parseFloat(t.amount_paid || 0) > 0;
                  return (
                    <tr key={t.id} style={{ borderBottom:"1px solid #1a1a2a", cursor:"pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#1a1a28"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding:"10px 8px", textAlign:"center" }}>
                        <div style={{ width:7, height:7, borderRadius:"50%", background:sc, margin:"0 auto" }}/>
                      </td>
                      <td style={{ padding:"10px 12px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ width:28, height:28, borderRadius:"50%", background:"#2a2a4e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>
                            {(t.customer_username || t.customer_display || "?")[0].toUpperCase()}
                          </div>
                          <span style={{ fontSize:12, color:"#60a5fa", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {t.customer_username ? `@${t.customer_username}` : t.customer_display || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding:"10px 12px", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {t.service_name || "—"}
                      </td>
                      <td style={{ padding:"10px 12px" }}>
                        <span style={{ background:sc+"22", color:sc, border:`1px solid ${sc}44`, borderRadius:4, padding:"3px 8px", fontSize:11, fontWeight:700, whiteSpace:"nowrap", display:"inline-block" }}>
                          {statusLabel(t.status)}
                        </span>
                      </td>
                      <td style={{ padding:"10px 12px", fontSize:12 }}>
                        {t.worker_username
                          ? <span style={{ color:"#a78bfa", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}>{t.worker_username}</span>
                          : <span style={{ color:"#3a3a6a" }}>—</span>}
                      </td>
                      <td style={{ padding:"10px 12px" }}>
                        {hasPaid
                          ? <span style={{ background:"#34d39822", color:"#34d398", border:"1px solid #34d39844", borderRadius:4, padding:"3px 8px", fontSize:11, fontWeight:700, display:"inline-block" }}>
                              ${parseFloat(t.amount_paid).toFixed(2)}
                            </span>
                          : <span style={{ color:"#3a3a6a" }}>—</span>}
                      </td>
                      <td style={{ padding:"10px 12px", fontSize:11, color:"#6060a0", textAlign:"right", whiteSpace:"nowrap" }}>
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
        <div style={{ padding:"12px 20px", borderTop:"1px solid #1e1e2e", display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:12, color:"#6060a0", flexShrink:0 }}>
          <span>Page {page} of {totalPages||1}</span>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
              style={{ ...S.btnOutline, padding:"6px 12px", fontSize:12, opacity:page===1?0.4:1, cursor:page===1?"default":"pointer" }}>← Prev</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page>=totalPages}
              style={{ ...S.btnOutline, padding:"6px 12px", fontSize:12, opacity:page>=totalPages?0.4:1, cursor:page>=totalPages?"default":"pointer" }}>Next →</button>
          </div>
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
      try { const res = await api(`/analytics/${targetNode.id}?period=${period}`); setData(res); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [targetNode, period]);

  if (!targetNode) return (
    <div style={{ padding:"48px", textAlign:"center", color:"#4040a0" }}>
      <div style={{ fontSize:14, fontWeight:700 }}>No nodes yet</div>
    </div>
  );

  const ov = data?.overview || {};

  return (
    <div style={{ height:"100%", overflow:"auto", margin:"-28px -32px", paddingBottom:32 }}>
      {/* Header */}
      <div style={{ padding:"16px 32px", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:"#0d0d12", zIndex:10 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>Analytics</h1>
          <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#6060a0" }}>
            <span>📊 {targetNode.name}</span>
          </div>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)}
          style={{ ...S.input, width:"140px", padding:"8px 12px", fontSize:12 }}>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding:"48px 32px", display:"flex", alignItems:"center", gap:12, color:"#6060a0" }}>
          <Spinner/> Loading analytics...
        </div>
      ) : (
        <div style={{ padding:"32px" }}>
          {/* Top stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20, marginBottom:32 }}>
            {[
              { label:"TOTAL TICKETS", value:`${ov.total_tickets||0}`, color:"#60a5fa", icon:"🎫" },
              { label:"TOTAL REVENUE", value:`$${parseFloat(ov.total_revenue||0).toFixed(2)}`, color:"#34d398", icon:"💰" },
              { label:"PAID TICKETS", value:`${ov.paid_tickets||0}`, color:"#f59e0b", icon:"✅" },
            ].map((s,i) => (
              <div key={i} style={{ ...S.card, padding:"24px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", right:16, top:16, fontSize:40, opacity:0.08 }}>{s.icon}</div>
                <div style={{ fontSize:11, color:s.color+"88", fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>{s.label}</div>
                <div style={{ fontSize:36, fontWeight:900, color:s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Services + Workers */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:32 }}>
            {/* Services */}
            <div style={S.card}>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid #1e1e2e", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:8 }}>🛎 Top Services</div>
              {!data?.services?.length ? (
                <div style={{ padding:"24px", color:"#4040a0", fontSize:13, textAlign:"center" }}>No service data yet.</div>
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:280 }}>
                    <thead>
                      <tr style={{ borderBottom:"1px solid #1e1e2e" }}>
                        {["Service","Tickets","Revenue"].map(h => (
                          <th key={h} style={{ padding:"12px", textAlign:"left", fontSize:11, color:"#6060a0", fontWeight:700 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.services.slice(0,8).map((s,i) => (
                        <tr key={i} style={{ borderBottom:"1px solid #1a1a2a" }}>
                          <td style={{ padding:"12px", fontSize:12 }}>{s.name || "Unknown"}</td>
                          <td style={{ padding:"12px", fontSize:12, color:"#60a5fa", fontWeight:600 }}>{s.total_tickets||0}</td>
                          <td style={{ padding:"12px", fontSize:12, color:"#34d398", fontWeight:600 }}>${parseFloat(s.total_revenue||0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Workers */}
            <div style={S.card}>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid #1e1e2e", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:8 }}>👥 Top Workers</div>
              {!data?.workers?.length ? (
                <div style={{ padding:"24px", color:"#4040a0", fontSize:13, textAlign:"center" }}>No worker data yet.</div>
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:280 }}>
                    <thead>
                      <tr style={{ borderBottom:"1px solid #1e1e2e" }}>
                        {["Worker","Tickets","Revenue"].map(h => (
                          <th key={h} style={{ padding:"12px", textAlign:"left", fontSize:11, color:"#6060a0", fontWeight:700 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.workers.slice(0,8).map((w,i) => (
                        <tr key={i} style={{ borderBottom:"1px solid #1a1a2a" }}>
                          <td style={{ padding:"12px", fontSize:12, color:"#a78bfa" }}>{w.name || "Unknown"}</td>
                          <td style={{ padding:"12px", fontSize:12, color:"#60a5fa", fontWeight:600 }}>{w.total_tickets||0}</td>
                          <td style={{ padding:"12px", fontSize:12, color:"#34d398", fontWeight:600 }}>${parseFloat(w.total_revenue||0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div style={S.card}>
            <div style={{ padding:"20px", borderBottom:"1px solid #1e1e2e", fontWeight:700, fontSize:13 }}>📈 Summary</div>
            <div style={{ padding:"20px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
                <div>
                  <div style={{ fontSize:11, color:"#6060a0", marginBottom:6, fontWeight:600 }}>Average ticket value</div>
                  <div style={{ fontSize:20, fontWeight:700, color:"#34d398" }}>${ov.total_tickets > 0 ? (ov.total_revenue / ov.total_tickets).toFixed(2) : "0.00" }</div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:"#6060a0", marginBottom:6, fontWeight:600 }}>Completion rate</div>
                  <div style={{ fontSize:20, fontWeight:700, color:"#f59e0b" }}>{ov.total_tickets > 0 ? Math.round((ov.paid_tickets / ov.total_tickets) * 100) : 0}%</div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:"#6060a0", marginBottom:6, fontWeight:600 }}>Total customers</div>
                  <div style={{ fontSize:20, fontWeight:700, color:"#60a5fa" }}>{data?.total_customers || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};