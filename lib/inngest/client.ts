import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "genomic-risk-ai",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
