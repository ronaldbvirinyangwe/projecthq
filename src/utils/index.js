/** Returns 0-100 completion % for a task array. */
export const calcProgress = (tasks) => {
  if (!tasks.length) return 0;
  return Math.round(
    (tasks.filter((t) => t.status === "done").length / tasks.length) * 100
  );
};

/** Formats an ISO date string as "Apr 15, 2026". Returns "—" for empty values. */
export const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/** Formats a number as a USD dollar string, e.g. "$28,500". */
export const fmtMoney = (n) => "$" + n.toLocaleString();