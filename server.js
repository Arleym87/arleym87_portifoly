const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DEST_EMAIL = process.env.DEST_EMAIL || 'arleymoreira.am@gmail.com';

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn('Atenção: SMTP_USER ou SMTP_PASS não está configurado. O envio de e-mail não funcionará até isso ser definido.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Erro de configuração do SMTP:', error.message);
  } else {
    console.log('Servidor SMTP pronto para enviar emails.');
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Por favor, preencha todos os campos.'
    });
  }

  const mailOptions = {
    from: `${name} <${email}>`,
    to: DEST_EMAIL,
    subject: `Contato pelo site de ${name}`,
    text: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`,
    html: `<p><strong>Nome:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Mensagem:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email enviado para', DEST_EMAIL);
    res.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Em breve entrarei em contato.'
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao enviar mensagem. Tente novamente mais tarde.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
