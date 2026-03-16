import { useState, useEffect } from "react";

const RevoltSettingsTab = ({ node, api, S }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Revolt config
  const [revoltBotToken, setRevoltBotToken] = useState("");
  const [revoltGuildId, setRevoltGuildId] = useState("");
  const [services, setServices] = useState([]);
  const [revoltChannels, setRevoltChannels] = useState({});

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [node.id]);

  const loadSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api(`/nodes/${node.id}/settings`);
      
      // Load services
      setServices(data.services || []);
      
      // Load revolt config from node_config
      const config = data.config || {};
      setRevoltBotToken(config.revolt_bot_token || "");
      setRevoltGuildId(config.revolt_guild_id || "");
      
      // Load channel IDs from services
      const channels = {};
      (data.services || []).forEach(service => {
        if (service.revolt_channel_id) {
          channels[service.id] = service.revolt_channel_id;
        }
      });
      setRevoltChannels(channels);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setError("");
    try {
      // Update services with channel IDs
      const updatedServices = services.map(s => ({
        ...s,
        revolt_channel_id: revoltChannels[s.id] || ""
      }));

      const payload = {
        services: updatedServices,
        questions: [],
        commands: [],
        guild_id: revoltGuildId,
        revolt_bot_token: revoltBotToken
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

      {/* Bot Customization Section */}
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#f87171" }}>⚡</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>BoostChat Settings</span>
        </div>
        <div style={{ padding: "20px" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>BoostChat bot customisation</h3>
          <p style={{ fontSize: 13, color: "#6060a0", marginBottom: 20, lineHeight: 1.7 }}>
            Configure your BoostChat bot settings to fit your business needs. You have the power to modify the ticket system and any included addons, ensuring that your team delivers the best possible service.
          </p>

          {/* Bot Customization */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Bot customization</div>
            
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Bot Token</label>
              <input
                type="password"
                style={S.input}
                value={revoltBotToken}
                onChange={e => setRevoltBotToken(e.target.value)}
                placeholder="Enter your Revolt bot token..."
              />
              <div style={{ fontSize: 11, color: "#4040a0", marginTop: 4 }}>⊙ Get your bot token from Revolt Developer Portal</div>
            </div>

            <div>
              <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Guild ID</label>
              <input
                style={S.input}
                value={revoltGuildId}
                onChange={e => setRevoltGuildId(e.target.value)}
                placeholder="Enter your Revolt server/guild ID..."
              />
              <div style={{ fontSize: 11, color: "#4040a0", marginTop: 4 }}>⊙ This is where your bot will create and manage tickets</div>
            </div>
          </div>

          {/* Service Ticket Management */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Service ticket management</div>
            <div style={{ fontSize: 12, color: "#6060a0", marginBottom: 12 }}>
              To effectively manage customer inquiries and responses, assign a Revolt channel where tickets for each service will be created.
            </div>

            {services.length === 0 ? (
              <div style={{ background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, padding: 16, color: "#6060a0", fontSize: 12, textAlign: "center" }}>
                No services created yet. Create services in the Telegram tab first.
              </div>
            ) : (
              <div>
                {services.map(service => (
                  <div key={service.id} style={{ background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, padding: 12, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e2f0" }}>{service.name}</div>
                        <div style={{ fontSize: 11, color: "#6060a0", marginTop: 4 }}>
                          {revoltChannels[service.id] ? `Channel: ${revoltChannels[service.id]}` : "No channel assigned"}
                        </div>
                      </div>
                      <input
                        style={{ ...S.input, width: 200, fontSize: 12 }}
                        placeholder="Channel ID"
                        value={revoltChannels[service.id] || ""}
                        onChange={e => setRevoltChannels({ ...revoltChannels, [service.id]: e.target.value })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Command Permissions */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Command permissions</div>
            <div style={{ background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", padding: "10px 0" }}>
                <span style={{ color: "#60a5fa", marginRight: 12 }}>⊙</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#60a5fa" }}>Default</div>
                  <div style={{ fontSize: 12, color: "#6060a0", marginTop: 2 }}>Change the permissions and availability of default commands. Default commands are the basics to the ticket tool system.</div>
                </div>
                <button style={{ ...S.btnOutline, fontSize: 11, padding: "4px 10px" }}>···</button>
              </div>
            </div>

            <div style={{ background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", padding: "10px 0" }}>
                <span style={{ color: "#f59e0b", marginRight: 12 }}>🔧</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b" }}>Utility</div>
                  <div style={{ fontSize: 12, color: "#6060a0", marginTop: 2 }}>Change the permissions and availability of utility commands. Utility are more sensitive commands that help with other functionality on the bot.</div>
                </div>
                <button style={{ ...S.btnOutline, fontSize: 11, padding: "4px 10px" }}>···</button>
              </div>
            </div>

            <div style={{ background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", padding: "10px 0" }}>
                <span style={{ color: "#34d398", marginRight: 12 }}>💰</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#34d398" }}>Accounting</div>
                  <div style={{ fontSize: 12, color: "#6060a0", marginTop: 2 }}>Change the permissions and availability of accounting addon commands. The accounting addon helps you manage your business better.</div>
                </div>
                <button style={{ ...S.btnOutline, fontSize: 11, padding: "4px 10px" }}>···</button>
              </div>
            </div>
          </div>

          {/* Miscellaneous Customization */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Miscellaneous customization</div>
            <div style={{ background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", padding: "10px 0" }}>
                <span style={{ color: "#f87171", marginRight: 12 }}>✦</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f87171" }}>Bot message passthrough</div>
                  <div style={{ fontSize: 12, color: "#6060a0", marginTop: 2 }}>Want a bot's message to passthrough to your customers? This can result in errors unless you know what you're doing.</div>
                </div>
                <button style={{ ...S.btnOutline, fontSize: 11, padding: "4px 10px" }}>···</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: "flex", gap: 8 }}>
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
