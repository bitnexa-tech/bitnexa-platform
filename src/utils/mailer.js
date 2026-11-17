const nodemailer = require('nodemailer');

// Configure transporter if SMTP credentials are provided
let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: parseInt(process.env.SMTP_PORT, 10) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send OTP via Email or log to console in development mode
 * @param {string} toEmail 
 * @param {string} otp 
 * @param {string} recipientName 
 */
async function sendOtpEmail(toEmail, otp, recipientName = 'User') {
  const fromHeader = process.env.EMAIL_FROM || '"WorkFlow Hub" <no-reply@agency.com>';
  
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #f8fafc; }
        .card { max-width: 480px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .logo { font-size: 24px; font-weight: 800; color: #38bdf8; text-align: center; margin-bottom: 24px; letter-spacing: -0.5px; }
        .title { font-size: 20px; font-weight: 700; color: #ffffff; text-align: center; margin-bottom: 12px; }
        .text { font-size: 14px; line-height: 1.6; color: #94a3b8; text-align: center; margin-bottom: 24px; }
        .otp-box { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; font-size: 36px; font-weight: 800; letter-spacing: 10px; text-align: center; padding: 18px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.4); }
        .notice { font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #334155; padding-top: 20px; }
        .badge { display: inline-block; background: #0369a1; color: #bae6fd; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 9999px; margin-bottom: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">⚡ WorkFlow Agency</div>
        <div style="text-align: center;"><span class="badge">SECURE VERIFICATION</span></div>
        <div class="title">Hello ${recipientName || 'there'},</div>
        <div class="text">Use the one-time verification code below to securely log into your agency portal account. Valid for 10 minutes.</div>
        <div class="otp-box">${otp}</div>
        <div class="notice">If you did not request this OTP, please ignore this email or reach out to support.</div>
      </div>
    </body>
    </html>
  `;

  // Always log to terminal in readable format for easy localhost testing
  console.log(`\n======================================================`);
  console.log(`🔑 [EMAIL OTP VERIFICATION CODE]`);
  console.log(`📧 To: ${toEmail}`);
  console.log(`🔢 OTP: >>> ${otp} <<<`);
  console.log(`⏳ Expiration: 10 minutes`);
  console.log(`======================================================\n`);

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromHeader,
        to: toEmail,
        subject: `Your Login OTP: ${otp} - WorkFlow Agency`,
        html: htmlTemplate,
      });
      return { sent: true, mode: 'smtp', messageId: info.messageId };
    } catch (err) {
      console.warn(`[Mailer] SMTP Send failed: ${err.message}. Falling back to console OTP.`);
      return { sent: true, mode: 'fallback_console', otp };
    }
  }

  return { sent: true, mode: 'console_dev', otp };
}

module.exports = {
  sendOtpEmail,
};
