import { inngest } from "../client";

export const sendWeeklyReport = inngest.createFunction(
  { id: "weekly-report", retries: 2 },
  { cron: "0 9 * * 1" }, // Every Monday 9am
  async ({ step }) => {
    // Step 1: Fetch all active users
    const users = await step.run("fetch-users", async () => {
      // In production, query Supabase for active users with analyses in last 7 days
      return [];
    });

    // Step 2: Generate and send reports
    for (const user of users) {
      await step.run(`send-report-${(user as { id: string }).id}`, async () => {
        // In production, compile weekly analysis summary and send via Resend
        return { sent: true };
      });
    }

    return { success: true, usersNotified: users.length };
  }
);
