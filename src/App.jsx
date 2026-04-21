import { useState, useEffect } from "react";

import { C, FONT_URL } from "./constants/colors.js";
import { INITIAL_PROJECTS } from "./constants/data.js";
import Dashboard from "./components/Dashboard.jsx";
import ProjectDetail from "./components/ProjectDetail.jsx";

/**
 * App – top-level shell.
 * Owns the projects state and the active-project router.
 */
export default function App() {
  const [projects,      setProjects]      = useState(INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState(null); // project id | null

  // ── persistence ──────────────────────────────────────────────────────────
  useEffect(() => {
    window.storage
      ?.get("pm-projects")
      .then((r) => { if (r?.value) setProjects(JSON.parse(r.value)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    window.storage?.set("pm-projects", JSON.stringify(projects)).catch(() => {});
  }, [projects]);

  // ── mutations ─────────────────────────────────────────────────────────────
  const updateProject = (id, updaterFn) =>
    setProjects((prev) => prev.map((p) => (p.id === id ? updaterFn(p) : p)));

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('${FONT_URL}');

        html, body, #root {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          background: ${C.bg};
          overflow: hidden;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar       { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0a1628; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 2px; }
      `}</style>

      {activeProject ? (
        <ProjectDetail
          project={projects.find((p) => p.id === activeProject)}
          onBack={() => setActiveProject(null)}
          onUpdate={(updaterFn) => updateProject(activeProject, updaterFn)}
        />
      ) : (
        <Dashboard
          projects={projects}
          onProjectClick={setActiveProject}
        />
      )}
    </>
  );
}