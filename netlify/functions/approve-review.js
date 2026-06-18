const { createClient } = require("@supabase/supabase-js");
const { cleanupReviews } = require("./_reviewsCleanup");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const id = event.queryStringParameters?.id;
  const token = event.queryStringParameters?.token;

  if (!id || !token) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: "<h1>Missing review information.</h1>",
    };
  }

  try {
    const { data: review, error: findError } = await supabase
      .from("reviews")
      .select("id, status")
      .eq("id", id)
      .eq("review_token", token)
      .maybeSingle();

    if (findError || !review) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
        body: "<h1>Review not found.</h1>",
      };
    }

    const { error: updateError } = await supabase
      .from("reviews")
      .update({ status: "approved" })
      .eq("id", id)
      .eq("review_token", token);

    if (updateError) {
      throw updateError;
    }

    await cleanupReviews(supabase);

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: "<h1>Review approved.</h1><p>You can close this page.</p>",
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: "<h1>Something went wrong.</h1>",
    };
  }
};
