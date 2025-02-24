import transporter from './smtpClient';

export const sendEmail = async (
  to: string,
  subject: string,
  body: string
): Promise<void> => {
  const mailOptions = {
    from: 'juanrao2301@gmail.com',
    to, 
    subject, 
    text: body,
    /*
    html: "<h1>Hola</h1><p>Este es un correo HTML.</p>",
    */
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
  } catch (error) {
    console.error('Error enviando el correo:', error);
    throw new Error('Failed to send email');
  }
};