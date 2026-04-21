import { useState } from "react";
import { X, Check, Trash2 } from "lucide-react";

import { C } from "../constants/colors";
import { KANBAN_COLS, PRIORITY_COLORS } from "../constants/kanban";
// Ensure calcTaskProgress is imported
import { fmtDate, calcTaskProgress } from "../utils";
import Chip from "./ui/Chip";
import Label from "./ui/Label";

export default function TaskModal({ task, onClose, onUpdate, onDelete, onSubtaskToggle, onSubtaskAdd, onSubtaskRemove }) {
  const [title, setTitle]       = useState(task.title);
  const [notes, setNotes]       = useState(task.notes || "");
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSub, setNewSub]     = useState("");
  const [status, setStatus]     = useState(task.status);

  // const save = () => {
  //   // Determine if task should be marked 'done' automatically if all subtasks are finished
  //   const progress = calcTaskProgress({ subtasks });
  //   const finalStatus = (progress === 100 && subtasks.length > 0) ? "done" : status;

  //   onUpdate({ ...task, title, notes, subtasks, status: finalStatus });
  //   onClose();
  // };

 const toggleSub = async (id) => {
  const sub = subtasks.find((s) => s.id === id);
  const updated = { ...sub, done: !sub.done };
  setSubtasks((s) => s.map((st) => st.id === id ? updated : st));
  // Only call API if it's a real DB subtask (not a newly added unsaved one)
  if (!id.startsWith("ns") && onSubtaskToggle) {
    await onSubtaskToggle(id, !sub.done);
  }
};

const addSub = async () => {
  if (!newSub.trim()) return;
  const tempId = "ns" + Date.now();
  const newSubtask = { id: tempId, title: newSub.trim(), done: false };
  setSubtasks((s) => [...s, newSubtask]);
  setNewSub("");
  // Save to DB immediately and replace temp id with real one
  if (onSubtaskAdd) {
    const saved = await onSubtaskAdd(task.id, newSub.trim());
    if (saved) {
      setSubtasks((s) => s.map((st) => st.id === tempId ? saved : st));
    }
  }
};

const removeSub = async (id) => {
  setSubtasks((s) => s.filter((x) => x.id !== id));
  if (!id.startsWith("ns") && onSubtaskRemove) {
    await onSubtaskRemove(id);
  }
};

const save = () => {
  const progress = calcTaskProgress({ subtasks });
  const finalStatus = (progress === 100 && subtasks.length > 0) ? "done" : status;
  // Only saves title, notes, status — subtasks are saved individually above
  onUpdate({ ...task, title, notes, subtasks, status: finalStatus });
  onClose();
};

  // Calculate current progress for the UI
  const progressPercent = calcTaskProgress({ subtasks, status });

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "#000000bb",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
      }}
    >
      <div
        style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
          width: "92%", maxWidth: 520, maxHeight: "88vh", overflow: "auto", padding: 26,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 18 }}>
          <div
            style={{
              width: 4, height: 44, borderRadius: 2,
              background: PRIORITY_COLORS[task.priority] || C.textMuted,
              flexShrink: 0, marginTop: 2,
            }}
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: C.text, fontSize: 17, fontWeight: 700, fontFamily: "Syne", lineHeight: 1.3,
            }}
          />
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <Label style={{ margin: 0 }}>Task Completion</Label>
            <span style={{ fontSize: 11, color: C.accent, fontWeight: 700 }}>{progressPercent}%</span>
          </div>
          <div style={{ width: "100%", height: 6, background: C.surface, borderRadius: 3, overflow: "hidden" }}>
            <div 
              style={{ 
                width: `${progressPercent}%`, 
                height: "100%", 
                background: C.accent, 
                transition: "width 0.3s ease" 
              }} 
            />
          </div>
        </div>

        {/* Meta chips */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
          <Chip label={task.priority.toUpperCase()} color={PRIORITY_COLORS[task.priority]} />
          <Chip label={`Due: ${fmtDate(task.deadline)}`} color={C.textSub} bg={C.surface} />
          <Chip label={task.assignee} color={C.accent} bg={C.accent + "15"} />
        </div>

        {/* Column picker */}
        <div style={{ marginBottom: 18 }}>
          <Label>Move to column</Label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {KANBAN_COLS.map((col) => (
              <button
                key={col.id}
                onClick={() => setStatus(col.id)}
                style={{
                  padding: "5px 12px", borderRadius: 6, fontSize: 12, fontFamily: "DM Sans",
                  background: status === col.id ? col.color + "28" : C.surface,
                  border: `1px solid ${status === col.id ? col.color : C.border}`,
                  color: status === col.id ? col.color : C.textSub,
                  cursor: "pointer", fontWeight: 600,
                }}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subtasks */}
        <div style={{ marginBottom: 18 }}>
          <Label>Subtasks</Label>

          {subtasks.map((st) => (
            <div
              key={st.id}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 0", borderBottom: `1px solid ${C.border}`,
              }}
            >
              <button
                onClick={() => toggleSub(st.id)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}
              >
                <div
                  style={{
                    width: 16, height: 16, borderRadius: 4,
                    background: st.done ? C.emerald + "22" : "transparent",
                    border: `1.5px solid ${st.done ? C.emerald : C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {st.done && <Check size={10} color={C.emerald} />}
                </div>
              </button>

              <span
                style={{
                  flex: 1, fontSize: 13,
                  color: st.done ? C.textMuted : C.text,
                  textDecoration: st.done ? "line-through" : "none",
                }}
              >
                {st.title}
              </span>

              <button
                onClick={() => removeSub(st.id)}
                style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", opacity: 0.5, padding: 0 }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <input
              value={newSub}
              onChange={(e) => setNewSub(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSub()}
              placeholder="Add subtask…"
              style={{
                flex: 1, background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 6, padding: "5px 10px", color: C.text,
                fontSize: 12, fontFamily: "DM Sans", outline: "none",
              }}
            />
            <button
              onClick={addSub}
              style={{
                background: C.accent + "20", border: `1px solid ${C.accent}44`,
                borderRadius: 6, color: C.accent, cursor: "pointer",
                padding: "4px 12px", fontSize: 12, fontFamily: "DM Sans",
              }}
            >
              + Add
            </button>
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 20 }}>
          <Label>Notes</Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes…"
            rows={3}
            style={{
              width: "100%", background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 8, padding: "8px 12px", color: C.text,
              fontSize: 13, fontFamily: "DM Sans", outline: "none",
              resize: "vertical", colorScheme: "dark",
            }}
          />
        </div>

        {/* Footer actions */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => { onDelete(task.id); onClose(); }}
            style={{
              background: "#f8717115", border: "1px solid #f8717130",
              borderRadius: 8, padding: "8px 16px", color: "#f87171",
              cursor: "pointer", fontFamily: "DM Sans", fontSize: 13,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Trash2 size={13} /> Delete
          </button>

          <button
            onClick={save}
            style={{
              background: C.accent + "20", border: `1px solid ${C.accent}55`,
              borderRadius: 8, padding: "8px 24px", color: C.accent,
              cursor: "pointer", fontFamily: "DM Sans", fontSize: 13, fontWeight: 600,
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}