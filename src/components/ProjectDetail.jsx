import { useState } from "react";
import {
  ArrowLeft, Plus, Calendar, Send, Check,
} from "lucide-react";

import { C } from "../constants/colors.js";
import { KANBAN_COLS, PRIORITY_COLORS, STATUS_META } from "../constants/kanban.js";
import { calcProgress, fmtDate, fmtMoney,calcBudgetPct } from "../utils";
import Av from "./ui/Av.jsx";
import Bar from "./ui/Bar.jsx";
import Chip from "./ui/Chip.jsx";
import Label from "./ui/Label.jsx";
import TaskModal from "./TaskModal.jsx";

/**
 * ProjectDetail – kanban board + sidebar for a single project.
 *
 * Props:
 *   project   – project object
 *   onBack    – () => void   (navigate back to dashboard)
 *   onUpdate  – (updaterFn) => void
 */
export default function ProjectDetail({ project, onBack, onUpdate, onTaskCreate, onTaskUpdate, onTaskDelete, onMilestoneToggle, onCommentAdd }) {
  const [activeTask,    setActiveTask]    = useState(null);
  const [newTaskCol,    setNewTaskCol]    = useState(null);
  const [newTaskTitle,  setNewTaskTitle]  = useState("");
  const [newComment,    setNewComment]    = useState("");
  const [commentAuthor, setCommentAuthor] = useState("Supervisor");

  // ── task mutations ──────────────────────────────────────────────────────────
const addTask = async (colId) => {
  if (!newTaskTitle.trim()) return;
  await onTaskCreate({
    title:    newTaskTitle.trim(),
    status:   colId,
    assignee: project.team[0]?.name || "Unassigned",
    priority: "medium",
  });
  setNewTaskTitle("");
  setNewTaskCol(null);
};

const updateTask = async (updated) => {
  await onTaskUpdate(updated.id, {
    title:    updated.title,
    status:   updated.status,
    priority: updated.priority,
    notes:    updated.notes,
  });
};

const deleteTask = async (id) => {
  await onTaskDelete(id);
};

const addComment = async () => {
  if (!newComment.trim()) return;
  await onCommentAdd({
    author: commentAuthor,
    text:   newComment.trim(),
    role:   commentAuthor === "Supervisor" ? "supervisor" : "member",
  });
  setNewComment("");
};

const toggleMilestone = async (id) => {
  const milestone = project.milestones.find((m) => m.id === id);
  await onMilestoneToggle(id, !milestone.done);
};

  // ── derived values ──────────────────────────────────────────────────────────
  const progress   = calcProgress(project.tasks);
  const budgetPct = calcBudgetPct(project.budget.spent, project.budget.total);
  const sm         = STATUS_META[project.status] || STATUS_META["In Progress"];

  return (
    <div
      style={{
        height: "100vh", width: "100%", background: C.bg, color: C.text,
        fontFamily: "DM Sans", display: "flex", flexDirection: "column", overflow: "hidden",
      }}
    >
      {/* ── top bar ── */}
      <div
        style={{
          padding: "14px 20px", borderBottom: `1px solid ${C.border}`,
          background: C.surface, display: "flex", alignItems: "center", gap: 14, flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
            color: C.textSub, cursor: "pointer", padding: "6px 12px",
            display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontFamily: "DM Sans",
          }}
        >
          <ArrowLeft size={13} /> Dashboard
        </button>

        <div style={{ width: 3, height: 26, borderRadius: 2, background: project.color, flexShrink: 0 }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontFamily: "Syne", fontSize: 16, fontWeight: 800, letterSpacing: "-0.3px",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}
          >
            {project.name}
          </h1>
          <p
            style={{
              fontSize: 11, color: C.textSub, marginTop: 1,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}
          >
            {project.description}
          </p>
        </div>

<select
  value={project.status}
  onChange={async (e) => {
    await onUpdate(() => ({ ...project, status: e.target.value }));
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/projects/${project.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: e.target.value }),
    });
  }}
  style={{
    background: sm.bg,
    border: `1px solid ${sm.color}44`,
    borderRadius: 6,
    color: sm.color,
    fontSize: 11,
    fontFamily: "DM Sans",
    fontWeight: 600,
    padding: "4px 8px",
    cursor: "pointer",
    outline: "none",
    colorScheme: "dark",
  }}
>
  <option value="Planning">Planning</option>
  <option value="In Progress">In Progress</option>
  <option value="On Hold">On Hold</option>
  <option value="Completed">Completed</option>
</select>

        <div style={{ display: "flex" }}>
          {project.team.slice(0, 4).map((m, i) => (
            <div key={m.id} style={{ marginLeft: i > 0 ? -7 : 0, zIndex: 4 - i }}>
              <Av initials={m.initials} color={project.color} size={26} />
            </div>
          ))}
        </div>

        <span
          style={{
            fontFamily: "Space Mono", fontSize: 14,
            color: project.color, fontWeight: 700, flexShrink: 0,
          }}
        >
          {progress}%
        </span>
      </div>

      {/* ── main area ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Kanban board */}
        <div
          style={{
            flex: 1, display: "flex", gap: 10, padding: "14px",
            overflowX: "auto", overflowY: "hidden", minWidth: 0,
          }}
        >
          {KANBAN_COLS.map((col) => {
            const colTasks = project.tasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                style={{
                  minWidth: 260, maxWidth: 280, flex: "0 0 260px",
                  background: C.surface, borderRadius: 10,
                  border: `1px solid ${C.border}`, display: "flex",
                  flexDirection: "column", borderTop: `3px solid ${col.color}`,
                }}
              >
                {/* column header */}
                <div
                  style={{
                    padding: "10px 12px 6px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontFamily: "Syne", fontSize: 12, fontWeight: 700, color: col.color }}>
                      {col.label}
                    </span>
                    <span
                      style={{
                        background: col.color + "22", color: col.color,
                        borderRadius: 10, padding: "1px 6px",
                        fontSize: 10, fontFamily: "Space Mono", fontWeight: 700,
                      }}
                    >
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setNewTaskCol(newTaskCol === col.id ? null : col.id)}
                    style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: 2 }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* tasks */}
                <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 10px" }}>
                  {colTasks.map((task) => {
                    const subDone = task.subtasks.filter((s) => s.done).length;
                    return (
                      <div
                        key={task.id}
                        onClick={() => setActiveTask(task)}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = project.color + "66")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
                        style={{
                          background: C.card, borderRadius: 8, padding: "9px 11px",
                          marginBottom: 7, cursor: "pointer",
                          border: `1px solid ${C.border}`,
                          borderLeft: `3px solid ${PRIORITY_COLORS[task.priority]}`,
                          transition: "border-color 0.15s",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 12, fontWeight: 500, marginBottom: 7, lineHeight: 1.4,
                            color: task.status === "done" ? C.textSub : C.text,
                          }}
                        >
                          {task.title}
                        </p>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                          {task.assignee && (
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              <Av
                                initials={task.assignee.split(" ").map((w) => w[0]).join("")}
                                color={project.color}
                                size={18}
                              />
                              <span style={{ fontSize: 10, color: C.textSub }}>
                                {task.assignee.split(" ")[0]}
                              </span>
                            </div>
                          )}
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {task.subtasks.length > 0 && (
                              <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "Space Mono" }}>
                                {subDone}/{task.subtasks.length}
                              </span>
                            )}
                            {task.deadline && (
                              <span style={{ fontSize: 10, color: C.textMuted, display: "flex", alignItems: "center", gap: 2 }}>
                                <Calendar size={9} />
                                {fmtDate(task.deadline).slice(0, -6)}
                              </span>
                            )}
                          </div>
                        </div>

                        {task.subtasks.length > 0 && (
                          <div style={{ marginTop: 7 }}>
                            <Bar value={(subDone / task.subtasks.length) * 100} color={col.color} h={3} />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* new-task input */}
                  {newTaskCol === col.id && (
                    <div
                      style={{
                        background: C.card, borderRadius: 8, padding: 9,
                        border: `1px dashed ${col.color}55`,
                      }}
                    >
                      <input
                        autoFocus
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addTask(col.id);
                          if (e.key === "Escape") setNewTaskCol(null);
                        }}
                        placeholder="Task title…"
                        style={{
                          width: "100%", background: "none", border: "none", outline: "none",
                          color: C.text, fontSize: 12, fontFamily: "DM Sans", marginBottom: 7,
                        }}
                      />
                      <div style={{ display: "flex", gap: 5 }}>
                        <button
                          onClick={() => addTask(col.id)}
                          style={{
                            flex: 1, background: col.color + "20", border: `1px solid ${col.color}44`,
                            borderRadius: 5, color: col.color, fontSize: 11,
                            cursor: "pointer", padding: "4px 0", fontFamily: "DM Sans",
                          }}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setNewTaskCol(null)}
                          style={{
                            background: C.surface, border: `1px solid ${C.border}`,
                            borderRadius: 5, color: C.textMuted, fontSize: 11,
                            cursor: "pointer", padding: "4px 8px",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── right sidebar ── */}
        <div
          style={{
            width: 264, borderLeft: `1px solid ${C.border}`, background: C.surface,
            overflowY: "auto", padding: "16px 14px",
            display: "flex", flexDirection: "column", gap: 20, flexShrink: 0,
          }}
        >
          {/* Progress */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
              <Label>Progress</Label>
              <span style={{ fontSize: 12, fontFamily: "Space Mono", color: project.color, fontWeight: 700 }}>
                {progress}%
              </span>
            </div>
            <Bar value={progress} color={project.color} h={8} />
          </div>

          {/* Deadline */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 11px",
              background: C.card, borderRadius: 8, border: `1px solid ${C.border}`,
            }}
          >
            <Calendar size={14} color={C.textSub} />
            <div>
              <p style={{ fontSize: 10, color: C.textMuted, fontFamily: "Space Mono", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                Deadline
              </p>
              <p style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>
                {fmtDate(project.deadline)}
              </p>
            </div>
          </div>

          {/* Budget */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
              <Label>Budget</Label>
              <span style={{ fontSize: 10, fontFamily: "Space Mono", color: budgetPct > 85 ? "#f87171" : C.textSub }}>
                {budgetPct}% used
              </span>
            </div>
            <Bar value={budgetPct} color={budgetPct > 85 ? "#f87171" : C.emerald} h={6} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              <span style={{ fontSize: 10, color: C.textSub, fontFamily: "Space Mono" }}>
                {fmtMoney(project.budget.spent)}
              </span>
              <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "Space Mono" }}>
                {fmtMoney(project.budget.total)}
              </span>
            </div>
          </div>

          {/* Team */}
          <div>
            <Label>Team ({project.team.length})</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {project.team.map((m) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <Av initials={m.initials} color={project.color} size={28} />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{m.name}</p>
                    <p style={{ fontSize: 10, color: C.textMuted }}>{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <Label>Milestones</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {project.milestones.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleMilestone(m.id)}
                  style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", opacity: m.done ? 0.6 : 1 }}
                >
                  <div
                    style={{
                      width: 15, height: 15, borderRadius: 4, flexShrink: 0,
                      background: m.done ? C.emerald + "28" : "transparent",
                      border: `1.5px solid ${m.done ? C.emerald : C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {m.done && <Check size={9} color={C.emerald} />}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        color: m.done ? C.textSub : C.text,
                        textDecoration: m.done ? "line-through" : "none",
                      }}
                    >
                      {m.title}
                    </p>
                    <p style={{ fontSize: 10, color: C.textMuted, fontFamily: "Space Mono" }}>
                      {fmtDate(m.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div style={{ paddingBottom: 20 }}>
            <Label>Comments ({project.comments.length})</Label>

            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 12 }}>
              {project.comments.length === 0 && (
                <p style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic", textAlign: "center", padding: "8px 0" }}>
                  No comments yet
                </p>
              )}
              {project.comments.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: c.role === "supervisor" ? C.accent + "0a" : C.card,
                    border: `1px solid ${c.role === "supervisor" ? C.accent + "30" : C.border}`,
                    borderRadius: 8, padding: "7px 10px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: c.role === "supervisor" ? C.accent : project.color }}>
                      {c.author}
                    </span>
                    <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "Space Mono" }}>
                      {fmtDate(c.date).slice(0, -6)}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{c.text}</p>
                </div>
              ))}
            </div>

            <select
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              style={{
                width: "100%", background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 6, padding: "5px 8px", color: C.text,
                fontSize: 12, fontFamily: "DM Sans", outline: "none",
                marginBottom: 6, colorScheme: "dark",
              }}
            >
              <option value="Supervisor">Supervisor</option>
              {project.team.map((m) => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment…"
              rows={2}
              style={{
                width: "100%", background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 6, padding: "7px 10px", color: C.text,
                fontSize: 12, fontFamily: "DM Sans", outline: "none",
                resize: "none", colorScheme: "dark",
              }}
            />

            <button
              onClick={addComment}
              style={{
                width: "100%", marginTop: 6,
                background: C.accent + "18", border: `1px solid ${C.accent}44`,
                borderRadius: 6, color: C.accent, cursor: "pointer",
                padding: "7px 0", fontSize: 12, fontFamily: "DM Sans", fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <Send size={12} /> Post Comment
            </button>
          </div>
        </div>
      </div>

      {/* Task modal */}
      {activeTask && (
        <TaskModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onUpdate={(u) => { updateTask(u); setActiveTask(null); }}
          onDelete={(id) => { deleteTask(id); setActiveTask(null); }}
        />
      )}
    </div>
  );
}