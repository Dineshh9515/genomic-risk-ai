import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { runAnalysis } from "@/lib/inngest/functions/runAnalysis";
import { sendWeeklyReport } from "@/lib/inngest/functions/sendReport";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [runAnalysis, sendWeeklyReport],
});
