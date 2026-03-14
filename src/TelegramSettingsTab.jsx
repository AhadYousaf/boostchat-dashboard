import { useState, useEffect } from "react";

const TelegramSettingsTab = ({ node, api, S }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Main data from API
  const [services, setServices] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [commands, setCommands] = useState([]);

  // Modal states
  const [showCommandModal, setShowCommandModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingCommand, setEditingCommand] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  // Command form
  const [commandForm, setCommandForm] = useState({
    cmd: "",
    desc: "",
    message_content: "",
    message_image: null,
    attached_services: []
  });

  // Service form
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

  // Question form
  const [questionForm, setQuestionForm] = useState({
    question_text: "",
    message_content: "",
    message_image: null,
    question_type: "text",
    options: []
  });

  const [newOption, setNewOption] = useState("");

  // Load settings on mount
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
      const payload = {
        commands: commands.map(c => ({
          cmd: c.cmd || c.command || "",
          desc: c.desc || c.description || "",
          message_content: c.message_content || "",
          message_image: c.message_image || null,
          attached_services: Array.isArray(c.attached_services) ? c.attached_services : []
        })),
        services: services.map(s => ({
          id: s.id,
          name: s.name || "",
          description: s.description || "",
          open_message_content: s.open_message_content || "",
          closed_message_content: s.closed_message_content || "",
          queue_full_message_content: s.queue_full_message_content || "",
          queue_break_message_content: s.queue_break_message_content || "",
          show_button_new_row: s.show_button_new_row || false,
          webapp_mode: s.webapp_mode || false,
          attached_questions: (s.attached_questions || []).map(qIdOrName => {
            const q = questions.find(qu => qu.id === qIdOrName || qu.question === qIdOrName);
            return q ? q.question : qIdOrName;
          })
        })),
        questions: questions.map(q => ({
          id: q.id,
          question: q.question || q.question_text || "",
          message_content: q.message_content || "",
          question_type: q.question_type || "text",
          options: Array.isArray(q.options) ? q.options : []
        }))
      };
      
      const response = await api(`/nodes/${node.id}/settings`, {
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

  // File upload handler
  const handleFileUpload = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
      setFileInputKey(prev => prev + 1);
    };
    reader.readAsDataURL(file);
  };

  // =============== COMMANDS ===============

  const openCommandModal = (cmd = null) => {
    if (cmd) {
      setEditingCommand(cmd.id || cmd.command);
      setCommandForm({
        cmd: cmd.cmd || cmd.command || "",
        desc: cmd.desc || cmd.description || "",
        message_content: cmd.message_content || "",
        message_image: cmd.message_image || null,
        attached_services: cmd.attached_services || []
      });
    } else {
      setEditingCommand(null);
      setCommandForm({
        cmd: "",
        desc: "",
        message_content: "",
        message_image: null,
        attached_services: []
      });
    }
    setShowCommandModal(true);
  };

  const saveCommand = () => {
    if (!commandForm.cmd) {
      alert("Command name required");
      return;
    }

    if (editingCommand) {
      const idx = commands.findIndex(c => (c.id || c.command) === editingCommand);
      const updated = [...commands];
      updated[idx] = { ...updated[idx], ...commandForm };
      setCommands(updated);
    } else {
      setCommands([...commands, { id: Date.now(), ...commandForm }]);
    }
    setShowCommandModal(false);
  };

  const deleteCommand = (id) => {
    if (confirm("Delete this command?")) {
      setCommands(commands.filter(c => (c.id || c.command) !== id));
    }
  };

  const toggleServiceAttachment = (serviceName) => {
    const attached = commandForm.attached_services || [];
    if (attached.includes(serviceName)) {
      setCommandForm({ ...commandForm, attached_services: attached.filter(s => s !== serviceName) });
    } else {
      setCommandForm({ ...commandForm, attached_services: [...attached, serviceName] });
    }
  };

  // =============== SERVICES ===============

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
      setCommands(commands.map(c => ({
        ...c,
        attached_services: (c.attached_services || []).filter(sName => {
          const service = services.find(s => s.id === id);
          return sName !== service?.name;
        })
      })));
    }
  };

  const reorderQuestions = (fromIdx, toIdx) => {
    const newOrder = [...(serviceForm.attached_questions || [])];
    [newOrder[fromIdx], newOrder[toIdx]] = [newOrder[toIdx], newOrder[fromIdx]];
    setServiceForm({ ...serviceForm, attached_questions: newOrder });
  };

  const addQuestionToService = (questionName) => {
    if (!(serviceForm.attached_questions || []).includes(questionName)) {
      setServiceForm({ ...serviceForm, attached_questions: [...(serviceForm.attached_questions || []), questionName] });
    }
  };

  const removeQuestionFromService = (questionName) => {
    setServiceForm({ ...serviceForm, attached_questions: (serviceForm.attached_questions || []).filter(q => q !== questionName) });
  };

  // =============== QUESTIONS ===============

  const openQuestionModal = (question = null) => {
    if (question) {
      setEditingQuestion(question.id);
      setQuestionForm({
        question_text: question.question || "",
        message_content: question.message_content || "",
        message_image: question.message_image || null,
        question_type: question.question_type || "text",
        options: question.options || []
      });
    } else {
      setEditingQuestion(null);
      setQuestionForm({
        question_text: "",
        message_content: "",
        message_image: null,
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
      updated[idx] = { 
        ...updated[idx], 
        question: questionForm.question_text, 
        message_content: questionForm.message_content,
        message_image: questionForm.message_image,
        question_type: questionForm.question_type, 
        options: questionForm.options 
      };
      setQuestions(updated);
    } else {
      setQuestions([...questions, { 
        id: Date.now(), 
        question: questionForm.question_text,
        message_content: questionForm.message_content,
        message_image: questionForm.message_image,
        question_type: questionForm.question_type, 
        options: questionForm.options 
      }]);
    }
    setShowQuestionModal(false);
  };

  const deleteQuestion = (id) => {
    if (confirm("Delete this question?")) {
      const questionToDelete = questions.find(q => q.id === id);
      setQuestions(questions.filter(q => q.id !== id));
      setServices(services.map(s => ({
        ...s,
        attached_questions: (s.attached_questions || []).filter(qName => qName !== questionToDelete?.question)
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

      {/* COMMANDS SECTION */}
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#60a5fa" }}>📝</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Commands</span>
        </div>
        <div style={{ padding: "20px" }}>
          {commands.map((c, i) => (
            <div key={i} style={{ background: "#1a1a28", border: "1px solid #2a2a3e", borderRadius: 8, padding: "10px 16px", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ color: "#60a5fa", fontWeight: 700, fontSize: 13 }}>{c.cmd || c.command}</span>
                <div style={{ fontSize: 12, color: "#6060a0" }}>{c.desc || c.description}</div>
                {(c.attached_services || []).length > 0 && (
                  <div style={{ fontSize: 11, color: "#60a5fa", marginTop: 4 }}>
                    {c.attached_services.length} service(s) attached
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => openCommandModal(c)} style={{ ...S.btnOutline, fontSize: 11, padding: "4px 10px" }}>Edit</button>
                <button onClick={() => deleteCommand(c.id || c.command)} style={{ ...S.btnOutline, fontSize: 11, padding: "4px 10px", color: "#e05050" }}>✕</button>
              </div>
            </div>
          ))}
          <button onClick={() => openCommandModal()} style={{ ...S.btn("#34d398"), fontSize: 12, marginTop: 12 }}>+ Add Command</button>
        </div>
      </div>

      {/* SERVICES SECTION */}
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

      {/* QUESTIONS SECTION */}
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

      {/* SAVE BUTTONS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
        <button onClick={saveSettings} disabled={saving} style={{ ...S.btn("#34d398"), fontSize: 13, padding: "10px 20px" }}>
          {saving ? "💾 Saving..." : "✅ Save All Settings"}
        </button>
        <button onClick={loadSettings} style={{ ...S.btnOutline, fontSize: 13, padding: "10px 20px" }}>
          ↻ Reload
        </button>
      </div>

      {/* Command Modal */}
      {showCommandModal && <CommandModal 
        editingCommand={editingCommand} 
        commandForm={commandForm} 
        setCommandForm={setCommandForm}
        services={services}
        toggleServiceAttachment={toggleServiceAttachment}
        saveCommand={saveCommand}
        setShowCommandModal={setShowCommandModal}
        handleFileUpload={handleFileUpload}
        fileInputKey={fileInputKey}
        S={S}
      />}

      {/* Service Modal */}
      {showServiceModal && <ServiceModal 
        editingService={editingService}
        serviceForm={serviceForm}
        setServiceForm={setServiceForm}
        questions={questions}
        reorderQuestions={reorderQuestions}
        addQuestionToService={addQuestionToService}
        removeQuestionFromService={removeQuestionFromService}
        saveService={saveService}
        setShowServiceModal={setShowServiceModal}
        S={S}
      />}

      {/* Question Modal */}
      {showQuestionModal && <QuestionModal
        editingQuestion={editingQuestion}
        questionForm={questionForm}
        setQuestionForm={setQuestionForm}
        newOption={newOption}
        setNewOption={setNewOption}
        addQuestionOption={addQuestionOption}
        removeQuestionOption={removeQuestionOption}
        saveQuestion={saveQuestion}
        setShowQuestionModal={setShowQuestionModal}
        handleFileUpload={handleFileUpload}
        fileInputKey={fileInputKey}
        S={S}
      />}
    </div>
  );
};

// =============== MODALS ===============

const CommandModal = ({ editingCommand, commandForm, setCommandForm, services, toggleServiceAttachment, saveCommand, setShowCommandModal, handleFileUpload, fileInputKey, S }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, overflowY: "auto" }}>
    <div style={{ ...S.card, width: "90%", maxWidth: 650, maxHeight: "90vh", overflowY: "auto", padding: 0, margin: "20px auto" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#16161f", zIndex: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
          {editingCommand ? "Edit Command" : "Add New Command"}
        </h3>
        <button onClick={() => setShowCommandModal(false)} style={{ background: "none", border: "none", color: "#6060a0", cursor: "pointer", fontSize: 20 }}>✕</button>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Command name</label>
          <input type="text" style={S.input} value={commandForm.cmd} onChange={e => setCommandForm({ ...commandForm, cmd: e.target.value })} placeholder="/start" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Description</label>
          <input type="text" style={S.input} value={commandForm.desc} onChange={e => setCommandForm({ ...commandForm, desc: e.target.value })} placeholder="Internal description" />
        </div>

        <div style={{ marginBottom: 20, background: "#0d0d12", border: "1px solid #2a2a3e", borderRadius: 8, padding: 16 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 8, fontWeight: 700 }}>Message related</label>
          <p style={{ fontSize: 11, color: "#6060a0", marginBottom: 12 }}>The message and image that will be sent when this command is used.</p>
          
          <label style={{ fontSize: 11, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>Message content</label>
          <textarea style={{ ...S.input, minHeight: 100 }} value={commandForm.message_content} onChange={e => setCommandForm({ ...commandForm, message_content: e.target.value })} placeholder="Welcome message..." />
          
          <label style={{ fontSize: 11, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600, marginTop: 12 }}>Message image</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input 
              key={fileInputKey}
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files[0]) {
                  handleFileUpload(e.target.files[0], (base64) => {
                    setCommandForm({ ...commandForm, message_image: base64 });
                  });
                }
              }}
              style={{ display: "none" }}
              id="cmd-file-input"
            />
            <button 
              onClick={() => document.getElementById("cmd-file-input").click()}
              style={{ ...S.btnOutline, flex: 1, padding: "8px 12px", fontSize: 12 }}
            >
              Choose File - {commandForm.message_image ? "✓ Image selected" : "No file chosen"}
            </button>
            {commandForm.message_image && (
              <button 
                onClick={() => setCommandForm({ ...commandForm, message_image: null })}
                style={{ ...S.btnOutline, padding: "8px 12px", fontSize: 12, color: "#e05050" }}
              >
                Remove
              </button>
            )}
          </div>
          {commandForm.message_image && (
            <div style={{ marginTop: 12, borderRadius: 8, overflow: "hidden", maxHeight: 150 }}>
              <img src={commandForm.message_image} alt="Preview" style={{ width: "100%", height: "auto", maxHeight: 150, objectFit: "cover" }} />
            </div>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 8, fontWeight: 700 }}>Services/Buttons</label>
          <p style={{ fontSize: 11, color: "#6060a0", marginBottom: 12 }}>Select which services to display when this command is used.</p>
          <div style={{ background: "#0d0d12", border: "1px solid #2a2a3e", borderRadius: 8, padding: 12, maxHeight: 200, overflowY: "auto" }}>
            {services.length === 0 ? (
              <div style={{ color: "#6060a0", fontSize: 12 }}>No services created yet</div>
            ) : (
              services.map(s => (
                <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", cursor: "pointer", borderBottom: "1px solid #1e1e2e", fontSize: 12 }}>
                  <input type="checkbox" checked={(commandForm.attached_services || []).includes(s.name)} onChange={() => toggleServiceAttachment(s.name)} />
                  <span style={{ color: "#e2e2f0" }}>{s.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={saveCommand} style={{ ...S.btn("#34d398"), flex: 1 }}>
            {editingCommand ? "✏️ Update Command" : "➕ Add Command"}
          </button>
          <button onClick={() => setShowCommandModal(false)} style={{ ...S.btnOutline, flex: 1 }}>Close</button>
        </div>
      </div>
    </div>
  </div>
);

const ServiceModal = ({ editingService, serviceForm, setServiceForm, questions, reorderQuestions, addQuestionToService, removeQuestionFromService, saveService, setShowServiceModal, S }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, overflowY: "auto" }}>
    <div style={{ ...S.card, width: "90%", maxWidth: 650, maxHeight: "90vh", overflowY: "auto", padding: 0, margin: "20px auto" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#16161f", zIndex: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
          {editingService ? "Edit Service" : "Add New Service"}
        </h3>
        <button onClick={() => setShowServiceModal(false)} style={{ background: "none", border: "none", color: "#6060a0", cursor: "pointer", fontSize: 20 }}>✕</button>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Service name</label>
          <input type="text" style={S.input} value={serviceForm.name} onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })} placeholder="e.g., 🍕 Uber Eats" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Description</label>
          <input type="text" style={S.input} value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} placeholder="Internal description" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Open Message (shown when service picked)</label>
          <textarea style={{ ...S.input, minHeight: 100 }} value={serviceForm.open_message_content} onChange={e => setServiceForm({ ...serviceForm, open_message_content: e.target.value })} placeholder="Welcome message..." />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Closed Message</label>
          <textarea style={{ ...S.input, minHeight: 80 }} value={serviceForm.closed_message_content} onChange={e => setServiceForm({ ...serviceForm, closed_message_content: e.target.value })} placeholder="Optional: message when service is closed" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Queue Full Message</label>
          <textarea style={{ ...S.input, minHeight: 80 }} value={serviceForm.queue_full_message_content} onChange={e => setServiceForm({ ...serviceForm, queue_full_message_content: e.target.value })} placeholder="Message when queue is full" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Queue Break Message</label>
          <textarea style={{ ...S.input, minHeight: 80 }} value={serviceForm.queue_break_message_content} onChange={e => setServiceForm({ ...serviceForm, queue_break_message_content: e.target.value })} placeholder="Message when service on break" />
        </div>

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

        {/* QUESTIONS - DRAG TO REORDER */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 8, fontWeight: 700 }}>Questions (in order)</label>
          <p style={{ fontSize: 11, color: "#6060a0", marginBottom: 8 }}>Drag to reorder. Click X to remove.</p>
          
          {/* Attached Questions List */}
          <div style={{ background: "#0d0d12", border: "1px solid #2a2a3e", borderRadius: 8, padding: 12, marginBottom: 12, minHeight: 60 }}>
            {(serviceForm.attached_questions || []).length === 0 ? (
              <div style={{ color: "#6060a0", fontSize: 12, padding: "20px", textAlign: "center" }}>No questions attached yet. Add from below.</div>
            ) : (
              (serviceForm.attached_questions || []).map((qName, idx) => {
                const q = questions.find(qu => qu.question === qName);
                if (!q) return null;
                return (
                  <div key={qName} draggable onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', idx); }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
                    e.preventDefault();
                    const draggedIdx = parseInt(e.dataTransfer.getData('text/plain'));
                    if (draggedIdx !== idx) {
                      reorderQuestions(draggedIdx, idx);
                    }
                  }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px", background: "#16161f", borderRadius: 6, marginBottom: 6, cursor: "move", border: "1px solid #2a2a3e", fontSize: 12 }}>
                    <span style={{ color: "#60a5fa", userSelect: "none" }}>⋮⋮</span>
                    <span style={{ color: "#e2e2f0", flex: 1 }}>{idx + 1}. {q.question}</span>
                    <span style={{ fontSize: 10, color: "#6060a0" }}>{q.question_type}</span>
                    <button onClick={() => removeQuestionFromService(qName)} style={{ background: "none", border: "none", color: "#e05050", cursor: "pointer", fontSize: 14 }}>✕</button>
                  </div>
                );
              })
            )}
          </div>

          {/* Available Questions to Add */}
          <label style={{ fontSize: 11, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>Available questions:</label>
          <div style={{ background: "#0d0d12", border: "1px solid #2a2a3e", borderRadius: 8, padding: 12, maxHeight: 150, overflowY: "auto" }}>
            {questions.length === 0 ? (
              <div style={{ color: "#6060a0", fontSize: 12 }}>No questions created yet</div>
            ) : (
              questions.map(q => (
                <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #1e1e2e", fontSize: 12 }}>
                  <button onClick={() => addQuestionToService(q.question)} style={{ background: "none", border: "none", color: "#34d398", cursor: "pointer", fontSize: 14, padding: 0 }}>+</button>
                  <span style={{ color: "#e2e2f0", flex: 1 }}>{q.question}</span>
                  <span style={{ fontSize: 10, color: "#6060a0" }}>{q.question_type}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={saveService} style={{ ...S.btn("#34d398"), flex: 1 }}>
            {editingService ? "✏️ Update Service" : "➕ Add Service"}
          </button>
          <button onClick={() => setShowServiceModal(false)} style={{ ...S.btnOutline, flex: 1 }}>Close</button>
        </div>
      </div>
    </div>
  </div>
);

const QuestionModal = ({ editingQuestion, questionForm, setQuestionForm, newOption, setNewOption, addQuestionOption, removeQuestionOption, saveQuestion, setShowQuestionModal, handleFileUpload, fileInputKey, S }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, overflowY: "auto" }}>
    <div style={{ ...S.card, width: "90%", maxWidth: 650, maxHeight: "90vh", overflowY: "auto", padding: 0, margin: "20px auto" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#16161f", zIndex: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
          {editingQuestion ? "Edit Question" : "Add New Question"}
        </h3>
        <button onClick={() => setShowQuestionModal(false)} style={{ background: "none", border: "none", color: "#6060a0", cursor: "pointer", fontSize: 20 }}>✕</button>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Question Text (internal name)</label>
          <textarea style={{ ...S.input, minHeight: 80 }} value={questionForm.question_text} onChange={e => setQuestionForm({ ...questionForm, question_text: e.target.value })} placeholder="e.g., Ordername" />
        </div>

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

        <div style={{ marginBottom: 20, background: "#0d0d12", border: "1px solid #2a2a3e", borderRadius: 8, padding: 16 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 8, fontWeight: 700 }}>Message related</label>
          <p style={{ fontSize: 11, color: "#6060a0", marginBottom: 12 }}>This is the actual question text shown to the customer.</p>
          
          <label style={{ fontSize: 11, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>Message content</label>
          <textarea style={{ ...S.input, minHeight: 100 }} value={questionForm.message_content} onChange={e => setQuestionForm({ ...questionForm, message_content: e.target.value })} placeholder="e.g., What name would you like on the order?" />
          
          <label style={{ fontSize: 11, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600, marginTop: 12 }}>Message image</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files[0]) {
                  handleFileUpload(e.target.files[0], (base64) => {
                    setQuestionForm({ ...questionForm, message_image: base64 });
                  });
                }
              }}
              style={{ display: "none" }}
              id="q-file-input"
            />
            <button 
              onClick={() => document.getElementById("q-file-input").click()}
              style={{ ...S.btnOutline, flex: 1, padding: "8px 12px", fontSize: 12 }}
            >
              Choose File - {questionForm.message_image ? "✓ Image selected" : "No file chosen"}
            </button>
            {questionForm.message_image && (
              <button 
                onClick={() => setQuestionForm({ ...questionForm, message_image: null })}
                style={{ ...S.btnOutline, padding: "8px 12px", fontSize: 12, color: "#e05050" }}
              >
                Remove
              </button>
            )}
          </div>
          {questionForm.message_image && (
            <div style={{ marginTop: 12, borderRadius: 8, overflow: "hidden", maxHeight: 150 }}>
              <img src={questionForm.message_image} alt="Preview" style={{ width: "100%", height: "auto", maxHeight: 150, objectFit: "cover" }} />
            </div>
          )}
        </div>

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

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={saveQuestion} style={{ ...S.btn("#34d398"), flex: 1 }}>
            {editingQuestion ? "✏️ Update Question" : "➕ Add Question"}
          </button>
          <button onClick={() => setShowQuestionModal(false)} style={{ ...S.btnOutline, flex: 1 }}>Close</button>
        </div>
      </div>
    </div>
  </div>
);

export default TelegramSettingsTab;