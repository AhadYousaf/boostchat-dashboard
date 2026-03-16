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
  const [serviceCategories, setServiceCategories] = useState({});
  const [ticketNaming, setTicketNaming] = useState({});
  const [enforcedClaiming, setEnforcedClaiming] = useState({});
  const [serviceStatus, setServiceStatus] = useState({});

  useEffect(() => {
    loadSettings();
  }, [node.id]);

  // Auto-load categories whenever guild ID changes or is loaded from DB
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
      setServices(data.services || []);
      const config = data.config || {};
      const guildId = config.revolt_guild_id || "";
      setRevoltGuildId(guildId);

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

  const fetchCategories = async (guildId) => {
    const id = guildId || revoltGuildId;
    if (!id) return;
    setFetchingCategories(true);
    try {
      const data = await api(`/nodes/${node.id}/revolt-categories?guild_id=${id}`);
      // Revolt returns categories with 'title' not 'name'
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

      await api(`/nodes/${node.id}/settings`, {
        method: "PUT",
        body: {
          services: updatedServices,
          questions: [],
          commands: [],
          revolt_guild_id: revoltGuildId
        }
      });

      setSaving(false);
      await loadSettings();
    } catch (err) {
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
          {fetchingCategories && <span style={{ fontSize: 11, color: "#6060a0", marginLeft: "auto" }}>Loading categories...</span>}
          {!fetchingCategories && categories.length > 0 && (
            <span style={{ fontSize: 11, color: "#34d398", marginLeft: "auto" }}>✓ {categories.length} categories loaded</span>
          )}
        </div>
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: 8 }}>
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
      </div>

      {/* Service Settings */}
      {services.length === 0 ? (
        <div style={{ ...S.card, padding: 20, textAlign: "center", color: "#6060a0" }}>
          No services created yet. Create services in the Telegram tab first.
        </div>
      ) : (
        <div>
          {services.map(service => (
            <div key={service.id} style={{ ...S.card, marginBottom: 12 }}>
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
                {serviceCategories[service.id]?.open && (
                  <span style={{ fontSize: 11, color: "#34d398" }}>✓ Configured</span>
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
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
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
