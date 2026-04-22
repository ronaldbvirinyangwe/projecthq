const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Reusable helper — fetches tasks WITH their subtasks for a project
const fetchTasksWithSubtasks = async (projectId) => {
  const { rows } = await pool.query(`
    SELECT t.*,
      (SELECT COALESCE(json_agg(s ORDER BY s.id), '[]')
       FROM subtasks s WHERE s.task_id = t.id) AS subtasks
    FROM tasks t
    WHERE t.project_id = $1
    ORDER BY t.created_at
  `, [projectId]);
  return rows;
};

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const { rows: projects } = await pool.query(`SELECT * FROM projects ORDER BY created_at DESC`);

    const result = await Promise.all(projects.map(async (p) => ({
      ...p,
      tasks:      await fetchTasksWithSubtasks(p.id),
      team:       (await pool.query(`SELECT * FROM team_members WHERE project_id = $1 ORDER BY name`, [p.id])).rows,
      milestones: (await pool.query(`SELECT * FROM milestones WHERE project_id = $1 ORDER BY date`, [p.id])).rows,
      comments:   (await pool.query(`SELECT * FROM comments WHERE project_id = $1 ORDER BY created_at`, [p.id])).rows,
    })));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`SELECT * FROM projects WHERE id = $1`, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });

    const p = rows[0];
    res.json({
      ...p,
      tasks:      await fetchTasksWithSubtasks(p.id),
      team:       (await pool.query(`SELECT * FROM team_members WHERE project_id = $1 ORDER BY name`, [p.id])).rows,
      milestones: (await pool.query(`SELECT * FROM milestones WHERE project_id = $1 ORDER BY date`, [p.id])).rows,
      comments:   (await pool.query(`SELECT * FROM comments WHERE project_id = $1 ORDER BY created_at`, [p.id])).rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST project  ← NEW
// Body: { name, description?, color?, status?, budget_total?, deadline? }
// Returns the full project shape (with empty tasks/team/milestones/comments)
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/projects', async (req, res) => {
  try {
    const {
      name,
      description  = '',
      color        = '#06b6d4',
      status       = 'In Progress',
      budget_total = 0,
      deadline     = null,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO projects
         (name, description, color, status, budget_total, budget_spent, deadline)
       VALUES ($1, $2, $3, $4, $5, 0, $6)
       RETURNING *`,
      [name.trim(), description.trim(), color, status, parseFloat(budget_total) || 0, deadline]
    );

    const p = rows[0];

    // Return in the same shape the frontend expects
    res.status(201).json({
      ...p,
      // Normalise budget into the nested shape the UI uses
      budget: {
        total: parseFloat(p.budget_total) || 0,
        spent: parseFloat(p.budget_spent) || 0,
      },
      tasks:      [],
      team:       [],
      milestones: [],
      comments:   [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH project (status, etc.)
app.patch('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const keys = Object.keys(fields);
    if (!keys.length) return res.status(400).json({ error: 'No fields provided' });

    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values     = keys.map((k) => fields[k]);

    const { rows } = await pool.query(
      `UPDATE projects SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST task
app.post('/api/tasks', async (req, res) => {
  try {
    const { project_id, title, status, assignee, priority, notes, deadline } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO tasks (project_id, title, status, assignee, priority, notes, deadline)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [project_id, title, status || 'todo', assignee || null, priority || 'medium', notes || null, deadline || null]
    );
    res.json({ ...rows[0], subtasks: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH task (title, status, priority, notes)
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const keys = Object.keys(fields);
    if (!keys.length) return res.status(400).json({ error: 'No fields provided' });

    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values     = keys.map((k) => fields[k]);

    const { rows } = await pool.query(
      `UPDATE tasks SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });

    const subtasks = (await pool.query(
      `SELECT * FROM subtasks WHERE task_id = $1 ORDER BY id`, [id]
    )).rows;
    res.json({ ...rows[0], subtasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM subtasks WHERE task_id = $1`, [id]);
    await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST subtask
app.post('/api/subtasks', async (req, res) => {
  try {
    const { task_id, title } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO subtasks (task_id, title, done) VALUES ($1,$2,false) RETURNING *`,
      [task_id, title]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH subtask (done, title)
app.patch('/api/subtasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const keys = Object.keys(fields);
    if (!keys.length) return res.status(400).json({ error: 'No fields provided' });

    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values     = keys.map((k) => fields[k]);

    const { rows } = await pool.query(
      `UPDATE subtasks SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE subtask
app.delete('/api/subtasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM subtasks WHERE id = $1`, [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH milestone (done)
app.patch('/api/milestones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { done } = req.body;
    const { rows } = await pool.query(
      `UPDATE milestones SET done = $1 WHERE id = $2 RETURNING *`,
      [done, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST comment
app.post('/api/comments', async (req, res) => {
  try {
    const { project_id, author, role, text } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO comments (project_id, author, role, text) VALUES ($1,$2,$3,$4) RETURNING *`,
      [project_id, author, role, text]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// pgvector: semantic search
app.post('/api/search', async (req, res) => {
  const { embedding } = req.body;
  const { rows } = await pool.query(
    `SELECT source_type, source_id, content,
     1 - (embedding <=> $1::vector) AS similarity
     FROM embeddings ORDER BY similarity DESC LIMIT 5`,
    [JSON.stringify(embedding)]
  );
  res.json(rows);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));