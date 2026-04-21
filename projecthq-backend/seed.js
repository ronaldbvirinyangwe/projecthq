const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const PROJECTS = [
  {
    name: "Chikoro AI — Student Learning App",
    description: "AI-powered mobile learning app with tutoring, quizzes, note summariser & study planner for students.",
    color: "#f59e0b", status: "In Progress",
    deadline: "2026-04-24", budget_total: 0, budget_spent: 0,
    team: [
      { name: "Dev Lead",  role: "React Native / Expo",      initials: "DL" },
      { name: "AI Eng.",   role: "Chikoro AI Integration",    initials: "AE" },
      { name: "UI/UX",     role: "Design System",             initials: "UX" },
      { name: "QA Lead",   role: "Testing & QA",              initials: "QA" },
    ],
    milestones: [
      { title: "Phase 1 — Foundation complete",          date: "2026-01-21", done: true  },
      { title: "Phase 2 — AI Core complete",             date: "2026-02-11", done: true  },
      { title: "Phase 3 — Learning Features complete",   date: "2026-03-04", done: true  },
      { title: "Phase 4 — Analytics & Polish complete",  date: "2026-03-18", done: true  },
      { title: "Phase 5 — Beta & Store Launch",          date: "2026-05-15", done: false },
    ],
    tasks: [
      { title: "Phase 1 — Foundation",          status: "done",       assignee: "Dev Lead", priority: "high",   deadline: "2026-01-21", notes: "Foundation complete. Expo + TypeScript scaffolding done, auth flows verified.",
        subtasks: [
          { title: "Project setup (Expo + TypeScript)",              done: true  },
          { title: "Authentication (login, register, onboarding)",   done: true  },
          { title: "Basic navigation & UI design system",            done: true  },
        ]},
      { title: "Phase 2 — AI Core",             status: "done",       assignee: "AI Eng.", priority: "high",   deadline: "2026-02-11", notes: "AI core fully integrated. Chikoro API responds correctly across all subject contexts.",
        subtasks: [
          { title: "Chikoro AI API integration",               done: true },
          { title: "AI Tutor chat interface",                  done: true },
          { title: "Subject context & curriculum prompting",   done: true },
        ]},
      { title: "Phase 3 — Learning Features",   status: "done",       assignee: "Dev Lead", priority: "high",   deadline: "2026-03-04", notes: "All learning features shipped and tested with internal users.",
        subtasks: [
          { title: "Quiz engine",     done: true },
          { title: "Note summariser", done: true },
          { title: "Study planner",   done: true },
        ]},
      { title: "Phase 4 — Analytics & Polish",  status: "done",       assignee: "UI/UX",   priority: "medium", deadline: "2026-03-18", notes: "Dashboard live. Push notifications working on iOS & Android.",
        subtasks: [
          { title: "Progress dashboard",       done: true },
          { title: "Push notifications",       done: true },
          { title: "Performance optimisation", done: true },
        ]},
      { title: "Phase 5 — Beta Testing",        status: "done",       assignee: "QA Lead",  priority: "high",   deadline: "2026-04-15", notes: "Beta completed with 40 students. All critical bugs resolved.",
        subtasks: [
          { title: "Beta testing with students", done: true },
          { title: "Bug fixes",                  done: true },
        ]},
      { title: "Google Play Store deployment",   status: "todo",       assignee: "Dev Lead", priority: "high",   deadline: "2026-05-15", notes: "Final step — awaiting submission.",
        subtasks: [
          { title: "Prepare store listing & screenshots", done: false },
          { title: "Sign & build release APK / AAB",      done: false },
          { title: "Submit to Google Play Console",        done: false },
          { title: "Address review feedback",              done: false },
        ]},
      { title: "Apple App Store deployment",     status: "todo",       assignee: "Dev Lead", priority: "high",   deadline: "2026-05-15", notes: "Final step — awaiting submission.",
        subtasks: [
          { title: "Prepare App Store listing & metadata", done: false },
          { title: "Build & archive with Xcode",           done: false },
          { title: "Submit via App Store Connect",         done: false },
          { title: "Pass Apple review process",            done: false },
        ]},
    ],
    comments: [
      { author: "Supervisor", role: "supervisor", date: "2026-04-21",
        text: "Incredible progress — all 4 phases done in 11 weeks. Focus now is getting both store submissions across the line by May 15." },
    ],
  },
  {
    name: "Chiremba AI — Medical Diagnostic Tool",
    description: "AI-powered radiology diagnostic tool for tumour detection and classification from DICOM imaging data.",
    color: "#34d399", status: "Planning",
    deadline: "2027-12-31", budget_total: 4000, budget_spent: 0,
    team: [
      { name: "ML Lead",      role: "Model Training & Architecture", initials: "ML" },
      { name: "Radiologist",  role: "Annotation & Clinical Review",  initials: "RA" },
      { name: "Data Eng.",    role: "DICOM Pipeline & Curation",     initials: "DE" },
      { name: "Reg. Affairs", role: "FDA & Compliance",              initials: "RF" },
      { name: "Clin. Lead",   role: "Clinical Trials & Evidence",    initials: "CL" },
    ],
    milestones: [
      { title: "Dataset curated & annotated (1 000+ scans)",          date: "2026-09-30", done: false },
      { title: "Model v1 — sensitivity & specificity benchmarks met", date: "2026-12-31", done: false },
      { title: "FDA 510(k) / De Novo submission filed",               date: "2027-04-30", done: false },
      { title: "Prospective clinical trial completed",                date: "2027-09-30", done: false },
      { title: "Hospital PACS integration & go-live",                 date: "2027-12-31", done: false },
    ],
    tasks: [
      { title: "M1 — Data Collection & Curation",    status: "inprogress", assignee: "Data Eng.",    priority: "high",   deadline: "2026-04-24", notes: "Ethics approval and de-identification pipeline complete. Annotation of batch 1 underway.",
        subtasks: [
          { title: "Hospital data-sharing agreements (IRB / ethics approval)", done: true  },
          { title: "DICOM de-identification pipeline",                         done: true  },
          { title: "Scan diversity audit (machines, demographics)",            done: false },
          { title: "Board-certified radiologist annotation — batch 1",         done: false },
          { title: "Board-certified radiologist annotation — batch 2",         done: false },
          { title: "Dataset QA & inter-annotator agreement check",            done: false },
        ]},
      { title: "M2 — Model Training & Benchmarking", status: "inprogress", assignee: "ML Lead",      priority: "high",   deadline: "2026-05-31", notes: "Blocked on dataset completion. Architecture spike scheduled for Q3 2026.",
        subtasks: [
          { title: "ResNet / U-Net architecture selection & baseline", done: true  },
          { title: "Training run v1 on curated dataset",              done: true  },
          { title: "Sensitivity & specificity benchmarking",          done: false },
          { title: "Independent external validation set evaluation",  done: false },
          { title: "Model card & bias analysis report",               done: false },
        ]},
      { title: "M3 — Regulatory Pathway (FDA SaMD)",  status: "todo",       assignee: "Reg. Affairs", priority: "high",   deadline: "2027-04-30", notes: "Regulatory strategy review scheduled once model benchmarks are confirmed.",
        subtasks: [
          { title: "Determine FDA pathway: 510(k) vs De Novo",       done: false },
          { title: "Pre-submission meeting with FDA",                 done: false },
          { title: "Compile clinical & analytical evidence package",  done: false },
          { title: "Submit 510(k) / De Novo application",            done: false },
          { title: "Respond to FDA review queries (~90–180 days)",   done: false },
        ]},
      { title: "M3 — Prospective Clinical Trial",    status: "todo",       assignee: "Clin. Lead",   priority: "high",   deadline: "2027-09-30", notes: "Prospective trial is required to demonstrate the AI improves clinician decision-making.",
        subtasks: [
          { title: "Trial protocol design & IRB submission",            done: false },
          { title: "Site selection (2–3 hospital partners)",            done: false },
          { title: "Real-time clinical workflow integration for trial", done: false },
          { title: "Data collection & primary endpoint analysis",       done: false },
          { title: "Clinical evidence report & publication",            done: false },
        ]},
      { title: "M4 — DICOM & PACS Integration",      status: "todo",       assignee: "Data Eng.",    priority: "medium", deadline: "2027-12-31", notes: "Integration design depends on pilot hospital's PACS vendor.",
        subtasks: [
          { title: "DICOM listener & PACS connector development",      done: false },
          { title: "HL7 / FHIR interoperability layer",               done: false },
          { title: "Radiologist-facing overlay UI in PACS viewer",    done: false },
          { title: "Post-market surveillance & data drift monitoring", done: false },
        ]},
    ],
    comments: [
      { author: "Supervisor", role: "supervisor", date: "2026-04-21",
        text: "Critical path is the dataset — everything else is blocked until we have 1 000+ annotated scans. Prioritise hospital partnerships this quarter." },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  for (const project of PROJECTS) {
    // Insert project — let DB generate UUID
    const { rows: [p] } = await pool.query(`
      INSERT INTO projects (name, description, color, status, deadline, budget_total, budget_spent)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id
    `, [project.name, project.description, project.color,
        project.status, project.deadline, project.budget_total, project.budget_spent]);

    const projectId = p.id;

    // Team members
    for (const m of project.team) {
      await pool.query(
        `INSERT INTO team_members (project_id, name, role, initials) VALUES ($1,$2,$3,$4)`,
        [projectId, m.name, m.role, m.initials]
      );
    }

    // Milestones
    for (const m of project.milestones) {
      await pool.query(
        `INSERT INTO milestones (project_id, title, date, done) VALUES ($1,$2,$3,$4)`,
        [projectId, m.title, m.date, m.done]
      );
    }

    // Tasks + subtasks
    for (const t of project.tasks) {
      const { rows: [task] } = await pool.query(`
        INSERT INTO tasks (project_id, title, status, assignee, priority, deadline, notes)
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id
      `, [projectId, t.title, t.status, t.assignee, t.priority, t.deadline, t.notes]);

      for (const s of t.subtasks) {
        await pool.query(
          `INSERT INTO subtasks (task_id, title, done) VALUES ($1,$2,$3)`,
          [task.id, s.title, s.done]
        );
      }
    }

    // Comments
    for (const c of project.comments) {
      await pool.query(
        `INSERT INTO comments (project_id, author, role, text, created_at) VALUES ($1,$2,$3,$4,$5)`,
        [projectId, c.author, c.role, c.text, c.date]
      );
    }

    console.log(`  ✅ ${project.name}`);
  }

  console.log("✅ Seed complete!");
  await pool.end();
}

seed().catch((e) => { console.error(e); process.exit(1); });