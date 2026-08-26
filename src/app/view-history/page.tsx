import { redirect } from "next/navigation";

/** My RTI and View History were merged into one email-gated flow at
 * /my-rti (see that page for the actual UI/logic). This route stays as a
 * redirect so existing links/bookmarks — and the post-filing deep link
 * from the home page's "done" step — keep working. */
export default async function ViewHistoryRedirect({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  redirect(email ? `/my-rti?email=${encodeURIComponent(email)}` : "/my-rti");
}
