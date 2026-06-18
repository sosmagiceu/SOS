async function cleanupReviews(supabase) {
  const table = "reviews";

  const { error: declinedError } = await supabase
    .from(table)
    .delete()
    .eq("status", "declined");

  if (declinedError) {
    throw declinedError;
  }

  const { data: approvedRows, error: approvedError } = await supabase
    .from(table)
    .select("id, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (approvedError) {
    throw approvedError;
  }

  const approved = approvedRows || [];
  const MAX_APPROVED = 100;

  if (approved.length <= MAX_APPROVED) {
    return {
      deletedDeclined: true,
      deletedApprovedCount: 0,
    };
  }

  const idsToDelete = approved.slice(MAX_APPROVED).map((row) => row.id).filter(Boolean);

  if (!idsToDelete.length) {
    return {
      deletedDeclined: true,
      deletedApprovedCount: 0,
    };
  }

  const { error: deleteApprovedError } = await supabase
    .from(table)
    .delete()
    .in("id", idsToDelete);

  if (deleteApprovedError) {
    throw deleteApprovedError;
  }

  return {
    deletedDeclined: true,
    deletedApprovedCount: idsToDelete.length,
  };
}

module.exports = { cleanupReviews };
