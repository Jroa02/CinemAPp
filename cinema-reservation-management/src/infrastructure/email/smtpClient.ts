import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com', // Servidor SMTP de AWS SES
  port: 587, // Puerto SMTP (587 para TLS)
  secure: false, // Usar TLS
  auth: {
    user: process.env.SMTP_USERNAME!, // Nombre de usuario SMTP
    pass: process.env.SMTP_PASSWORD!, // Contraseña SMTP
  },
});

export default transporter;