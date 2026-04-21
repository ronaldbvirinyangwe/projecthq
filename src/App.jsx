import { useState, useEffect }                    from "react";
import { ClerkProvider, SignedIn, SignedOut,
         useUser, useClerk }                      from "@clerk/clerk-react";
import Dashboard     from "./components/Dashboard";
import ProjectDetail from "./components/ProjectDetail";
import * as api      from "./services/api";

const FONT_URL = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in your .env file");
}

// ── Redirect to hosted sign-in ─────────────────────────────────────────────
function AuthScreen() {
  useEffect(() => {
    window.location.href = "https://accounts.scalesai.online/sign-in";
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        background: "#070c16",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        color: "#94a3b8",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <div style={{
        width: 18, height: 18,
        border: "2px solid #22d3ee",
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ fontSize: 13 }}>Redirecting to sign-in…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Main app shell (only renders when signed in) ───────────────────────────
function AppShell() {
  const { user }                          = useUser();
  const { signOut }                       = useClerk();
  const [projects,      setProjects]      = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  useEffect(() => {
    api.fetchProjects()
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleProjectUpdate = (projectId, updaterFn) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? updaterFn(p) : p))
    );

  const makeApiUpdater = (projectId) => async (updaterFn) =>
    handleProjectUpdate(projectId, updaterFn);

  const handleTaskCreate = async (projectId, taskData) => {
    const newTask = await api.createTask({ project_id: projectId, ...taskData });
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, tasks: [...p.tasks, newTask] } : p
      )
    );
  };

  const handleTaskUpdate = async (projectId, taskId, fields) => {
    const updated = await api.updateTask(taskId, fields);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? updated : t)) }
          : p
      )
    );
  };

  const handleTaskDelete = async (projectId, taskId) => {
    await api.deleteTask(taskId);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) }
          : p
      )
    );
  };

  const handleMilestoneToggle = async (projectId, milestoneId, done) => {
    await api.toggleMilestone(milestoneId, done);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, milestones: p.milestones.map((m) => (m.id === milestoneId ? { ...m, done } : m)) }
          : p
      )
    );
  };

  const handleCommentAdd = async (projectId, commentData) => {
    const newComment = await api.createComment({ project_id: projectId, ...commentData });
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, comments: [...p.comments, newComment] }
          : p
      )
    );
  };

  if (loading) return (
    <div style={{ height: "100vh", background: "#070c16", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: "#94a3b8", fontFamily: "DM Sans" }}>
      <div style={{ width: 18, height: 18, border: "2px solid #22d3ee", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      Loading projects…
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ height: "100vh", background: "#070c16", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#f87171", fontFamily: "DM Sans" }}>
      <p style={{ fontSize: 16, fontWeight: 600 }}>Could not connect to API</p>
      <p style={{ fontSize: 13, color: "#94a3b8" }}>{error}</p>
      <button
        onClick={() => window.location.reload()}
        style={{ marginTop: 8, padding: "8px 20px", background: "#22d3ee20", border: "1px solid #22d3ee44", borderRadius: 8, color: "#22d3ee", cursor: "pointer", fontFamily: "DM Sans" }}
      >
        Retry
      </button>
    </div>
  );

  const project = projects.find((p) => p.id === activeProject);

  return (
    <>
      {project ? (
        <ProjectDetail
          project={project}
          onBack={() => setActiveProject(null)}
          onUpdate={makeApiUpdater(activeProject)}
          onTaskCreate={(data)          => handleTaskCreate(activeProject, data)}
          onTaskUpdate={(id, fields)    => handleTaskUpdate(activeProject, id, fields)}
          onTaskDelete={(id)            => handleTaskDelete(activeProject, id)}
          onMilestoneToggle={(id, done) => handleMilestoneToggle(activeProject, id, done)}
          onCommentAdd={(data)          => handleCommentAdd(activeProject, data)}
        />
      ) : (
        <Dashboard
          projects={projects}
          onProjectClick={setActiveProject}
          user={user}
          onSignOut={signOut}
        />
      )}
    </>
  );
}

// ── Root export ────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="https://accounts.scalesai.online/sign-in"
      signUpUrl="https://accounts.scalesai.online/sign-up"
      afterSignInUrl="https://projectmanager.scalesai.online"
      afterSignOutUrl="https://accounts.scalesai.online/sign-in"
    >
      <style>{`
        @import url('${FONT_URL}');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; height: 100%; background: #070c16; }
        ::-webkit-scrollbar       { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0a1628; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 2px; }
      `}</style>

      <SignedOut>
        <AuthScreen />
      </SignedOut>

      <SignedIn>
        <AppShell />
      </SignedIn>
    </ClerkProvider>
  );
}