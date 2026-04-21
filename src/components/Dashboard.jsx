import { Activity, Check, ChevronRight, DollarSign, Calendar, LayoutDashboard } from "lucide-react";

import { C } from "../constants/colors.js";
import { STATUS_META } from "../constants/kanban.js";
import { calcProgress, fmtDate, fmtMoney } from "../utils";
import Av from "./ui/Av.jsx";
import Bar from "./ui/Bar.jsx";
import Chip from "./ui/Chip.jsx";

/**
 * Dashboard – overview grid of all projects.
 *
 * Props:
 *   projects       – project[]
 *   onProjectClick – (projectId: string) => void
 */
export default function Dashboard({ projects, onProjectClick }) {
  const totalTasks  = projects.reduce((s, p) => s + p.tasks.length, 0);
  const doneTasks   = projects.reduce((s, p) => s + p.tasks.filter((t) => t.status === "done").length, 0);
  const totalBudget = projects.reduce((s, p) => s + p.budget.total, 0);
  const spentBudget = projects.reduce((s, p) => s + p.budget.spent, 0);

  const stats = [
    { label: "Total Projects", val: projects.length,                                    color: C.accent,   icon: <LayoutDashboard size={15} /> },
    { label: "In Progress",    val: projects.filter((p) => p.status === "In Progress").length, color: "#f59e0b", icon: <Activity size={15} /> },
    { label: "Tasks Done",     val: `${doneTasks}/${totalTasks}`,                       color: C.emerald,  icon: <Check size={15} /> },
    { label: "Budget Spent",   val: fmtMoney(spentBudget), sub: `of ${fmtMoney(totalBudget)}`, color: "#a78bfa", icon: <DollarSign size={15} /> },
  ];

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
                  <p
                    style={{
                      fontSize: 10, color: C.textMuted, textTransform: "uppercase",
                      letterSpacing: "0.7px", fontFamily: "Space Mono", marginBottom: 8,
                    }}
                  >
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

        {/* Section title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 800, letterSpacing: "-0.2px" }}>
            Active Projects
          </h2>
          <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "Space Mono" }}>
            Click any project to open
          </span>
        </div>

        {/* Project cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {projects.map((p) => {
            const progress  = calcProgress(p.tasks);
            const budgetPct = Math.round((p.budget.spent / p.budget.total) * 100);
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
                {/* decorative circle */}
                <div
                  style={{
                    position: "absolute", top: -20, right: -20, width: 90, height: 90,
                    borderRadius: "50%", background: p.color + "07", pointerEvents: "none",
                  }}
                />

                {/* card header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 800, marginBottom: 4, letterSpacing: "-0.2px" }}>
                      {p.name}
                    </h3>
                    <p style={{ fontSize: 11, color: C.textSub, lineHeight: 1.4 }}>{p.description}</p>
                  </div>
                  <Chip label={p.status} color={sm.color} bg={sm.bg} />
                </div>

                {/* progress bar */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "Space Mono", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                      Progress
                    </span>
                    <span style={{ fontSize: 11, fontFamily: "Space Mono", color: p.color, fontWeight: 700 }}>
                      {progress}%
                    </span>
                  </div>
                  <Bar value={progress} color={p.color} h={6} />
                </div>

                {/* task counts + budget */}
                <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-end" }}>
                  {[
                    { label: "Done",   val: p.tasks.filter((t) => t.status === "done").length,       color: C.emerald },
                    { label: "Active", val: p.tasks.filter((t) => t.status === "inprogress").length, color: C.accent  },
                    { label: "Total",  val: p.tasks.length,                                          color: C.textSub },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: "Space Mono", fontSize: 15, fontWeight: 700, color: s.color }}>
                        {s.val}
                      </p>
                      <p style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                        {s.label}
                      </p>
                    </div>
                  ))}

                  <div style={{ width: 1, background: C.border, alignSelf: "stretch" }} />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                        Budget
                      </span>
                      <span style={{ fontSize: 10, fontFamily: "Space Mono", color: budgetPct > 85 ? "#f87171" : C.textSub }}>
                        {budgetPct}%
                      </span>
                    </div>
                    <Bar value={budgetPct} color={budgetPct > 85 ? "#f87171" : C.emerald} h={4} />
                    <p style={{ fontSize: 10, color: C.textMuted, fontFamily: "Space Mono", marginTop: 3 }}>
                      {fmtMoney(p.budget.spent)} / {fmtMoney(p.budget.total)}
                    </p>
                  </div>
                </div>

                {/* footer: team avatars + deadline */}
                <div
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: 12, borderTop: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ display: "flex" }}>
                    {p.team.slice(0, 4).map((m, i) => (
                      <div key={m.id} style={{ marginLeft: i > 0 ? -6 : 0, zIndex: 4 - i }}>
                        <Av initials={m.initials} color={p.color} size={24} />
                      </div>
                    ))}
                    {p.team.length > 4 && (
                      <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 6 }}>
                        +{p.team.length - 4}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        fontSize: 10, color: C.textMuted, fontFamily: "Space Mono",
                        display: "flex", alignItems: "center", gap: 3,
                      }}
                    >
                      <Calendar size={10} />
                      {fmtDate(p.deadline).slice(0, -6)}
                    </span>
                    <span
                      style={{
                        fontSize: 12, color: p.color, fontWeight: 600,
                        display: "flex", alignItems: "center", gap: 3,
                      }}
                    >
                      Open <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}