import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: `"News Aggregator" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(` Email sent: ${info.messageId} to ${to}`);
    const previewUrl = (nodemailer as any).getTestMessageUrl?.(info);
    if (previewUrl) console.log(`🔗 Preview URL: ${previewUrl}`);
  } catch (err: any) {
    console.error(
      ` Error sending email to ${to}:`,
      err?.response || err.message || err
    );
  }
}
