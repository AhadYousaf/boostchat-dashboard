import React from 'react';

const ButtonLayoutEditor = ({ services, attachedServices, onReorder, onAdd, onRemove, S }) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 12, color: "#6060a0", display: "block", marginBottom: 8, fontWeight: 700 }}>
        Services/Buttons Layout
      </label>
      <p style={{ fontSize: 11, color: "#6060a0", marginBottom: 12 }}>
        Drag to arrange buttons. Preview shows 2 per row as they'll appear in Telegram.
      </p>
      
      {/* Button Layout Preview - Looks like Telegram */}
      <div style={{ background: "#0d0d12", border: "1px solid #2a2a3e", borderRadius: 8, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: "#6060a0", marginBottom: 12, fontWeight: 600 }}>
          Preview (Telegram Layout - 2 buttons per row):
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {(attachedServices || []).length === 0 ? (
            <div style={{ 
              gridColumn: "1 / -1", 
              color: "#6060a0", 
              fontSize: 12, 
              padding: "20px", 
              textAlign: "center",
              background: "#16161f",
              borderRadius: 6,
              border: "1px dashed #2a2a3e"
            }}>
              No services attached yet. Add some below.
            </div>
          ) : (
            (attachedServices || []).map((sName, idx) => {
              const service = services.find(s => s.name === sName);
              return (
                <div
                  key={sName}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', idx.toString());
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.opacity = '0.7';
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.opacity = '1';
                    const draggedIdx = parseInt(e.dataTransfer.getData('text/plain'));
                    if (draggedIdx !== idx) {
                      onReorder(draggedIdx, idx);
                    }
                  }}
                  style={{
                    padding: "14px 12px",
                    background: "#16161f",
                    border: "1px solid #2a2a3e",
                    borderRadius: 6,
                    cursor: "move",
                    color: "#e2e2f0",
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "all 0.2s",
                    userSelect: "none",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "50px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#60a5fa";
                    e.currentTarget.style.background = "#1a1a28";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a3e";
                    e.currentTarget.style.background = "#16161f";
                  }}
                >
                  <div style={{ flex: 1 }}>
                    {service?.name || sName}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(idx);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#e05050",
                      cursor: "pointer",
                      fontSize: 16,
                      padding: "0 4px",
                      flexShrink: 0,
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => { e.target.style.color = "#ff6b6b"; }}
                    onMouseLeave={(e) => { e.target.style.color = "#e05050"; }}
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Available Services to Add */}
      <label style={{ fontSize: 11, color: "#6060a0", display: "block", marginBottom: 6, fontWeight: 600 }}>
        Available services (click + to add):
      </label>
      <div style={{ background: "#0d0d12", border: "1px solid #2a2a3e", borderRadius: 8, padding: 12, maxHeight: 150, overflowY: "auto" }}>
        {services.length === 0 ? (
          <div style={{ color: "#6060a0", fontSize: 12 }}>No services created yet</div>
        ) : (
          services.map(s => {
            const isAdded = (attachedServices || []).includes(s.name);
            return (
              <div 
                key={s.id} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8, 
                  padding: "6px 0", 
                  borderBottom: "1px solid #1e1e2e", 
                  fontSize: 12,
                  opacity: isAdded ? 0.5 : 1
                }}
              >
                <button 
                  onClick={() => onAdd(s.name)}
                  disabled={isAdded}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    color: isAdded ? "#6060a0" : "#34d398", 
                    cursor: isAdded ? "not-allowed" : "pointer", 
                    fontSize: 14, 
                    padding: 0,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={(e) => { 
                    if (!isAdded) e.target.style.color = "#5ee5a6"; 
                  }}
                  onMouseLeave={(e) => { 
                    if (!isAdded) e.target.style.color = "#34d398"; 
                  }}
                >
                  +
                </button>
                <span style={{ color: "#e2e2f0", flex: 1 }}>{s.name}</span>
                {isAdded && <span style={{ fontSize: 10, color: "#6060a0" }}>added</span>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ButtonLayoutEditor;
