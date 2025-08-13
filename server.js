// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from "pg";
import jwt from 'jsonwebtoken';
import OpenAI from 'openai';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;
const openaiApiKey = process.env.OPENAI_API_KEY;

const app = express();
const PORT = 3005;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: "ianmclaren",
    host: "localhost",
    database: "edapp",
    password: "Murray1738",
    port: 5432,
  });

  app.post("/api/signup", async (req, res) => {
    const { firstname, lastname, username, email, password, role, school_id } = req.body;
  
    try {
      if (role === "teacher") {
        const result = await pool.query(
          `INSERT INTO teachers (first_name, last_name, username, email, password, school_id)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [firstname, lastname, username, email, password, school_id]
        );
        return res.status(201).json(result.rows[0]);
      } else if (role === "admin") {
        const result = await pool.query(
          `INSERT INTO admins (first_name, last_name, username, email, password, school_id)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [firstname, lastname, username, email, password, school_id]
        );
        return res.status(201).json(result.rows[0]);
      } else {
        return res.status(400).json({ error: "Invalid role selected" });
      }
    } catch (err) {
      console.error("Signup error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  

// ✅ Add this route for testing in the browser
app.get('/', (req, res) => {
  res.send('✅ Backend is up and running!');
});

// app.get('/api/test-db', async (req, res) => {
//     try {
//       const result = await pool.query('SELECT NOW()');
//       res.json({ success: true, time: result.rows[0].now });
//     } catch (err) {
//       console.error('❌ Database connection error:', err);
//       res.status(500).json({ success: false, message: 'DB connection failed' });
//     }
//   });



// Your login route
// app.post('/api/login', (req, res) => {
//   const { username, password } = req.body;

//   // TEMPORARY: Replace this with real DB logic later
//   if (username === 'admin' && password === 'password') {
//     return res.json({ token: 'fake-jwt-token-for-now' });
//   } else {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }
// });

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const teacherResult = await pool.query(
        "SELECT * FROM teachers WHERE username = $1 AND password = $2",
        [username, password]
      );
  
      if (teacherResult.rows.length > 0) {
        const teacher = teacherResult.rows[0];
  
        console.log("Teacher row from DB:", teacher);
  
  
        const token = jwt.sign(
          { user_id: teacher.teacher_id, role: "teacher" },
          SECRET_KEY,
          { expiresIn: "1h" } 
        );
  
        return res.status(200).json({ message: "Login successful!", token });
      } 
      
      const adminResult = await pool.query(
        "SELECT * FROM admins WHERE username = $1 AND password = $2",
        [username, password]
      );
  
      if (adminResult.rows.length > 0) {
        const admin = adminResult.rows[0];
        const token = jwt.sign(
          { user_id: admin.admin_id, role: "admin" },
          SECRET_KEY,
          { expiresIn: "1h" }
        );
      
        return res.status(200).json({ message: "Login successful!", token });
      } 
      
      res.status(401).json({ message: "Invalid username or password." });
  
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
    const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.status(401).json({ error: "No token provided" });
  
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
  
      req.user = {
        id: decoded.user_id,
        role: decoded.role,
      }; 
      next();
    });
  };

  app.post("/api/addstudent", authenticateToken, async (req, res) => {
    const { first_name, last_name } = req.body;
    const user_id = req.user.id;
    const role = req.user.role;
  
    try {
      let school_id;
  
      // 🔍 Determine school_id based on role
      if (role === "teacher") {
        const teacherRes = await pool.query(
          "SELECT school_id FROM teachers WHERE teacher_id = $1",
          [user_id]
        );
        if (teacherRes.rows.length === 0) {
          return res.status(404).json({ error: "Teacher not found" });
        }
        school_id = teacherRes.rows[0].school_id;
      } else if (role === "admin") {
        const adminRes = await pool.query(
          "SELECT school_id FROM admins WHERE admin_id = $1",
          [user_id]
        );
        if (adminRes.rows.length === 0) {
          return res.status(404).json({ error: "Admin not found" });
        }
        school_id = adminRes.rows[0].school_id;
      } else {
        return res.status(403).json({ error: "Unauthorized role" });
      }
  
      // 🔁 Check if student already exists (case-insensitive, trimmed)
      const existingStudentRes = await pool.query(
        `
        SELECT * FROM students
        WHERE LOWER(TRIM(first_name)) = LOWER(TRIM($1))
          AND LOWER(TRIM(last_name)) = LOWER(TRIM($2))
          AND school_id = $3
        `,
        [first_name, last_name, school_id]
      );
  
      let student;
      if (existingStudentRes.rows.length > 0) {
        student = existingStudentRes.rows[0];
      } else {
        const studentRes = await pool.query(
          `
          INSERT INTO students (first_name, last_name, school_id)
          VALUES ($1, $2, $3)
          RETURNING *
          `,
          [first_name, last_name, school_id]
        );
        student = studentRes.rows[0];
      }
  
      
      if (role === "teacher") {
        const alreadyLinked = await pool.query(
          `
          SELECT * FROM teacher_students
          WHERE teacher_id = $1 AND student_id = $2
          `,
          [user_id, student.student_id]
        );
  
        if (alreadyLinked.rows.length === 0) {
          await pool.query(
            `
            INSERT INTO teacher_students (teacher_id, student_id)
            VALUES ($1, $2)
            `,
            [user_id, student.student_id]
          );
        }
      }
  
      res.status(201).json({
        message: "Student added successfully",
        student,
      });
    } catch (err) {
      console.error("Error adding student:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/students", authenticateToken, async (req, res) => {
    const { id, role } = req.user;
  
    try {
      if (role === "teacher") {
        const result = await pool.query(
          `
          SELECT s.*
          FROM students s
          INNER JOIN teacher_students ts ON s.student_id = ts.student_id
          WHERE ts.teacher_id = $1
          `,
          [id]
        );
        return res.json(result.rows);
      }
  
      if (role === "admin") {
        const result = await pool.query(
          `
          SELECT *
          FROM students
          WHERE school_id = (SELECT school_id FROM admins WHERE admin_id = $1)
          `,
          [id]
        );
        return res.json(result.rows);
      }
  
      return res.status(403).json({ error: "Unauthorized" });
  
    } catch (err) {
      console.error("Error fetching students:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/schools", async (req, res) => {
    try {
      const result = await pool.query("SELECT school_id, name FROM schools");
      res.json(result.rows); 
    } catch (err) {
      console.error("Error fetching schools:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/observations", authenticateToken, async (req, res) => {
    const { student_id, observation_type, observation_text } = req.body;
    const { id: userId, role } = req.user;
  
    try {
      // Determine if the user is a teacher or admin
      let result;
      if (role === "teacher") {
        result = await pool.query(
          `INSERT INTO observations (student_id, teacher_id, observation_type, observation_text)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [student_id, userId, observation_type, observation_text]
        );
      } else if (role === "admin") {
        result = await pool.query(
          `INSERT INTO observations (student_id, admin_id, observation_type, observation_text)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [student_id, userId, observation_type, observation_text]
        );
      } else {
        return res.status(403).json({ error: "Unauthorized role" });
      }
  
      res.status(201).json({ message: "Observation submitted", observation: result.rows[0] });
    } catch (err) {
      console.error("Error submitting observation:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/observations/:studentId", authenticateToken, async (req, res) => {
    const { studentId } = req.params;
    const { id: userId, role } = req.user;
  
    try {
      let result;
  
      if (role === "teacher") {
       result = await pool.query(
        `
        SELECT 
          o.observation_id,
            o.observation_type,
            o.observation_text,
            o.created_at,
            t.first_name AS teacher_first_name,
            t.last_name AS teacher_last_name
          FROM observations o
          LEFT JOIN teachers t ON o.teacher_id = t.teacher_id
          WHERE o.student_id = $1 AND o.teacher_id = $2
          ORDER BY o.created_at DESC
        `,
        [studentId, userId]
      );
    } else if (role === "admin") {
      
      result = await pool.query(
        `
        SELECT 
          o.observation_id,
          o.observation_type,
          o.observation_text,
          o.created_at,
          t.first_name AS teacher_first_name,
          t.last_name AS teacher_last_name,
          a.first_name AS admin_first_name,
          a.last_name AS admin_last_name
        FROM observations o
        LEFT JOIN teachers t ON o.teacher_id = t.teacher_id
        LEFT JOIN admins a ON o.admin_id = a.admin_id
        WHERE o.student_id = $1
        ORDER BY o.created_at DESC
        `,
        [studentId]
      );
    } else {
      return res.status(403).json({ error: "Unauthorized role" });
    }
  
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching observations:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  app.get("/api/students/:id", authenticateToken, async (req, res) => {
    const studentId = req.params.id;
    const { id, role } = req.user;
  
    try {
      if (role === "teacher") {
        const result = await pool.query(
          `SELECT s.* FROM students s
           INNER JOIN teacher_students ts ON s.student_id = ts.student_id
           WHERE s.student_id = $1 AND ts.teacher_id = $2`,
          [studentId, id]
        );
  
        if (result.rows.length === 0) {
          return res.status(403).json({ error: "Not authorized to view this student" });
        }
  
        return res.json(result.rows[0]);
      }
  
      if (role === "admin") {
        const result = await pool.query(
          `SELECT * FROM students
           WHERE student_id = $1 AND school_id = (
             SELECT school_id FROM admins WHERE admin_id = $2
           )`,
          [studentId, id]
        );
  
        if (result.rows.length === 0) {
          return res.status(403).json({ error: "Not authorized to view this student" });
        }
  
        return res.json(result.rows[0]);
      }
  
      return res.status(403).json({ error: "Unauthorized" });
    } catch (err) {
      console.error("Error fetching student:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/observations/summary/:studentId", authenticateToken, async (req, res) => {

    const { studentId } = req.params;
    const { id: userId, role } = req.user;
  
    console.log(`SUMMARY ROUTE HIT for studentId: ${studentId} by userId: ${userId}, role: ${role}`);
  
    try {
      let result;
  
      if (role === "teacher") {
        result = await pool.query(
          `
          SELECT observation_type, observation_text
          FROM observations
          WHERE student_id = $1 AND teacher_id = $2
          `,
          [studentId, userId]
        );
      } else if (role === "admin") {
        result = await pool.query(
          `
          SELECT observation_type, observation_text
          FROM observations
          WHERE student_id = $1
          `,
          [studentId]
        );
      } else {
        return res.status(403).json({ error: "Unauthorized" });
      }
  
      const observations = result.rows;
      console.log("Observations for summary:", observations);
  
      // Group observations by type
      const grouped = {
        academic: [],
        social_emotional: [],
        behavioral: [],
      };
  
      observations.forEach((obs) => {
        const type = obs.observation_type.toLowerCase();
        if (grouped[type]) grouped[type].push(obs.observation_text);
      });
  
      // Generate summaries for each type using OpenAI
      const summaries = {};
  
      for (const type in grouped) {
        const texts = grouped[type];
        if (texts.length === 0) {
          summaries[type] = "No observations available.";
          continue;
        }
  
        const prompt = `Summarize the following ${type.replace("_", " ")} observations:\n` +
          texts.map((t, i) => `${i + 1}. ${t}`).join("\n");
  
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        });
  
        summaries[type] = completion.choices[0].message.content;
      }
  
      res.json({ summaries });
    } catch (err) {
      console.error("Error generating summary:", err.message, err.stack);
  res.status(500).json({ error: "Failed to generate summaries", details: err.message });
    }
  });
  
  

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:3005`);
});