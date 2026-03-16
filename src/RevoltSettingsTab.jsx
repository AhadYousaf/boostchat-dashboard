import { useState, useEffect } from "react";

const RevoltSettingsTab = ({ node, api, S }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [error, setError] = useState("");
  const [revoltGuildId, setRevoltGuildId] = useState("");
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedService, setExpandedService] = useState(null);
  
  // Category selection per service
  const [serviceCategories, setServiceCategories] = useState({});
  
  // Ticket naming per service
  const [ticketNaming, setTicketNaming] = useState({});
  
  // Enforced claiming per service
  const [enforcedClaiming, setEnforcedClaiming] = useState({});
  
  // Service status per service
  const [serviceStatus, setServiceStatus] = useState({});

  useEffect(() => {
    loadSettings();
  }, [node.id]);

  const loadSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api(`/nodes/${node.id}/settings`);
      
      setServices(data.services || []);
      
      const config = data.config || {};
      setRevoltGuildId(config.revolt_guild_id || "");
      
      // Load service-specific settings
      const cats = {};
      const naming = {};
      const claiming = {};
      const status = {};
      
      (data.services || []).forEach(service => {
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

  const fetchCategories = async () => {
    if (!revoltGuildId) {
      setError("Guild ID is required");
      return;
    }

    setFetchingCategories(true);
    setError("");
    try {
      const data = await api(`/nodes/${node.id}/revolt-categories?guild_id=${revoltGuildId}`);
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
    } finally {
      setFetchingCategories(false);
    }
  };

  const saveSettings = async () => {
    if (!revoltGuildId) {
      setError("Guild ID is required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const updatedServices = services.map(s => ({
        ...s,
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

      const payload = {
        services: updatedServices,
        questions: [],
        commands: [],
        revolt_guild_id: revoltGuildId
      };

      await api(`/nodes/${node.id}/settings`, {
        method: "PUT",
        body: payload
      });

      setSaving(false);
      await loadSettings();
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save settings");
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: "#6060a0" }}>Loading settings...</div>;
  }

  return (
    <div>
      {error && (
        <div style={{ background: "#e05050", color: "#fff", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          ❌ {error}
        </div>
      )}

      {/* Guild ID Setup */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#f87171" }}>⚡</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Revolt Server Configuration</span>
        </div>
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Guild ID</label>
            <input
              style={S.input}
              value={revoltGuildId}
              onChange={e => setRevoltGuildId(e.target.value)}
              placeholder="Enter your Revolt server/guild ID..."
            />
          </div>
          <button 
            onClick={fetchCategories} 
            disabled={fetchingCategories || !revoltGuildId}
            style={{ ...S.btn("#60a5fa"), fontSize: 12, padding: "8px 16px" }}>
            {fetchingCategories ? "Loading..." : "Load Categories"}
          </button>
        </div>
      </div>

      {/* Service Settings - Collapsible */}
      {services.length === 0 ? (
        <div style={{ ...S.card, padding: 20, textAlign: "center", color: "#6060a0" }}>
          No services created yet. Create services in Telegram tab first.
        </div>
      ) : (
        <div>
          {services.map(service => (
            <div key={service.id} style={{ ...S.card, marginBottom: 12 }}>
              {/* Collapsible Header */}
              <div 
                onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                style={{ 
                  padding: "12px 20px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 12,
                  cursor: "pointer",
                  borderBottom: expandedService === service.id ? "1px solid #1e1e2e" : "none"
                }}
              >
                <span style={{ fontSize: 16 }}>{expandedService === service.id ? "▼" : "▶"}</span>
                <span style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>{service.name}</span>
              </div>

              {/* Expanded Content */}
              {expandedService === service.id && (
                <div style={{ padding: "20px" }}>
                  {/* Category Selection */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#a78bfa" }}>Category settings</div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>Open category</label>
                      <select
                        style={S.input}
                        value={serviceCategories[service.id]?.open || ""}
                        onChange={e => setServiceCategories({ ...serviceCategories, [service.id]: { ...serviceCategories[service.id], open: e.target.value } })}
                      >
                        <option value="">Select category...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>Claimed category</label>
                      <select
                        style={S.input}
                        value={serviceCategories[service.id]?.claimed || ""}
                        onChange={e => setServiceCategories({ ...serviceCategories, [service.id]: { ...serviceCategories[service.id], claimed: e.target.value } })}
                      >
                        <option value="">Select category...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>Closed category</label>
                      <select
                        style={S.input}
                        value={serviceCategories[service.id]?.closed || ""}
                        onChange={e => setServiceCategories({ ...serviceCategories, [service.id]: { ...serviceCategories[service.id], closed: e.target.value } })}
                      >
                        <option value="">Select category...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Ticket Naming */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#a78bfa" }}>Ticket naming</div>
                    <div style={{ fontSize: 12, color: "#6060a0", marginBottom: 12 }}>
                      Options: {"{nickname}"} = contractor name, {"{count}"} = ticket number
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>Opened</label>
                      <input
                        style={S.input}
                        placeholder="ticket-{count}"
                        value={ticketNaming[service.id]?.opened || ""}
                        onChange={e => setTicketNaming({ ...ticketNaming, [service.id]: { ...ticketNaming[service.id], opened: e.target.value } })}
                      />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>Claimed</label>
                      <input
                        style={S.input}
                        placeholder="claimed-{nickname}-{count}"
                        value={ticketNaming[service.id]?.claimed || ""}
                        onChange={e => setTicketNaming({ ...ticketNaming, [service.id]: { ...ticketNaming[service.id], claimed: e.target.value } })}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>Closed</label>
                      <input
                        style={S.input}
                        placeholder="closed-{count}"
                        value={ticketNaming[service.id]?.closed || ""}
                        onChange={e => setTicketNaming({ ...ticketNaming, [service.id]: { ...ticketNaming[service.id], closed: e.target.value } })}
                      />
                    </div>
                  </div>

                  {/* Enforced Claiming */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#a78bfa" }}>Enforced claiming</div>

                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, color: "#6060a0", fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={enforcedClaiming[service.id]?.enabled || false}
                          onChange={e => setEnforcedClaiming({ ...enforcedClaiming, [service.id]: { ...enforcedClaiming[service.id], enabled: e.target.checked } })}
                          style={{ marginRight: 8 }}
                        />
                        Enabled?
                      </label>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>Max tickets per contractor</label>
                      <input
                        type="number"
                        style={S.input}
                        value={enforcedClaiming[service.id]?.maxTickets || 0}
                        onChange={e => setEnforcedClaiming({ ...enforcedClaiming, [service.id]: { ...enforcedClaiming[service.id], maxTickets: parseInt(e.target.value) || 0 } })}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>Timeout (seconds)</label>
                      <input
                        type="number"
                        style={S.input}
                        value={enforcedClaiming[service.id]?.timeout || 0}
                        onChange={e => setEnforcedClaiming({ ...enforcedClaiming, [service.id]: { ...enforcedClaiming[service.id], timeout: parseInt(e.target.value) || 0 } })}
                      />
                    </div>
                  </div>

                  {/* Service Status */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#a78bfa" }}>Service status</div>

                    <label style={{ fontSize: 12, color: "#6060a0", fontWeight: 600, marginBottom: 8, display: "block" }}>
                      <input
                        type="checkbox"
                        checked={serviceStatus[service.id]?.isOpen !== false}
                        onChange={e => setServiceStatus({ ...serviceStatus, [service.id]: { ...serviceStatus[service.id], isOpen: e.target.checked } })}
                        style={{ marginRight: 8 }}
                      />
                      Service open?
                    </label>

                    <label style={{ fontSize: 12, color: "#6060a0", fontWeight: 600, marginBottom: 8, display: "block" }}>
                      <input
                        type="checkbox"
                        checked={serviceStatus[service.id]?.isQueueFull || false}
                        onChange={e => setServiceStatus({ ...serviceStatus, [service.id]: { ...serviceStatus[service.id], isQueueFull: e.target.checked } })}
                        style={{ marginRight: 8 }}
                      />
                      Queue full?
                    </label>

                    <label style={{ fontSize: 12, color: "#6060a0", fontWeight: 600, display: "block" }}>
                      <input
                        type="checkbox"
                        checked={serviceStatus[service.id]?.isQueueOnBreak || false}
                        onChange={e => setServiceStatus({ ...serviceStatus, [service.id]: { ...serviceStatus[service.id], isQueueOnBreak: e.target.checked } })}
                        style={{ marginRight: 8 }}
                      />
                      Queue on break?
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        <button 
          onClick={saveSettings} 
          disabled={saving} 
          style={{ ...S.btn("#34d398"), fontSize: 13, padding: "10px 20px" }}>
          {saving ? "💾 Saving..." : "✅ Save All Settings"}
        </button>
        <button 
          onClick={loadSettings} 
          style={{ ...S.btnOutline, fontSize: 13, padding: "10px 20px" }}>
          ↻ Reload
        </button>
      </div>
    </div>
  );
};

export default RevoltSettingsTab;
