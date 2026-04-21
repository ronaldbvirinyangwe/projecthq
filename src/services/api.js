const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const req = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

/** Transform DB row → shape the components expect */
const normalize = (p) => ({
  ...p,
  budget: {
    total: Number(p.budget_total) || 0,
    spent: Number(p.budget_spent) || 0,
  },
  tasks:      (p.tasks      || []).map(normalizeTask),
  team:       p.team        || [],
  milestones: p.milestones  || [],
  comments:   (p.comments   || []).map(normalizeComment),
});

const normalizeTask = (t) => ({
  ...t,
  subtasks: t.subtasks || [],
});

const normalizeComment = (c) => ({
  ...c,
  date: c.created_at ? c.created_at.split("T")[0] : c.date,
});

// ── Projects ────────────────────────────────────────────────────────────────
export const fetchProjects = async () => {
  const rows = await req("/api/projects");
  return rows.map(normalize);
};

export const fetchProject = async (id) => {
  const row = await req(`/api/projects/${id}`);
  return normalize(row);
};

export const updateProject = async (id, fields) =>
  req(`/api/projects/${id}`, { method: "PATCH", body: JSON.stringify(fields) });

// ── Tasks ───────────────────────────────────────────────────────────────────
export const createTask = async (task) => {
  const row = await req("/api/tasks", { method: "POST", body: JSON.stringify(task) });
  return normalizeTask(row);
};

export const updateTask = async (id, fields) => {
  const row = await req(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(fields) });
  return normalizeTask(row);
};

export const deleteTask = async (id) =>
  req(`/api/tasks/${id}`, { method: "DELETE" });

// ── Subtasks ─────────────────────────────────────────────────────────────────
export const createSubtask = async (subtask) =>
  req("/api/subtasks", { method: "POST", body: JSON.stringify(subtask) });

export const updateSubtask = async (id, fields) =>
  req(`/api/subtasks/${id}`, { method: "PATCH", body: JSON.stringify(fields) });

export const deleteSubtask = async (id) =>
  req(`/api/subtasks/${id}`, { method: "DELETE" });

// ── Milestones ───────────────────────────────────────────────────────────────
export const toggleMilestone = async (id, done) =>
  req(`/api/milestones/${id}`, { method: "PATCH", body: JSON.stringify({ done }) });

// ── Comments ─────────────────────────────────────────────────────────────────
export const createComment = async (comment) => {
  const row = await req("/api/comments", { method: "POST", body: JSON.stringify(comment) });
  return normalizeComment(row);
};