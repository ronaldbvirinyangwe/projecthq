export const KANBAN_COLS = [
  { id: "todo",       label: "To Do",       color: "#475569" },
  { id: "inprogress", label: "In Progress", color: "#22d3ee" },
  { id: "review",     label: "In Review",   color: "#f59e0b" },
  { id: "done",       label: "Done",        color: "#34d399" },
];

export const PRIORITY_COLORS = {
  high:   "#f87171",
  medium: "#f59e0b",
  low:    "#34d399",
};

export const STATUS_META = {
  "In Progress": { color: "#22d3ee", bg: "#0a2535" },
  Planning:      { color: "#a78bfa", bg: "#1e1535" },
  "On Hold":     { color: "#f59e0b", bg: "#261e08" },
  Completed:     { color: "#34d399", bg: "#0a2520" },
};