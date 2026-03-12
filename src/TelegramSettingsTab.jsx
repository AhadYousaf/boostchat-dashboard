// TelegramSettingsTab.jsx
// Drop this component into your App.jsx NodeDetailPage
// Replace the current Telegram tab section with this

import { useState, useEffect } from "react";

const TelegramSettingsTab = ({ node, api, S }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // State for data from API
  const [commands, setCommands] = useState([]);
  const [services, setServices] = useState([]);
  const [questions, setQuestions] = useState([]);

  // State for new items being added
  const [newCmd, setNewCmd] = useState({ cmd: "", desc: "" });
  const [newService, setNewService] = useState({ name: "", emoji: "" });
  const [newQuestion, setNewQuestion] = useState({ 
    service_id: "", 
    question: "", 
    type: "text", 
    options: [] 
  });
  const [newOption, setNewOption] = useState("");

  // Load data on mount
  useEffect(() => {
    loadSettings();
  }, [node.id]);

  const loadSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api(`/nodes/${node.id}/settings`);
      setCommands(data.commands || []);
      setServices(data.services || []);
      setQuestions(data.questions || []);
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
      await api(`/nodes/${node.id}/settings`, {
        method: "PUT",
        body: {
          commands: commands.map((c, i) => ({ cmd: c.command, desc: c.description })),
          services: services.map((s, i) => ({ 
            name: s.name, 
            emoji: s.emoji, 
            shortcode: s.shortcode || "" 
          })),
          questions: questions.map((q, i) => ({
            question: q.question,
            type: q.question_type,
            service_index: services.findIndex(s => s.id === q.service_id),
            options: q.options || []
          }))
        }
      });
      alert("✅ Settings saved!");
      await loadSettings();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Commands handlers
  const addCommand = () => {
    if (!newCmd.cmd || !newCmd.desc) return;
    setCommands([...commands, { command: newCmd.cmd, description: newCmd.desc }]);
    setNewCmd({ cmd: "", desc: "" });
  };

  const removeCommand = (index) => {
    setCommands(commands.filter((_, i) => i !== index));
  };

  // Services handlers
  const addService = () => {
    if (!newService.name) return;
    setServices([...services, { name: newService.name, emoji: newService.emoji || "⭐", shortcode: "" }]);
    setNewService({ name: "", emoji: "" });
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
    // Also remove questions for this service
    setQuestions(questions.filter(q => q.service_id !== services[index].id));
  };

  const updateService = (index, field, value) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  // Questions handlers
  const addQuestion = () => {
    if (!newQuestion.service_id || !newQuestion.question) return;
    setQuestions([...questions, {
      question: newQuestion.question,
      question_type: newQuestion.type,
      service_id: newQuestion.service_id,
      options: newQuestion.options
    }]);
    setNewQuestion({ service_id: "", question: "", type: "text", options: [] });
    setNewOption("");
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const addQuestionOption = () => {
    if (!newOption || !newQuestion.service_id) return;
    setNewQuestion({
      ...newQuestion,
      options: [...(newQuestion.options || []), { option_text: newOption }]
    });
    setNewOption("");
  };

  const removeQuestionOption = (optIndex) => {
    setNewQuestion({
      ...newQuestion,
      options: newQuestion.options.filter((_, i) => i !== optIndex)
    });
  };

  if (loading) {
    return <div style={{ color: "#6060a0" }}>Loading settings...</div>;
  }

  return (
    <div>
      {error && (
        <div style={{ 
          background: "#e05050", 
          color: "#fff", 
          padding: "12px 16px", 
          borderRadius: 8, 
          marginBottom: 16, 
          fontSize: 13 
        }}>
          ❌ {error}
        </div>
      )}

      {/* Commands Section */}
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#60a5fa" }}>📝</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Commands</span>
        </div>
        <div style={{ padding: "20px" }}>
          <p style={{ fontSize: 12, color: "#6060a0", marginBottom: 12 }}>
            Telegram bots need start commands. It's the gateway to your bot's world.
          </p>
          {commands.map((c, i) => (
            <div key={i} style={{ background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, padding: "10px 16px", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ color: "#60a5fa", fontWeight: 700, fontSize: 13 }}>{c.command}</span>
                <div style={{ fontSize: 12, color: "#6060a0" }}>{c.description}</div>
              </div>
              <button onClick={() => removeCommand(i)} style={{ ...S.btnOutline, fontSize: 11, padding: "3px 10px" }}>✕</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input type="text" style={{ ...S.input, flex: 1 }} placeholder="/command" value={newCmd.cmd} onChange={e => setNewCmd({ ...newCmd, cmd: e.target.value })} />
            <input type="text" style={{ ...S.input, flex: 2 }} placeholder="Description" value={newCmd.desc} onChange={e => setNewCmd({ ...newCmd, desc: e.target.value })} />
            <button onClick={addCommand} style={S.btn()}>+ Add</button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#60a5fa" }}>🎯</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Services / Buttons</span>
        </div>
        <div style={{ padding: "20px" }}>
          <p style={{ fontSize: 12, color: "#6060a0", marginBottom: 12 }}>
            Add the services your bot offers as clickable buttons for customers.
          </p>
          {services.map((s, i) => (
            <div key={`service-${s.id || i}`} style={{ background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, padding: "12px 16px", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input 
                  type="text"
                  style={{ ...S.input, width: 50, fontSize: 16, textAlign: "center" }} 
                  value={s.emoji || "⭐"} 
                  onChange={e => updateService(i, "emoji", e.target.value)}
                  maxLength="2"
                  placeholder="🍕"
                />
                <input 
                  type="text"
                  style={{ ...S.input, flex: 1 }} 
                  value={s.name} 
                  onChange={e => updateService(i, "name", e.target.value)}
                  placeholder="Service name"
                />
                <button onClick={() => removeService(i)} style={{ ...S.btnOutline, fontSize: 11, padding: "4px 10px", whiteSpace: "nowrap" }}>Edit ✕</button>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input 
              style={{ ...S.input, width: 60, fontSize: 16, textAlign: "center" }} 
              placeholder="🍕" 
              value={newService.emoji} 
              onChange={e => setNewService({ ...newService, emoji: e.target.value })}
              maxLength="2"
            />
            <input 
              style={{ ...S.input, flex: 1 }} 
              placeholder="Service name (e.g., Food Delivery)" 
              value={newService.name} 
              onChange={e => setNewService({ ...newService, name: e.target.value })}
            />
            <button onClick={addService} style={S.btn()}>+ Add</button>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#60a5fa" }}>❓</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Questions</span>
        </div>
        <div style={{ padding: "20px" }}>
          <p style={{ fontSize: 12, color: "#6060a0", marginBottom: 12 }}>
            Gather information from your customers with custom questions.
          </p>

          {/* Existing Questions */}
          {questions.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#6060a0", marginBottom: 8, fontWeight: 600 }}>Existing Questions</div>
              {questions.map((q, i) => {
                const serviceName = services.find(s => s.id === q.service_id)?.name || "Unknown";
                return (
                  <div key={i} style={{ background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, padding: "12px 16px", marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: "#60a5fa", marginBottom: 4 }}>📌 {serviceName}</div>
                        <div style={{ fontSize: 13, color: "#e2e2f0", marginBottom: 6, fontWeight: 600 }}>{q.question}</div>
                        <div style={{ fontSize: 11, color: "#6060a0" }}>
                          Type: <span style={{ color: "#a0a0c0" }}>{q.question_type}</span>
                        </div>
                        {q.options && q.options.length > 0 && (
                          <div style={{ fontSize: 11, color: "#6060a0", marginTop: 4 }}>
                            Options: {q.options.map(o => o.option_text || o).join(", ")}
                          </div>
                        )}
                      </div>
                      <button onClick={() => removeQuestion(i)} style={{ ...S.btnOutline, fontSize: 11, padding: "4px 10px", whiteSpace: "nowrap" }}>Edit ✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add New Question */}
          <div style={{ background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, padding: "16px", marginTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "#e2e2f0" }}>Add New Question</div>

            {/* Service Selection */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 4 }}>Service</label>
              <select 
                value={newQuestion.service_id} 
                onChange={e => setNewQuestion({ ...newQuestion, service_id: e.target.value })}
                style={{ ...S.input, background: "#16161f" }}
              >
                <option value="">Select a service...</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
                ))}
              </select>
            </div>

            {/* Question Text */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 4 }}>Question</label>
              <input 
                style={S.input} 
                placeholder="e.g., What is your delivery address?" 
                value={newQuestion.question}
                onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })}
              />
            </div>

            {/* Question Type */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 4 }}>Response Type</label>
              <select 
                value={newQuestion.type} 
                onChange={e => setNewQuestion({ ...newQuestion, type: e.target.value })}
                style={{ ...S.input, background: "#16161f" }}
              >
                <option value="text">📝 Free Text</option>
                <option value="number">🔢 Number Only</option>
                <option value="photo">📷 Photo Upload</option>
                <option value="inline_preset_buttons">🔘 Button Options</option>
              </select>
            </div>

            {/* Button Options (if type is buttons) */}
            {newQuestion.type === "inline_preset_buttons" && (
              <div style={{ marginBottom: 12, background: "#0d0d12", border: "1px solid #2a2a3e", borderRadius: 8, padding: 12 }}>
                <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 8 }}>Button Options</label>
                {newQuestion.options && newQuestion.options.map((opt, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    <input 
                      disabled 
                      value={opt.option_text || opt} 
                      style={{ ...S.input, flex: 1, opacity: 0.7 }}
                    />
                    <button 
                      onClick={() => removeQuestionOption(idx)} 
                      style={{ ...S.btnOutline, fontSize: 11, padding: "6px 10px" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 6 }}>
                  <input 
                    style={S.input} 
                    placeholder="e.g., Delivery" 
                    value={newOption}
                    onChange={e => setNewOption(e.target.value)}
                  />
                  <button onClick={addQuestionOption} style={{ ...S.btn(), fontSize: 12 }}>+ Add Option</button>
                </div>
              </div>
            )}

            <button 
              onClick={addQuestion} 
              style={{ ...S.btn(), fontSize: 12 }}
              disabled={!newQuestion.service_id || !newQuestion.question}
            >
              + Add Question
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: "flex", gap: 8 }}>
        <button 
          onClick={saveSettings} 
          disabled={saving}
          style={{ ...S.btn("#34d398"), fontSize: 13, padding: "10px 20px" }}
        >
          {saving ? "💾 Saving..." : "✅ Save All Settings"}
        </button>
        <button 
          onClick={loadSettings} 
          style={{ ...S.btnOutline, fontSize: 13, padding: "10px 20px" }}
        >
          ↻ Reload
        </button>
      </div>
    </div>
  );
};

export default TelegramSettingsTab;
