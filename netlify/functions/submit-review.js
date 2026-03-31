const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

    const { error } = await supabase.from("reviews").insert([
      {
        name: name.trim(),
        message: message.trim(),
        score: Number(score),
        status: "pending",
        review_token,
      },
    ]);

    if (error) {
      throw error;
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
