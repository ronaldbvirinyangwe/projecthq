import { useState } from "react";
import { Activity, Check, ChevronRight, DollarSign, Calendar, LayoutDashboard, Plus, X } from "lucide-react";

import { C } from "../constants/colors.js";
import { STATUS_META } from "../constants/kanban.js";
import { calcProgress, fmtDate, fmtMoney, calcBudgetPct } from "../utils";
import Av from "./ui/Av.jsx";
import Bar from "./ui/Bar.jsx";
import Chip from "./ui/Chip.jsx";

const PROJECT_COLORS = [
  "#06b6d4", "#f59e0b", "#10b981", "#a78bfa",
  "#f43f5e", "#3b82f6", "#84cc16", "#fb923c",
];

const EMPTY_FORM = {
  name: "",
  description: "",
  color: PROJECT_COLORS[0],
  budget_total: "",
  deadline: "",
  status: "In Progress",
};

/**
 * Dashboard – overview grid of all projects.
 *
 * Props:
 *   projects       – project[]
 *   onProjectClick – (projectId: string) => void
 *   onProjectAdded – (newProject: object) => void   ← NEW
 *   apiBase        – string (e.g. "http://localhost:4000")
 */
export default function Dashboard({ projects, onProjectClick, onProjectAdded, apiBase = "" }) {
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState(null);

  const totalTasks  = projects.reduce((s, p) => s + p.tasks.length, 0);
  const doneTasks   = projects.reduce((s, p) => s + p.tasks.filter((t) => t.status === "done").length, 0);
  const totalBudget = projects.reduce((s, p) => s + p.budget.total, 0);
  const spentBudget = projects.reduce((s, p) => s + p.budget.spent, 0);

  const stats = [
    { label: "Total Projects", val: projects.length,                                           color: C.accent,   icon: <LayoutDashboard size={15} /> },
    { label: "In Progress",    val: projects.filter((p) => p.status === "In Progress").length, color: "#f59e0b",  icon: <Activity size={15} /> },
    { label: "Tasks Done",     val: `${doneTasks}/${totalTasks}`,                              color: C.emerald,  icon: <Check size={15} /> },
    { label: "Budget Spent",   val: fmtMoney(spentBudget), sub: `of ${fmtMoney(totalBudget)}`, color: "#a78bfa", icon: <DollarSign size={15} /> },
  ];

  /* ── helpers ── */
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError("Project name is required."); return; }
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/projects`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:         form.name.trim(),
          description:  form.description.trim(),
          color:        form.color,
          status:       form.status,
          budget_total: parseFloat(form.budget_total) || 0,
          deadline:     form.deadline || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Request failed");
      const newProject = await res.json();
      onProjectAdded?.(newProject);
      setShowModal(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => { setShowModal(false); setForm(EMPTY_FORM); setError(null); };

  /* ── shared input style ── */
  const inputStyle = {
    width: "100%", background: C.bg, border: `1px solid ${C.border}`,
    borderRadius: 7, padding: "9px 11px", color: C.text,
    fontSize: 13, fontFamily: "DM Sans", outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    fontSize: 10, color: C.textMuted, textTransform: "uppercase",
    letterSpacing: "0.7px", fontFamily: "Space Mono", marginBottom: 5,
    display: "block",
  };

  return (
    <div
      style={{
        height: "100vh", width: "100%", background: C.bg, color: C.text,
        fontFamily: "DM Sans", display: "flex", flexDirection: "column", overflow: "hidden",
      }}
    >
      {/* ── header ── */}
      <div
        style={{
          padding: "18px 24px", borderBottom: `1px solid ${C.border}`,
          background: C.surface, display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div
            style={{
              width: 34, height: 34, borderRadius: 8,
              background: `linear-gradient(135deg, ${C.accent}, #0e7490)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Activity size={17} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>
              Project<span style={{ color: C.accent }}>HQ</span>
            </h1>
            <p style={{ fontSize: 10, color: C.textMuted, fontFamily: "Space Mono" }}>Management Dashboard</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Chip label="SUPERVISOR VIEW" color={C.accent} bg={C.accent + "15"} />
          <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "Space Mono" }}>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* ── body ── */}
      <div style={{ flex: 1, padding: "22px 24px", overflowY: "auto" }}>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 26 }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: "14px 16px", borderTop: `3px solid ${s.color}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.7px", fontFamily: "Space Mono", marginBottom: 8 }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: 22, fontFamily: "Space Mono", fontWeight: 700, color: s.color }}>
                    {s.val}
                  </p>
                  {s.sub && (
                    <p style={{ fontSize: 10, color: C.textMuted, fontFamily: "Space Mono", marginTop: 2 }}>
                      {s.sub}
                    </p>
                  )}
                </div>
                <div style={{ color: s.color, opacity: 0.6, marginTop: 2 }}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Section title + Add button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 800, letterSpacing: "-0.2px" }}>
            Active Projects
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "Space Mono" }}>
              Click any project to open
            </span>
            {/* ── ADD PROJECT BUTTON ── */}
            <button
              onClick={() => setShowModal(true)}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.accent; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.accent + "15"; e.currentTarget.style.color = C.accent; }}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 13px", borderRadius: 7, border: `1px solid ${C.accent}40`,
                background: C.accent + "15", color: C.accent,
                fontSize: 12, fontFamily: "Space Mono", fontWeight: 600,
                cursor: "pointer", transition: "all 0.15s", outline: "none",
              }}
            >
              <Plus size={13} /> New Project
            </button>
          </div>
        </div>

        {/* Project cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {projects.map((p) => {
            const progress  = calcProgress(p.tasks);
            const budgetPct = calcBudgetPct(p.budget.spent, p.budget.total);
            const sm        = STATUS_META[p.status] || STATUS_META["In Progress"];

            return (
              <div
                key={p.id}
                onClick={() => onProjectClick(p.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform   = "translateY(-2px)";
                  e.currentTarget.style.boxShadow   = `0 8px 28px ${p.color}12`;
                  e.currentTarget.style.borderColor = p.color + "55";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform   = "translateY(0)";
                  e.currentTarget.style.boxShadow   = "none";
                  e.currentTarget.style.borderColor = C.border;
                }}
                style={{
                  background: C.surface, borderRadius: 12, padding: "18px 20px",
                  border: `1px solid ${C.border}`, cursor: "pointer",
                  borderTop: `4px solid ${p.color}`, transition: "all 0.2s",
                  position: "relative", overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: p.color + "07", pointerEvents: "none" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 800, marginBottom: 4, letterSpacing: "-0.2px" }}>
                      {p.name}
                    </h3>
                    <p style={{ fontSize: 11, color: C.textSub, lineHeight: 1.4 }}>{p.description}</p>
                  </div>
                  <Chip label={p.status} color={sm.color} bg={sm.bg} />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "Space Mono", textTransform: "uppercase", letterSpacing: "0.4px" }}>Progress</span>
                    <span style={{ fontSize: 11, fontFamily: "Space Mono", color: p.color, fontWeight: 700 }}>{progress}%</span>
                  </div>
                  <Bar value={progress} color={p.color} h={6} />
                </div>

                <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-end" }}>
                  {[
                    { label: "Done",   val: p.tasks.filter((t) => t.status === "done").length,       color: C.emerald },
                    { label: "Active", val: p.tasks.filter((t) => t.status === "inprogress").length, color: C.accent  },
                    { label: "Total",  val: p.tasks.length,                                          color: C.textSub },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: "Space Mono", fontSize: 15, fontWeight: 700, color: s.color }}>{s.val}</p>
                      <p style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.4px" }}>{s.label}</p>
                    </div>
                  ))}

                  <div style={{ width: 1, background: C.border, alignSelf: "stretch" }} />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.4px" }}>Budget</span>
                      <span style={{ fontSize: 10, fontFamily: "Space Mono", color: budgetPct > 85 ? "#f87171" : C.textSub }}>{budgetPct}%</span>
                    </div>
                    <Bar value={budgetPct} color={budgetPct > 85 ? "#f87171" : C.emerald} h={4} />
                    <p style={{ fontSize: 10, color: C.textMuted, fontFamily: "Space Mono", marginTop: 3 }}>
                      {fmtMoney(p.budget.spent)} / {fmtMoney(p.budget.total)}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex" }}>
                    {p.team.slice(0, 4).map((m, i) => (
                      <div key={m.id} style={{ marginLeft: i > 0 ? -6 : 0, zIndex: 4 - i }}>
                        <Av initials={m.initials} color={p.color} size={24} />
                      </div>
                    ))}
                    {p.team.length > 4 && (
                      <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 6 }}>+{p.team.length - 4}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "Space Mono", display: "flex", alignItems: "center", gap: 3 }}>
                      <Calendar size={10} />{fmtDate(p.deadline).slice(0, -6)}
                    </span>
                    <span style={{ fontSize: 12, color: p.color, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                      Open <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════
          ADD PROJECT MODAL
      ══════════════════════════════════════ */}
      {showModal && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 14, width: 480, maxWidth: "92vw",
              boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
          >
            {/* modal header */}
            <div
              style={{
                padding: "16px 20px", borderBottom: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: `linear-gradient(135deg, ${C.accent}12, transparent)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div
                  style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: `linear-gradient(135deg, ${C.accent}, #0e7490)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Plus size={14} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 800, letterSpacing: "-0.3px" }}>
                    New Project
                  </h3>
                  <p style={{ fontSize: 10, color: C.textMuted, fontFamily: "Space Mono" }}>
                    Add to active projects
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: 4, borderRadius: 6 }}
              >
                <X size={16} />
              </button>
            </div>

            {/* modal body */}
            <div style={{ padding: "20px" }}>
              {/* color strip preview */}
              <div
                style={{
                  height: 4, borderRadius: 2, marginBottom: 18,
                  background: form.color, transition: "background 0.2s",
                }}
              />

              {/* Name */}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Project Name *</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Mobile App Redesign"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = C.accent; }}
                  onBlur={(e) => { e.target.style.borderColor = C.border; }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  style={{ ...inputStyle, resize: "vertical", minHeight: 68 }}
                  placeholder="Brief project summary..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = C.accent; }}
                  onBlur={(e) => { e.target.style.borderColor = C.border; }}
                />
              </div>

              {/* Color + Status row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Project Color</label>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {PROJECT_COLORS.map((col) => (
                      <button
                        key={col}
                        onClick={() => set("color", col)}
                        style={{
                          width: 22, height: 22, borderRadius: "50%",
                          background: col, border: "none", cursor: "pointer",
                          outline: form.color === col ? `2px solid ${col}` : "none",
                          outlineOffset: 2, transition: "transform 0.1s",
                          transform: form.color === col ? "scale(1.2)" : "scale(1)",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select
                    style={{ ...inputStyle, cursor: "pointer" }}
                    value={form.status}
                    onChange={(e) => set("status", e.target.value)}
                    onFocus={(e) => { e.target.style.borderColor = C.accent; }}
                    onBlur={(e) => { e.target.style.borderColor = C.border; }}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Planning">Planning</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Budget + Deadline row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 4 }}>
                <div>
                  <label style={labelStyle}>Total Budget ($)</label>
                  <input
                    style={inputStyle}
                    type="number"
                    min="0"
                    placeholder="e.g. 50000"
                    value={form.budget_total}
                    onChange={(e) => set("budget_total", e.target.value)}
                    onFocus={(e) => { e.target.style.borderColor = C.accent; }}
                    onBlur={(e) => { e.target.style.borderColor = C.border; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Deadline</label>
                  <input
                    style={inputStyle}
                    type="date"
                    value={form.deadline}
                    onChange={(e) => set("deadline", e.target.value)}
                    onFocus={(e) => { e.target.style.borderColor = C.accent; }}
                    onBlur={(e) => { e.target.style.borderColor = C.border; }}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <p style={{ fontSize: 11, color: "#f87171", fontFamily: "Space Mono", marginTop: 12 }}>
                  ⚠ {error}
                </p>
              )}
            </div>

            {/* modal footer */}
            <div
              style={{
                padding: "14px 20px", borderTop: `1px solid ${C.border}`,
                display: "flex", justifyContent: "flex-end", gap: 10,
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  padding: "8px 16px", borderRadius: 7,
                  border: `1px solid ${C.border}`, background: "none",
                  color: C.textMuted, fontSize: 12, fontFamily: "Space Mono",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                onMouseEnter={(e) => { if (!saving) e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                style={{
                  padding: "8px 20px", borderRadius: 7,
                  background: `linear-gradient(135deg, ${C.accent}, #0e7490)`,
                  border: "none", color: "#fff",
                  fontSize: 12, fontFamily: "Space Mono", fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1, transition: "opacity 0.15s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {saving ? "Creating…" : <><Plus size={13} /> Create Project</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}