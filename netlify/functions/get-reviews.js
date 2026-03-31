const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const page = Math.max(1, Number(event.queryStringParameters?.page || 1));
    const pageSize = 5;
    const maxReviews = 100;
    const maxPages = 20;

    const { data: approvedReviews, error } = await supabase
      .from("reviews")
      .select("id, name, message, score, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(maxReviews);

    if (error) {
      throw error;
    }

    const reviews = approvedReviews || [];
    const totalApproved = reviews.length;
    const totalPages = Math.max(1, Math.min(maxPages, Math.ceil(totalApproved / pageSize) || 1));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    const pageItems = reviews.slice(start, start + pageSize);
    const averageScore = totalApproved
      ? reviews.reduce((sum, review) => sum + Number(review.score || 0), 0) / totalApproved
      : 0;

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        page: safePage,
        totalPages,
        totalApproved,
        averageScore: Number(averageScore.toFixed(1)),
        reviews: pageItems,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "Unable to load reviews." }),
    };
  }
};
