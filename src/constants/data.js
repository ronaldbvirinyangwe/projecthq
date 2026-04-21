export const INITIAL_PROJECTS = [
  {
    id: "p2",
    name: "Chikoro AI — Student Learning App",
    description: "AI-powered mobile learning app with tutoring, quizzes, note summariser & study planner for students.",
    color: "#f59e0b",
    status: "In Progress",
    deadline: "2026-04-24",
    budget: { total: 0, spent: 0 },
    team: [
      { id: "t4", name: "Dev Lead",   role: "React Native / Expo",  initials: "DL" },
      { id: "t5", name: "AI Eng.",    role: "Chikoro AI Integration", initials: "AE" },
      { id: "t6", name: "UI/UX",      role: "Design System",         initials: "UX" },
      { id: "t7", name: "QA Lead",    role: "Testing & QA",          initials: "QA" },
    ],
    milestones: [
      { id: "m4", title: "Phase 1 — Foundation complete",      date: "2026-01-21", done: true  },
      { id: "m5", title: "Phase 2 — AI Core complete",         date: "2026-02-11", done: true  },
      { id: "m6", title: "Phase 3 — Learning Features complete", date: "2026-03-04", done: true  },
      { id: "m7", title: "Phase 4 — Analytics & Polish complete", date: "2026-03-18", done: true },
      { id: "m8", title: "Phase 5 — Beta & Store Launch",      date: "2026-05-15", done: false },
    ],
    tasks: [
      // ── Phase 1 — Foundation ──────────────────────────────────────────────
      {
        id: "tk5", title: "Phase 1 — Foundation", status: "done",
        assignee: "Dev Lead", priority: "high", deadline: "2026-01-21",
        subtasks: [
          { id: "s5a", title: "Project setup (Expo + TypeScript)", done: true },
          { id: "s5b", title: "Authentication (login, register, onboarding)", done: true },
          { id: "s5c", title: "Basic navigation & UI design system", done: true },
        ],
        notes: "Foundation complete. Expo + TypeScript scaffolding done, auth flows verified.",
      },
      // ── Phase 2 — AI Core ─────────────────────────────────────────────────
      {
        id: "tk6", title: "Phase 2 — AI Core", status: "done",
        assignee: "AI Eng.", priority: "high", deadline: "2026-02-11",
        subtasks: [
          { id: "s6a", title: "Chikoro AI API integration", done: true },
          { id: "s6b", title: "AI Tutor chat interface",    done: true },
          { id: "s6c", title: "Subject context & curriculum prompting", done: true },
        ],
        notes: "AI core fully integrated. Chikoro API responds correctly across all subject contexts.",
      },
      // ── Phase 3 — Learning Features ───────────────────────────────────────
      {
        id: "tk7", title: "Phase 3 — Learning Features", status: "done",
        assignee: "Dev Lead", priority: "high", deadline: "2026-03-04",
        subtasks: [
          { id: "s7a", title: "Quiz engine",       done: true },
          { id: "s7b", title: "Note summariser",   done: true },
          { id: "s7c", title: "Study planner",     done: true },
        ],
        notes: "All learning features shipped and tested with internal users.",
      },
      // ── Phase 4 — Analytics & Polish ──────────────────────────────────────
      {
        id: "tk8", title: "Phase 4 — Analytics & Polish", status: "done",
        assignee: "UI/UX", priority: "medium", deadline: "2026-03-18",
        subtasks: [
          { id: "s8a", title: "Progress dashboard",        done: true },
          { id: "s8b", title: "Push notifications",        done: true },
          { id: "s8c", title: "Performance optimisation",  done: true },
        ],
        notes: "Dashboard live. Push notifications working on iOS & Android. Lighthouse perf score improved.",
      },
      // ── Phase 5 — Testing & Launch ────────────────────────────────────────
      {
        id: "tk9", title: "Phase 5 — Beta Testing", status: "done",
        assignee: "QA Lead", priority: "high", deadline: "2026-04-15",
        subtasks: [
          { id: "s9a", title: "Beta testing with students", done: true },
          { id: "s9b", title: "Bug fixes",                  done: true },
        ],
        notes: "Beta completed with 40 students. All critical bugs resolved.",
      },
      {
        id: "tk10", title: "Google Play Store deployment", status: "todo",
        assignee: "Dev Lead", priority: "high", deadline: "2026-05-15",
        subtasks: [
          { id: "s10a", title: "Prepare store listing & screenshots", done: false },
          { id: "s10b", title: "Sign & build release APK / AAB",      done: false },
          { id: "s10c", title: "Submit to Google Play Console",       done: false },
          { id: "s10d", title: "Address review feedback",             done: false },
        ],
        notes: "Final step — awaiting submission.",
      },
      {
        id: "tk11", title: "Apple App Store deployment", status: "todo",
        assignee: "Dev Lead", priority: "high", deadline: "2026-05-15",
        subtasks: [
          { id: "s11a", title: "Prepare App Store listing & metadata", done: false },
          { id: "s11b", title: "Build & archive with Xcode",          done: false },
          { id: "s11c", title: "Submit via App Store Connect",        done: false },
          { id: "s11d", title: "Pass Apple review process",           done: false },
        ],
        notes: "Final step — awaiting submission.",
      },
    ],
    comments: [
      {
        id: "c2", author: "Supervisor", role: "supervisor",
        text: "Incredible progress — all 4 phases done in 11 weeks. Focus now is getting both store submissions across the line by May 15.",
        date: "2026-04-21",
      },
    ],
  },
  {
    id: "p5",
    name: "Chiremba AI — Medical Diagnostic Tool",
    description: "AI-powered radiology diagnostic tool for tumour detection and classification from DICOM imaging data.",
    color: "#34d399",
    status: "Planning",
    deadline: "2027-12-31",
    budget: { total: 4000, spent: 0 },
    team: [
      { id: "t13", name: "ML Lead",      role: "Model Training & Architecture", initials: "ML" },
      { id: "t14", name: "Radiologist",  role: "Annotation & Clinical Review",  initials: "RA" },
      { id: "t15", name: "Data Eng.",    role: "DICOM Pipeline & Curation",     initials: "DE" },
      { id: "t16", name: "Reg. Affairs", role: "FDA & Compliance",              initials: "RF" },
      { id: "t17", name: "Clin. Lead",   role: "Clinical Trials & Evidence",    initials: "CL" },
    ],
    milestones: [
      { id: "cm1", title: "Dataset curated & annotated (1 000+ scans)", date: "2026-09-30", done: false },
      { id: "cm2", title: "Model v1 — sensitivity & specificity benchmarks met", date: "2026-12-31", done: false },
      { id: "cm3", title: "FDA 510(k) / De Novo submission filed",       date: "2027-04-30", done: false },
      { id: "cm4", title: "Prospective clinical trial completed",        date: "2027-09-30", done: false },
      { id: "cm5", title: "Hospital PACS integration & go-live",         date: "2027-12-31", done: false },
    ],
    tasks: [
      // ── Milestone 1 — Data Collection & Curation ─────────────────────────
      {
        id: "ctk1", title: "M1 — Data Collection & Curation", status: "inprogress",
        assignee: "Data Eng.", priority: "high", deadline: "2026-04-24",
        subtasks: [
          { id: "cs1a", title: "Hospital data-sharing agreements (IRB / ethics approval)", done: true  },
          { id: "cs1b", title: "DICOM de-identification pipeline",                         done: true  },
          { id: "cs1c", title: "Scan diversity audit (machines, demographics)",            done: false },
          { id: "cs1d", title: "Board-certified radiologist annotation — batch 1",         done: false },
          { id: "cs1e", title: "Board-certified radiologist annotation — batch 2",         done: false },
          { id: "cs1f", title: "Dataset QA & inter-annotator agreement check",            done: false },
        ],
        notes: "Ethics approval and de-identification pipeline complete. Annotation of batch 1 underway with two radiologists.",
      },
      // ── Milestone 2 — Model Training & Benchmarking ───────────────────────
      {
        id: "ctk2", title: "M2 — Model Training & Benchmarking", status: "inprogress",
        assignee: "ML Lead", priority: "high", deadline: "2026-05-31",
        subtasks: [
          { id: "cs2a", title: "ResNet / U-Net architecture selection & baseline",  done: true },
          { id: "cs2b", title: "Training run v1 on curated dataset",               done: true },
          { id: "cs2c", title: "Sensitivity & specificity benchmarking",           done: false },
          { id: "cs2d", title: "Independent external validation set evaluation",   done: false },
          { id: "cs2e", title: "Model card & bias analysis report",                done: false },
        ],
        notes: "Blocked on dataset completion. Architecture spike (ResNet-50 vs U-Net) scheduled for Q3 2026.",
      },
      // ── Milestone 3 — Regulatory & Clinical Evidence ──────────────────────
      {
        id: "ctk3", title: "M3 — Regulatory Pathway (FDA SaMD)", status: "todo",
        assignee: "Reg. Affairs", priority: "high", deadline: "2027-04-30",
        subtasks: [
          { id: "cs3a", title: "Determine FDA pathway: 510(k) vs De Novo",         done: false },
          { id: "cs3b", title: "Pre-submission meeting with FDA",                   done: false },
          { id: "cs3c", title: "Compile clinical & analytical evidence package",   done: false },
          { id: "cs3d", title: "Submit 510(k) / De Novo application",              done: false },
          { id: "cs3e", title: "Respond to FDA review queries (~90–180 days)",     done: false },
        ],
        notes: "Regulatory strategy review scheduled once model benchmarks are confirmed.",
      },
      {
        id: "ctk4", title: "M3 — Prospective Clinical Trial", status: "todo",
        assignee: "Clin. Lead", priority: "high", deadline: "2027-09-30",
        subtasks: [
          { id: "cs4a", title: "Trial protocol design & IRB submission",            done: false },
          { id: "cs4b", title: "Site selection (2–3 hospital partners)",            done: false },
          { id: "cs4c", title: "Real-time clinical workflow integration for trial", done: false },
          { id: "cs4d", title: "Data collection & primary endpoint analysis",       done: false },
          { id: "cs4e", title: "Clinical evidence report & publication",            done: false },
        ],
        notes: "Prospective trial is required to demonstrate the AI improves clinician decision-making.",
      },
      // ── Milestone 4 — Deployment & Workflow Integration ───────────────────
      {
        id: "ctk5", title: "M4 — DICOM & PACS Integration", status: "todo",
        assignee: "Data Eng.", priority: "medium", deadline: "2027-12-31",
        subtasks: [
          { id: "cs5a", title: "DICOM listener & PACS connector development",      done: false },
          { id: "cs5b", title: "HL7 / FHIR interoperability layer",               done: false },
          { id: "cs5c", title: "Radiologist-facing overlay UI in PACS viewer",    done: false },
          { id: "cs5d", title: "Post-market surveillance & data drift monitoring", done: false },
        ],
        notes: "Integration design depends on pilot hospital's PACS vendor (likely Orthanc or Philips IntelliSpace).",
      },
    ],
    comments: [
      {
        id: "cc1", author: "Supervisor", role: "supervisor",
        text: "Critical path is the dataset — everything else is blocked until we have 1 000+ annotated scans. Prioritise hospital partnerships this quarter.",
        date: "2026-04-21",
      },
    ],
  },
];