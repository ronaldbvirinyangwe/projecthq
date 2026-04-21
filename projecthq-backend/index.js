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

app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { rows } = await pool.query('UPDATE tasks SET status=$1 WHERE id=$2 RETURNING *', [status, id]);
  res.json(rows[0]);
});

// POST comment
app.post('/api/comments', async (req, res) => {
  const { project_id, author, role, text } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO comments (project_id, author, role, text) VALUES ($1,$2,$3,$4) RETURNING *',
    [project_id, author, role, text]
  );
  res.json(rows[0]);
});

// pgvector: semantic search
app.post('/api/search', async (req, res) => {
  const { embedding } = req.body; // float array from Claude/OpenAI
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