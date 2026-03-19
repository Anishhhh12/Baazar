import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail({ to, subject, html }) {
  const { data, error } = await resend.emails.send({
    from: "Baazar <onboarding@resend.dev>", // use this until you add your domain
    to,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
  console.log("✅ Email sent:", data.id);
}

