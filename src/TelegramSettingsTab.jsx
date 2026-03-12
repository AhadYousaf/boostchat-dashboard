import { useState, useEffect } from "react";

const TelegramSettingsTab = ({ node, api, S }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Main data
  const [services, setServices] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [commands, setCommands] = useState([]);

  // Modals
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newCmd, setNewCmd] = useState({ cmd: "", desc: "" });

  // Form state
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    open_message_content: "",
    closed_message_content: "",
    queue_full_message_content: "",
    queue_break_message_content: "",
    show_button_new_row: false,
    webapp_mode: false,
    attached_questions: []
  });

  const [questionForm, setQuestionForm] = useState({
    question_text: "",
    message_content: "",
    question_type: "text",
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
          commands: commands.map(c => ({ cmd: c.command, desc: c.description })),
          services: services.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description,
            open_message_content: s.open_message_content,
            closed_message_content: s.closed_message_content,
            queue_full_message_content: s.queue_full_message_content,
            queue_break_message_content: s.queue_break_message_content,
            show_button_new_row: s.show_button_new_row,
            webapp_mode: s.webapp_mode,
            attached_questions: s.attached_questions || []
          })),
          questions: questions.map(q => ({
            id: q.id,
            question_text: q.question,
            question_type: q.question_type,
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

  // Commands
  const addCommand = () => {
    if (!newCmd.cmd || !newCmd.desc) return;
    setCommands([...commands, { command: newCmd.cmd, description: newCmd.desc }]);
    setNewCmd({ cmd: "", desc: "" });
  };

  const removeCommand = (index) => {
    setCommands(commands.filter((_, i) => i !== index));
  };

  // Services
  const openServiceModal = (service = null) => {
    if (service) {
      setEditingService(service.id);
      setServiceForm({
        name: service.name || "",
        description: service.description || "",
        open_message_content: service.open_message_content || "",
        closed_message_content: service.closed_message_content || "",
        queue_full_message_content: service.queue_full_message_content || "",
        queue_break_message_content: service.queue_break_message_content || "",
        show_button_new_row: service.show_button_new_row || false,
        webapp_mode: service.webapp_mode || false,
        attached_questions: service.attached_questions || []
      });
    } else {
      setEditingService(null);
      setServiceForm({
        name: "",
        description: "",
        open_message_content: "",
        closed_message_content: "",
        queue_full_message_content: "",
        queue_break_message_content: "",
        show_button_new_row: false,
        webapp_mode: false,
        attached_questions: []
      });
    }
    setShowServiceModal(true);
  };

  const saveService = () => {
    if (!serviceForm.name) {
      alert("Service name required");
      return;
    }

    if (editingService) {
      const idx = services.findIndex(s => s.id === editingService);
      const updated = [...services];
      updated[idx] = { ...updated[idx], ...serviceForm };
      setServices(updated);
    } else {
      setServices([...services, { id: Date.now(), ...serviceForm }]);
    }
    setShowServiceModal(false);
  };

  const deleteService = (id) => {
    if (confirm("Delete this service?")) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const toggleQuestionAttachment = (questionId) => {
    const attached = serviceForm.attached_questions || [];
    if (attached.includes(questionId)) {
      setServiceForm({ ...serviceForm, attached_questions: attached.filter(q => q !== questionId) });
    } else {
      setServiceForm({ ...serviceForm, attached_questions: [...attached, questionId] });
    }
  };

  // Questions
  const openQuestionModal = (question = null) => {
    if (question) {
      setEditingQuestion(question.id);
      setQuestionForm({
        question_text: question.question || "",
        message_content: question.message_content || "",
        question_type: question.question_type || "text",
        options: question.options || []
      });
    } else {
      setEditingQuestion(null);
      setQuestionForm({
        question_text: "",
        message_content: "",
        question_type: "text",
        options: []
      });
    }
    setShowQuestionModal(true);
  };

  const saveQuestion = () => {
    if (!questionForm.question_text) {
      alert("Question text required");
      return;
    }

    if (editingQuestion) {
      const idx = questions.findIndex(q => q.id === editingQuestion);
      const updated = [...questions];
      updated[idx] = { ...updated[idx], question: questionForm.question_text, message_content: questionForm.message_content, question_type: questionForm.question_type, options: questionForm.options };
      setQuestions(updated);
    } else {
      setQuestions([...questions, { id: Date.now(), question: questionForm.question_text, message_content: questionForm.message_content, question_type: questionForm.question_type, options: questionForm.options }]);
    }
    setShowQuestionModal(false);
  };

  const deleteQuestion = (id) => {
    if (confirm("Delete this question?")) {
      setQuestions(questions.filter(q => q.id !== id));
      // Remove from all services
      setServices(services.map(s => ({
        ...s,
        attached_questions: (s.attached_questions || []).filter(qId => qId !== id)
      })));
    }
  };

  const addQuestionOption = () => {
    if (!newOption) return;
    setQuestionForm({
      ...questionForm,
      options: [...(questionForm.options || []), { option_text: newOption }]
    });
    setNewOption("");
  };

  const removeQuestionOption = (idx) => {
    setQuestionForm({
      ...questionForm,
      options: questionForm.options.filter((_, i) => i !== idx)
    });
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

      {/* Commands */}
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#60a5fa" }}>📝</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Commands</span>
        </div>
        <div style={{ padding: "20px" }}>
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

      {/* Services */}
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#60a5fa" }}>🎯</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Services / Buttons</span>
        </div>
        <div style={{ padding: "20px" }}>
          {services.map(s => (
            <div key={s.id} style={{ background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, color: "#e2e2f0", fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "#6060a0" }}>{s.description || "No description"}</div>
                {(s.attached_questions || []).length > 0 && (
                  <div style={{ fontSize: 11, color: "#60a5fa", marginTop: 4 }}>
                    {s.attached_questions.length} question(s) attached
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => openServiceModal(s)} style={{ ...S.btnOutline, fontSize: 11, padding: "4px 10px" }}>Edit</button>
                <button onClick={() => deleteService(s.id)} style={{ ...S.btnOutline, fontSize: 11, padding: "4px 10px", color: "#e05050" }}>✕</button>
              </div>
            </div>
          ))}
          <button onClick={() => openServiceModal()} style={{ ...S.btn("#34d398"), fontSize: 12, marginTop: 12 }}>+ Add Service</button>
        </div>
      </div>

      {/* Questions */}
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#60a5fa" }}>❓</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Questions</span>
        </div>
        <div style={{ padding: "20px" }}>
          {questions.map(q => (
            <div key={q.id} style={{ background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#e2e2f0", fontWeight: 600 }}>{q.question}</div>
                <div style={{ fontSize: 11, color: "#6060a0", marginTop: 4 }}>Type: {q.question_type}</div>
                {q.options && q.options.length > 0 && (
                  <div style={{ fontSize: 11, color: "#60a5fa", marginTop: 4 }}>
                    Options: {q.options.map(o => o.option_text || o).join(", ")}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => openQuestionModal(q)} style={{ ...S.btnOutline, fontSize: 11, padding: "4px 10px" }}>Edit</button>
                <button onClick={() => deleteQuestion(q.id)} style={{ ...S.btnOutline, fontSize: 11, padding: "4px 10px", color: "#e05050" }}>✕</button>
              </div>
            </div>
          ))}
          <button onClick={() => openQuestionModal()} style={{ ...S.btn("#34d398"), fontSize: 12, marginTop: 12 }}>+ Add Question</button>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={saveSettings} disabled={saving} style={{ ...S.btn("#34d398"), fontSize: 13, padding: "10px 20px" }}>
          {saving ? "💾 Saving..." : "✅ Save All Settings"}
        </button>
        <button onClick={loadSettings} style={{ ...S.btnOutline, fontSize: 13, padding: "10px 20px" }}>
          ↻ Reload
        </button>
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ ...S.card, width: "90%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", padding: 0 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                {editingService ? "Edit Service" : "Add New Service"}
              </h3>
              <button onClick={() => setShowServiceModal(false)} style={{ background: "none", border: "none", color: "#6060a0", cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>

            <div style={{ padding: "20px" }}>
              {/* Basic Info */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Service Name</label>
                <input type="text" style={S.input} value={serviceForm.name} onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })} placeholder="e.g., 🍕 Uber Eats" />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Description</label>
                <input type="text" style={S.input} value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} placeholder="Internal description" />
              </div>

              {/* Open Message */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Open Message (shown when service picked)</label>
                <textarea style={{ ...S.input, minHeight: 100 }} value={serviceForm.open_message_content} onChange={e => setServiceForm({ ...serviceForm, open_message_content: e.target.value })} placeholder="Welcome message..." />
              </div>

              {/* Closed Message */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Closed Message</label>
                <textarea style={{ ...S.input, minHeight: 80 }} value={serviceForm.closed_message_content} onChange={e => setServiceForm({ ...serviceForm, closed_message_content: e.target.value })} placeholder="Optional: message when service is closed" />
              </div>

              {/* Queue Messages */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Queue Full Message</label>
                <textarea style={{ ...S.input, minHeight: 80 }} value={serviceForm.queue_full_message_content} onChange={e => setServiceForm({ ...serviceForm, queue_full_message_content: e.target.value })} placeholder="Message when queue is full" />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Queue Break Message</label>
                <textarea style={{ ...S.input, minHeight: 80 }} value={serviceForm.queue_break_message_content} onChange={e => setServiceForm({ ...serviceForm, queue_break_message_content: e.target.value })} placeholder="Message when service on break" />
              </div>

              {/* Toggles */}
              <div style={{ marginBottom: 20, display: "flex", gap: 16 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                  <input type="checkbox" checked={serviceForm.show_button_new_row} onChange={e => setServiceForm({ ...serviceForm, show_button_new_row: e.target.checked })} />
                  Show button on new row
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                  <input type="checkbox" checked={serviceForm.webapp_mode} onChange={e => setServiceForm({ ...serviceForm, webapp_mode: e.target.checked })} />
                  Webapp mode (experimental)
                </label>
              </div>

              {/* Attach Questions */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 8, fontWeight: 700 }}>Questions/URLs</label>
                <div style={{ background: "#0d0d12", border: "1px solid #2a2a3e", borderRadius: 8, padding: 12 }}>
                  {questions.length === 0 ? (
                    <div style={{ color: "#6060a0", fontSize: 12 }}>No questions created yet</div>
                  ) : (
                    questions.map(q => (
                      <label key={q.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", cursor: "pointer", borderBottom: "1px solid #1e1e2e", fontSize: 12 }}>
                        <input type="checkbox" checked={(serviceForm.attached_questions || []).includes(q.id)} onChange={() => toggleQuestionAttachment(q.id)} />
                        <span style={{ color: "#e2e2f0" }}>{q.question}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={saveService} style={{ ...S.btn("#34d398"), flex: 1 }}>
                  {editingService ? "✏️ Update Service" : "➕ Add Service"}
                </button>
                <button onClick={() => setShowServiceModal(false)} style={{ ...S.btnOutline, flex: 1 }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {showQuestionModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ ...S.card, width: "90%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", padding: 0 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </h3>
              <button onClick={() => setShowQuestionModal(false)} style={{ background: "none", border: "none", color: "#6060a0", cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>

            <div style={{ padding: "20px" }}>
              {/* Question Text */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Question Text</label>
                <textarea style={{ ...S.input, minHeight: 80 }} value={questionForm.question_text} onChange={e => setQuestionForm({ ...questionForm, question_text: e.target.value })} placeholder="e.g., What's your delivery address?" />
              </div>

              {/* Question Type */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Response Type</label>
                <select value={questionForm.question_type} onChange={e => setQuestionForm({ ...questionForm, question_type: e.target.value })} style={{ ...S.input, background: "#16161f" }}>
                  <option value="text">📝 Free Text</option>
                  <option value="number">🔢 Number Only</option>
                  <option value="photo">📷 Photo Upload</option>
                  <option value="inline_preset_buttons">🔘 Button Options</option>
                  <option value="address">📍 Address (Google Maps)</option>
                </select>
              </div>

              {/* Message Related Section */}
              <div style={{ marginBottom: 20, background: "#0d0d12", border: "1px solid #2a2a3e", borderRadius: 8, padding: 16 }}>
                <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 8, fontWeight: 700 }}>Message related</label>
                <p style={{ fontSize: 11, color: "#6060a0", marginBottom: 12 }}>When the question is displayed, this is the actual question text that the user/customer will see.</p>
                
                <label style={{ fontSize: 11, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>Message content</label>
                <div style={{ display: "flex", gap: 4, padding: "8px", background: "#16161f", border: "1px solid #2a2a3e", borderRadius: 6, marginBottom: 12 }}>
                  <button style={{ padding: "4px 8px", background: "transparent", border: "none", color: "#6060a0", cursor: "pointer", fontWeight: "bold" }} title="Bold">B</button>
                  <button style={{ padding: "4px 8px", background: "transparent", border: "none", color: "#6060a0", cursor: "pointer", fontStyle: "italic" }} title="Italic">I</button>
                  <button style={{ padding: "4px 8px", background: "transparent", border: "none", color: "#6060a0", cursor: "pointer", textDecoration: "underline" }} title="Underline">U</button>
                  <button style={{ padding: "4px 8px", background: "transparent", border: "none", color: "#6060a0", cursor: "pointer" }} title="Strikethrough">S</button>
                  <button style={{ padding: "4px 8px", background: "transparent", border: "none", color: "#6060a0", cursor: "pointer" }} title="Code">&lt;/&gt;</button>
                  <button style={{ padding: "4px 8px", background: "transparent", border: "none", color: "#6060a0", cursor: "pointer" }} title="Link">🔗</button>
                </div>
                
                <textarea style={{ ...S.input, minHeight: 100 }} value={questionForm.message_content} onChange={e => setQuestionForm({ ...questionForm, message_content: e.target.value })} placeholder="e.g., What name would you like on the order?" />
                
                <label style={{ fontSize: 11, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600, marginTop: 12 }}>Message image</label>
                <button style={{ ...S.btnOutline, width: "100%", padding: "8px 12px", fontSize: 12 }}>Choose File - No file chosen</button>
              </div>

              {/* Button Options */}
              {questionForm.question_type === "inline_preset_buttons" && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 8, fontWeight: 700 }}>Button Options</label>
                  <div style={{ background: "#0d0d12", border: "1px solid #2a2a3e", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                    {questionForm.options && questionForm.options.map((opt, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                        <input type="text" disabled value={opt.option_text || opt} style={{ ...S.input, flex: 1, opacity: 0.7 }} />
                        <button onClick={() => removeQuestionOption(idx)} style={{ ...S.btnOutline, fontSize: 11, padding: "6px 10px" }}>✕</button>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 6 }}>
                      <input type="text" style={S.input} placeholder="e.g., Delivery" value={newOption} onChange={e => setNewOption(e.target.value)} />
                      <button onClick={addQuestionOption} style={{ ...S.btn(), fontSize: 12 }}>+ Add</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={saveQuestion} style={{ ...S.btn("#34d398"), flex: 1 }}>
                  {editingQuestion ? "✏️ Update Question" : "➕ Add Question"}
                </button>
                <button onClick={() => setShowQuestionModal(false)} style={{ ...S.btnOutline, flex: 1 }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelegramSettingsTab;
