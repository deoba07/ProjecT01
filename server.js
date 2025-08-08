const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve apply.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'apply.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { username,email, password, address, sor, dob, tel, gender, country, Status, position } = req.body;

  if (!username ||!email || !address || !tel || !gender || !country || !position) {
    return res.status(400).send('Missing required fields');
  }

  // Save to file
  const folderPath = path.join(__dirname, 'submissions');
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

  const fileName = `${Date.now()}_${username.replace(/\s+/g, '_')}.txt`;
  const filePath = path.join(folderPath, fileName);
  const fileContent = `
Username: ${username}
Email:${email}
Password: ${password}
Address: ${address}
sor: ${sor}
DOB: ${dob}
Phone: ${tel}
Gender: ${gender}
Country: ${country}
Marital Status: ${Status}
Position: ${position}
-----------------------------------
`;

  fs.writeFileSync(filePath, fileContent);

  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'blessingw317@gmail.com', // replace
      pass: 'nmvb tyiy rpli kuuf' // Gmail app password
    }
  });

  const mailOptions = {
  from: 'consultingbordtech@gmail.com', // ✅ Company's email (sender)
  to: email, // ✅ Get this from the form submission
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
      return res.status(500).json({success:false,message:'Email failed to send'});
    }
    console.log('Email sent:', info.response);
    res.json({ success: true, message: 'Application submitted successfully!' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
