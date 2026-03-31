const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const { name, message, score } = JSON.parse(event.body);

    if (
      !name ||
      !message ||
      !score ||
      !Number.isInteger(Number(score)) ||
      Number(score) < 1 ||
      Number(score) > 5
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, error: "Invalid input" }),
      };
    }

    const review_token = crypto.randomBytes(24).toString("hex");

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          name: name.trim(),
          message: message.trim(),
          score: Number(score),
          status: "pending",
          review_token,
        },
      ])
      .select("id, name, message, score, review_token")
      .single();

    if (error) {
      throw error;
    }

    if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_TO) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const baseUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || "";
      const approveUrl = `${baseUrl}/.netlify/functions/approve-review?id=${encodeURIComponent(data.id)}&token=${encodeURIComponent(data.review_token)}`;
      const declineUrl = `${baseUrl}/.netlify/functions/decline-review?id=${encodeURIComponent(data.id)}&token=${encodeURIComponent(data.review_token)}`;
      const safeName = escapeHtml(data.name);
      const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br>");

      await transporter.sendMail({
        from: `"S.O.S. Magic" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_TO,
        subject: `New review received from ${data.name}`,
        text: `Name: ${data.name}\nScore: ${data.score}/5\n\nMessage:\n${data.message}\n\nApprove: ${approveUrl}\nDecline: ${declineUrl}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;max-width:640px;margin:0 auto;">
            <h2 style="margin:0 0 16px;">New review received</h2>
            <p style="margin:0 0 12px;"><strong>Name:</strong> ${safeName}</p>
            <p style="margin:0 0 12px;"><strong>Score:</strong> ${data.score}/5</p>
            <p style="margin:0 0 8px;"><strong>Message:</strong></p>
            <div style="margin:0 0 20px;padding:14px 16px;border-radius:12px;background:#f5f5f5;border:1px solid #ddd;">${safeMessage}</div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <a href="${approveUrl}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#111;color:#fff;text-decoration:none;">Accept</a>
              <a href="${declineUrl}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#fff;color:#111;text-decoration:none;border:1px solid #111;">Decline</a>
            </div>
          </div>
        `,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message: "Review submitted" }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "Server error" }),
    };
  }
};
