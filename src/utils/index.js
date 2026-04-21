/** Returns 0-100 completion % for a task array. */
export const calcTaskProgress = (task) => {
  const subs = task.subtasks || [];
  if (subs.length === 0) {
    return task.status === "done" ? 100 : 0;
  }
  const doneCount = subs.filter((s) => s.done).length;
  return Math.round((doneCount / subs.length) * 100);
};

/** * Returns 0-100 completion % for a project by averaging all task progress.
 */
export const calcProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const total = tasks.reduce((acc, task) => acc + calcTaskProgress(task), 0);
  return Math.round(total / tasks.length);
};

export const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const fmtMoney = (n) => "$" + (n || 0).toLocaleString();

export const calcBudgetPct = (spent, total) => {
  if (!total || total === 0) return 0;
  return Math.round((spent / total) * 100);
};