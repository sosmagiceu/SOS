const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 📩 EMAIL TO YOU
    await transporter.sendMail({
      from: `"S.O.S. Magic" <support@sosmagic.eu>`,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: `Message received from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    });

    // 📩 AUTO REPLY TO USER
    await transporter.sendMail({
      from: `"S.O.S. Magic" <support@sosmagic.eu>`,
      to: email,
      subject: "Message received",
      text: `Hello ${name}!

Thank you for your message regarding: ${subject}

We received your message and will respond to you as soon as possible.

Thank you`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };

  } catch (err) {
    console.error(err); // <-- important for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};
