const nodemailer = require("nodemailer");

const FROM_ADDRESS = "support@sosmagic.eu";
const CONTACT_TO = "valvin71@sosmagic.eu";
const AUTO_REPLY_SUBJECT = "Message received";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: "Method Not Allowed" })
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body || "{}");

    const safeName = String(name || "").trim();
    const safeEmail = String(email || "").trim();
    const safeSubject = String(subject || "").trim();
    const safeMessage = String(message || "").trim();

    if (!safeName || !safeEmail || !safeSubject || !safeMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, error: "All fields are required." })
      };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"S.O.S. Magic" <${FROM_ADDRESS}>`,
      to: CONTACT_TO,
      replyTo: safeEmail,
      subject: `Message received from ${safeName}`,
      text: [
        `Name: ${safeName}`,
        `Email: ${safeEmail}`,
        `Subject: ${safeSubject}`,
        "",
        "Message:",
        safeMessage
      ].join("\n")
    });

    await transporter.sendMail({
      from: `"S.O.S. Magic" <${FROM_ADDRESS}>`,
      to: safeEmail,
      subject: AUTO_REPLY_SUBJECT,
      text: [
        `Hello ${safeName}!`,
        "",
        `Thank you for your message regarding: ${safeSubject}`,
        "",
        "We received your message and will respond to you as soon as possible.",
        "",
        "Thank you",
        "",
        "S.O.S. Magic"
      ].join("\n")
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message || "Unable to send message." })
    };
  }
};
