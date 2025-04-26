import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

interface SendEmailProps {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendMail({ to, subject, text, html }: SendEmailProps) {
  try {
    await client.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.MAILGUN_SENDER_EMAIL!,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Ошибка отправки письма:", error);
    throw error;
  }
}
