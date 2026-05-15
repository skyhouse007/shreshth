import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!host || !user || !pass) {
    return null;
  }
  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: { user, pass },
  });
  return transporter;
}

export async function sendInquiryEmail({ subject, html, text }) {
  const t = getTransporter();
  const to = process.env.EMAIL_TO || process.env.EMAIL_USER;
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  if (!t || !to) {
    console.info('[email stub] Would send inquiry email:', { subject, to: to || '(not configured)' });
    return { sent: false, stub: true };
  }
  await t.sendMail({ from, to, subject, text, html });
  return { sent: true };
}
