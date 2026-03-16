import { useState, useEffect } from "react";
import ButtonLayoutEditor from "./ButtonLayoutEditor";

const TelegramSettingsTab = ({ node, api, S }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [services, setServices] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [commands, setCommands] = useState([]);

  const [showCommandModal, setShowCommandModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingCommand, setEditingCommand] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [commandForm, setCommandForm] = useState({
    cmd: "",
    desc: "",
    message_content: "",
    message_image: null,
    attached_services: []
  });

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
    message_image: null,
    question_type: "text",
    options: []
  });

  const [newOption, setNewOption] = useState("");

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
          attached_questions: Array.isArray(s.attached_questions) ? s.attached_questions : []
        })),
        questions: questions.map(q => ({
          id: q.id,
          question: q.question || q.question_text || "",
          message_content: q.message_content || "",
          question_type: q.question_type || "text",
          options: Array.isArray(q.options) ? q.options : []
        }))
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
      updated[idx] = { ...commandForm };
      setCommands(updated);
    } else {
      setCommands([...commands, { ...commandForm }]);
    }
    setShowCommandModal(false);
  };

  const deleteCommand = (cmd) => {
    setCommands(commands.filter(c => (c.id || c.command) !== (cmd.id || cmd.command)));
  };

  const reorderButtonLayout = (fromIdx, toIdx) => {
    const updated = [...commandForm.attached_services];
    const [removed] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, removed);
    setCommandForm({ ...commandForm, attached_services: updated });
  };

  const addButtonToLayout = (serviceName) => {
    if (!commandForm.attached_services.includes(serviceName)) {
      setCommandForm({ ...commandForm, attached_services: [...commandForm.attached_services, serviceName] });
    }
  };

  const removeButtonFromLayout = (idx) => {
    setCommandForm({ ...commandForm, attached_services: commandForm.attached_services.filter((_, i) => i !== idx) });
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
      updated[idx] = { ...serviceForm, id: editingService };
      setServices(updated);
    } else {
      setServices([...services, { ...serviceForm, id: Date.now().toString() }]);
    }
    setShowServiceModal(false);
  };

  const deleteService = (serviceId) => {
    setServices(services.filter(s => s.id !== serviceId));
  };

  const addQuestionToService = (questionId) => {
    if (!serviceForm.attached_questions.includes(questionId)) {
      setServiceForm({
        ...serviceForm,
        attached_questions: [...serviceForm.attached_questions, questionId]
      });
    }
  };

  const removeQuestionFromService = (questionId) => {
    setServiceForm({
      ...serviceForm,
      attached_questions: serviceForm.attached_questions.filter(id => id !== questionId)
    });
  };

  const reorderQuestions = (fromIdx, toIdx) => {
    const updated = [...serviceForm.attached_questions];
    const [removed] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, removed);
    setServiceForm({ ...serviceForm, attached_questions: updated });
  };

  // =============== QUESTIONS ===============

  const openQuestionModal = (q = null) => {
    if (q) {
      setEditingQuestion(q.id);
      setQuestionForm({
        question_text: q.question || q.question_text || "",
        message_content: q.message_content || "",
        message_image: q.message_image || null,
        question_type: q.question_type || "text",
        options: q.options || []
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
    setNewOption("");
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
        ...questionForm,
        id: editingQuestion,
        question: questionForm.question_text,
        options: questionForm.options || []
      };
      setQuestions(updated);
    } else {
      const newId = Date.now().toString();
      setQuestions([
        ...questions,
        {
          id: newId,
          question: questionForm.question_text,
          message_content: questionForm.message_content,
          message_image: questionForm.message_image,
          question_type: questionForm.question_type,
          options: questionForm.options || []
        }
      ]);
    }
    setShowQuestionModal(false);
  };

  const deleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    setServices(services.map(s => ({
      ...s,
      attached_questions: (s.attached_questions || []).filter(id => id !== questionId)
    })));
  };

  const addQuestionOption = () => {
    if (newOption.trim()) {
      setQuestionForm({
        ...questionForm,
        options: [...(questionForm.options || []), { option_text: newOption }]
      });
      setNewOption("");
    }
  };

  const removeQuestionOption = (idx) => {
    setQuestionForm({
      ...questionForm,
      options: questionForm.options.filter((_, i) => i !== idx)
    });
  };

  if (loading) return <div style={{ padding: 20, color: "#e2e2f0" }}>Loading settings...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: 1200 }}>
      {error && <div style={{ color: "#e05050", marginBottom: 16, padding: 12, background: "#1e0d0d", borderRadius: 6 }}>❌ {error}</div>}

      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 700, color: "#e2e2f0" }}>📱 Telegram Configuration</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#8888b0" }}>Configure commands, services, and questions for your Telegram bot</p>
      </div>

      {/* COMMANDS */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#e2e2f0" }}>Commands</h3>
          <button onClick={() => openCommandModal()} style={{ ...S.btn("#34d398"), fontSize: 12, padding: "8px 14px" }}>+ Add Command</button>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {commands.length === 0 ? (
            <div style={{ color: "#6060a0", fontSize: 13, padding: "20px", background: "#0d0d12", borderRadius: 8, textAlign: "center" }}>No commands created yet</div>
          ) : (
            commands.map((cmd) => (
              <div key={cmd.id || cmd.command} style={{ background: "#16161f", border: "1px solid #2a2a3e", borderRadius: 8, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#e2e2f0", fontWeight: 600, fontSize: 13 }}>{cmd.cmd || cmd.command}</div>
                  <div style={{ color: "#6060a0", fontSize: 12 }}>{cmd.attached_services?.length || 0} service(s) attached</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openCommandModal(cmd)} style={{ ...S.btnOutline, fontSize: 12, padding: "6px 12px" }}>✏️ Edit</button>
                  <button onClick={() => deleteCommand(cmd)} style={{ ...S.btnOutline, color: "#e05050", fontSize: 12, padding: "6px 12px" }}>🗑️ Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SERVICES */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#e2e2f0" }}>Services</h3>
          <button onClick={() => openServiceModal()} style={{ ...S.btn("#34d398"), fontSize: 12, padding: "8px 14px" }}>+ Add Service</button>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {services.length === 0 ? (
            <div style={{ color: "#6060a0", fontSize: 13, padding: "20px", background: "#0d0d12", borderRadius: 8, textAlign: "center" }}>No services created yet</div>
          ) : (
            services.map((svc) => (
              <div key={svc.id} style={{ background: "#16161f", border: "1px solid #2a2a3e", borderRadius: 8, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#e2e2f0", fontWeight: 600, fontSize: 13 }}>{svc.name}</div>
                  <div style={{ color: "#6060a0", fontSize: 12 }}>{svc.description || "No description"}</div>
                  <div style={{ color: "#6060a0", fontSize: 12 }}>{(svc.attached_questions || []).length} question(s) attached</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openServiceModal(svc)} style={{ ...S.btnOutline, fontSize: 12, padding: "6px 12px" }}>✏️ Edit</button>
                  <button onClick={() => deleteService(svc.id)} style={{ ...S.btnOutline, color: "#e05050", fontSize: 12, padding: "6px 12px" }}>🗑️ Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* QUESTIONS */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#e2e2f0" }}>Questions</h3>
          <button onClick={() => openQuestionModal()} style={{ ...S.btn("#34d398"), fontSize: 12, padding: "8px 14px" }}>+ Add Question</button>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {questions.length === 0 ? (
            <div style={{ color: "#6060a0", fontSize: 13, padding: "20px", background: "#0d0d12", borderRadius: 8, textAlign: "center" }}>No questions created yet</div>
          ) : (
            questions.map((q) => (
              <div key={q.id} style={{ background: "#16161f", border: "1px solid #2a2a3e", borderRadius: 8, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#e2e2f0", fontWeight: 600, fontSize: 13 }}>{q.question || q.question_text}</div>
                  <div style={{ color: "#6060a0", fontSize: 12 }}>Type: {q.question_type}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openQuestionModal(q)} style={{ ...S.btnOutline, fontSize: 12, padding: "6px 12px" }}>✏️ Edit</button>
                  <button onClick={() => deleteQuestion(q.id)} style={{ ...S.btnOutline, color: "#e05050", fontSize: 12, padding: "6px 12px" }}>🗑️ Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div style={{ position: "sticky", bottom: 0, background: "#0d0d12", borderTop: "1px solid #2a2a3e", padding: "16px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={saveSettings} disabled={saving} style={{ ...S.btn("#34d398"), padding: "10px 20px", fontSize: 13, fontWeight: 600 }}>
          {saving ? "Saving..." : "✅ Save All Settings"}
        </button>
      </div>

      {/* MODALS */}
      {showCommandModal && <CommandModal editingCommand={editingCommand} commandForm={commandForm} setCommandForm={setCommandForm} services={services} reorderButtonLayout={reorderButtonLayout} addButtonToLayout={addButtonToLayout} removeButtonFromLayout={removeButtonFromLayout} saveCommand={saveCommand} setShowCommandModal={setShowCommandModal} handleFileUpload={handleFileUpload} fileInputKey={fileInputKey} S={S} />}
      {showServiceModal && <ServiceModal editingService={editingService} serviceForm={serviceForm} setServiceForm={setServiceForm} questions={questions} addQuestionToService={addQuestionToService} removeQuestionFromService={removeQuestionFromService} reorderQuestions={reorderQuestions} saveService={saveService} setShowServiceModal={setShowServiceModal} handleFileUpload={handleFileUpload} fileInputKey={fileInputKey} S={S} />}
      {showQuestionModal && <QuestionModal editingQuestion={editingQuestion} questionForm={questionForm} setQuestionForm={setQuestionForm} newOption={newOption} setNewOption={setNewOption} addQuestionOption={addQuestionOption} removeQuestionOption={removeQuestionOption} saveQuestion={saveQuestion} setShowQuestionModal={setShowQuestionModal} handleFileUpload={handleFileUpload} fileInputKey={fileInputKey} S={S} />}
    </div>
  );
};

const CommandModal = ({ editingCommand, commandForm, setCommandForm, services, reorderButtonLayout, addButtonToLayout, removeButtonFromLayout, saveCommand, setShowCommandModal, handleFileUpload, fileInputKey, S }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, overflowY: "auto" }}>
    <div style={{ ...S.card, width: "90%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", padding: 0, margin: "20px auto" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#16161f", zIndex: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
          {editingCommand ? "Edit Command" : "Add New Command"}
        </h3>
        <button onClick={() => setShowCommandModal(false)} style={{ background: "none", border: "none", color: "#6060a0", cursor: "pointer", fontSize: 20 }}>✕</button>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Command</label>
          <input type="text" style={S.input} value={commandForm.cmd} onChange={e => setCommandForm({ ...commandForm, cmd: e.target.value })} placeholder="e.g., /start" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Description</label>
          <input type="text" style={S.input} value={commandForm.desc} onChange={e => setCommandForm({ ...commandForm, desc: e.target.value })} placeholder="Internal note" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Message Content</label>
          <textarea style={{ ...S.input, minHeight: 100 }} value={commandForm.message_content} onChange={e => setCommandForm({ ...commandForm, message_content: e.target.value })} placeholder="What to say when user uses this command" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Message Image</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="file" accept="image/*" onChange={e => { if (e.target.files[0]) { handleFileUpload(e.target.files[0], (base64) => { setCommandForm({ ...commandForm, message_image: base64 }); }); } }} style={{ display: "none" }} id="cmd-file-input" key={fileInputKey} />
            <button onClick={() => document.getElementById("cmd-file-input").click()} style={{ ...S.btnOutline, flex: 1, padding: "8px 12px", fontSize: 12 }}>Choose File - {commandForm.message_image ? "✓ Image selected" : "No file chosen"}</button>
            {commandForm.message_image && <button onClick={() => setCommandForm({ ...commandForm, message_image: null })} style={{ ...S.btnOutline, padding: "8px 12px", fontSize: 12, color: "#e05050" }}>Remove</button>}
          </div>
          {commandForm.message_image && <div style={{ marginTop: 12, borderRadius: 8, overflow: "hidden", maxHeight: 150 }}><img src={commandForm.message_image} alt="Preview" style={{ width: "100%", height: "auto", maxHeight: 150, objectFit: "cover" }} /></div>}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 8, fontWeight: 700 }}>Services/Buttons Layout</label>
          <ButtonLayoutEditor services={services} attachedServices={commandForm.attached_services} onReorder={reorderButtonLayout} onAdd={addButtonToLayout} onRemove={removeButtonFromLayout} S={S} />
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

const ServiceModal = ({ editingService, serviceForm, setServiceForm, questions, addQuestionToService, removeQuestionFromService, reorderQuestions, saveService, setShowServiceModal, handleFileUpload, fileInputKey, S }) => (
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
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Service Name</label>
          <input type="text" style={S.input} value={serviceForm.name} onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })} placeholder="e.g., Support" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Description</label>
          <input type="text" style={S.input} value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} placeholder="Brief description" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 700 }}>Open Message</label>
          <textarea style={{ ...S.input, minHeight: 80 }} value={serviceForm.open_message_content} onChange={e => setServiceForm({ ...serviceForm, open_message_content: e.target.value })} placeholder="Message when service is selected" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
            <input type="checkbox" checked={serviceForm.show_button_new_row} onChange={e => setServiceForm({ ...serviceForm, show_button_new_row: e.target.checked })} />
            Show button on new row
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
            <input type="checkbox" checked={serviceForm.webapp_mode} onChange={e => setServiceForm({ ...serviceForm, webapp_mode: e.target.checked })} />
            Webapp mode (experimental)
          </label>
        </div>

        {/* QUESTIONS */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 8, fontWeight: 700 }}>Questions (in order)</label>
          <p style={{ fontSize: 11, color: "#6060a0", marginBottom: 8 }}>Drag to reorder. Click X to remove.</p>
          
          <div style={{ background: "#0d0d12", border: "1px solid #2a2a3e", borderRadius: 8, padding: 12, marginBottom: 12, minHeight: 60 }}>
            {(serviceForm.attached_questions || []).length === 0 ? (
              <div style={{ color: "#6060a0", fontSize: 12, padding: "20px", textAlign: "center" }}>No questions attached yet. Add from below.</div>
            ) : (
              (serviceForm.attached_questions || []).map((qId, idx) => {
                const q = questions.find(qu => qu.id === qId);
                if (!q) return null;
                return (
                  <div key={qId} draggable onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', idx); }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
                    e.preventDefault();
                    const draggedIdx = parseInt(e.dataTransfer.getData('text/plain'));
                    if (draggedIdx !== idx) {
                      reorderQuestions(draggedIdx, idx);
                    }
                  }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px", background: "#16161f", borderRadius: 6, marginBottom: 6, cursor: "move", border: "1px solid #2a2a3e", fontSize: 12 }}>
                    <span style={{ color: "#60a5fa", userSelect: "none" }}>⋮⋮</span>
                    <span style={{ color: "#e2e2f0", flex: 1 }}>{idx + 1}. {q.question || q.question_text}</span>
                    <span style={{ fontSize: 10, color: "#6060a0" }}>{q.question_type}</span>
                    <button onClick={() => removeQuestionFromService(qId)} style={{ background: "none", border: "none", color: "#e05050", cursor: "pointer", fontSize: 14 }}>✕</button>
                  </div>
                );
              })
            )}
          </div>

          <label style={{ fontSize: 11, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>Available questions:</label>
          <div style={{ background: "#0d0d12", border: "1px solid #2a2a3e", borderRadius: 8, padding: 12, maxHeight: 150, overflowY: "auto" }}>
            {questions.length === 0 ? (
              <div style={{ color: "#6060a0", fontSize: 12 }}>No questions created yet</div>
            ) : (
              questions.map(q => {
                const isAttached = (serviceForm.attached_questions || []).includes(q.id);
                return (
                  <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #1e1e2e", fontSize: 12 }}>
                    <button onClick={() => addQuestionToService(q.id)} disabled={isAttached} style={{ background: "none", border: "none", color: isAttached ? "#6060a0" : "#34d398", cursor: isAttached ? "default" : "pointer", fontSize: 14, padding: 0, opacity: isAttached ? 0.5 : 1 }}>+</button>
                    <span style={{ color: "#e2e2f0", flex: 1 }}>{q.question || q.question_text}</span>
                    <span style={{ fontSize: 10, color: "#6060a0" }}>{q.question_type}</span>
                  </div>
                );
              })
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
              key={fileInputKey}
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
