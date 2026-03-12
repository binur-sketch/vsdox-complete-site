import nodemailer from 'nodemailer';
import { appConfig } from '../config/appConfig.js';

let transporter;
const hasCredentials = Boolean(appConfig.email.host && appConfig.email.user && appConfig.email.pass);

if (hasCredentials) {
  transporter = nodemailer.createTransport({
    host: appConfig.email.host,
    port: appConfig.email.port,
    secure: appConfig.email.secure,
    auth: {
      user: appConfig.email.user,
      pass: appConfig.email.pass,
    },
  });
} else {
  transporter = null;
}

export const sendPasswordResetEmail = async ({ to, token, expiresAt }) => {
  const subject = 'Reset your VSDox password';
  const text = [
    'A password reset request was received for your VSDox admin account.',
    `Please use the following token to reset your password: ${token}`,
    `Token expires: ${new Date(expiresAt).toLocaleString()}`,
    'If you did not request this, please ignore this email.',
  ].join('\n');

  if (!transporter) {
    console.log('Password reset token (not sent, missing SMTP):', { to, token, expiresAt });
    return;
  }

  await transporter.sendMail({
    from: appConfig.email.from,
    to,
    subject,
    text,
  });
};
