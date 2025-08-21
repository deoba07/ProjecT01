require('dotenv').config(); // Load env variables

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve apply.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'apply.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const { username, email, password, address, sor, dob, tel, gender, country, Status, position } = req.body;

  if (!username || !email || !address || !tel || !gender || !country || !position) {
    return res.status(400).send('Missing required fields');
  }

  try {
    await pool.query(
      `INSERT INTO submissions
       (username, email, password, address, sor, dob, tel, gender, country, status, position)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [username, email, password, address, sor, dob, tel, gender, country, Status, position]
    );
    console.log("Submission saved to PostgreSQL");
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).send("Error saving submission");
  }

  // Send confirmation email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: 'consultingbordtech@gmail.com',
    to: email,
    subject: 'Your Application Has Been Received',
    text: `Dear ${username},

Thank you for applying to ConsultingBord Tech Groups.

We have received your application for the position of ${position}.
Our team will review your submission and get back to you shortly.

Best regards,  
ConsultingBord Tech Groups`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Email error:', err);
      return res.status(500).json({ success: false, message: 'Email failed to send' });
    }
    console.log('Email sent:', info.response);
    res.json({ success: true, message: 'Application submitted successfully!' });
  });
});

// API endpoint to get all submissions
app.get('/submissions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM submissions ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});





// Backup all submissions
app.get('/backup', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM submissions ORDER BY id ASC');
    res.json({ submissions: result.rows });
  } catch (err) {
    console.error('Error backing up submissions:', err);
    res.status(500).json({ error: 'Failed to backup submissions' });
  }
});


// Restore submissions (auto-create table if not exists)
app.post('/restore', async (req, res) => {
  const { submissions } = req.body;

  if (!submissions || !Array.isArray(submissions)) {
    return res.status(400).json({ error: 'Invalid backup data format' });
  }

  try {
    // 1. Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        username TEXT,
        email TEXT,
        password TEXT,
        address TEXT,
        sor TEXT,
        dob TEXT,
        tel TEXT,
        gender TEXT,
        country TEXT,
        status TEXT,
        position TEXT
      );
    `);

    // 2. Clear existing data
    await pool.query('DELETE FROM submissions');

    // 3. Reinsert data from backup (let SERIAL auto-generate IDs)
    for (const sub of submissions) {
      await pool.query(
        `INSERT INTO submissions
         (username, email, password, address, sor, dob, tel, gender, country, status, position)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          sub.username,
          sub.email,
          sub.password,
          sub.address,
          sub.sor,
          sub.dob,
          sub.tel,
          sub.gender,
          sub.country,
          sub.status,
          sub.position
        ]
      );
    }

    // ✅ Success response
    res.json({ message: 'Submissions table recreated and data restored successfully!' });

  } catch (err) {
    console.error('Error restoring submissions:', err);
    res.status(500).json({ error: 'Failed to restore submissions' });
  }
});




// Start server once
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
