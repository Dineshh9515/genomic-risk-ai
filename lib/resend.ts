import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@genomic-risk.ai",
    to: email,
    subject: "🧬 Your Genomic Journey Starts Here — GenomicRisk AI",
    html: `
      <div style="background:#0D0F14;color:#E0E4EC;padding:40px;font-family:monospace;max-width:600px;margin:0 auto;">
        <h1 style="font-family:Georgia,serif;color:#00D9FF;font-size:28px;margin-bottom:8px;">
          Welcome to GenomicRisk AI
        </h1>
        <p style="color:#8892A4;font-size:14px;margin-bottom:24px;">
          Hello ${name}, your laboratory notebook is ready.
        </p>
        <div style="border:1.5px dashed rgba(0,217,255,0.3);border-radius:4px;padding:20px;margin-bottom:24px;">
          <p style="color:#E0E4EC;font-size:14px;line-height:1.6;">
            You now have access to the most advanced genomic risk prediction platform for Type 2 Diabetes.
            Start by inputting your genes of interest and let our GNN + Transformer hybrid AI engine analyze your data.
          </p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#00D9FF,#0099CC);color:#0D0F14;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;font-size:13px;letter-spacing:0.05em;">
          OPEN YOUR LAB NOTEBOOK →
        </a>
        <p style="color:#555;font-size:11px;margin-top:32px;">
          GenomicRisk AI — Where DNA meets intelligence.
        </p>
      </div>
    `,
  });
}

export async function sendAnalysisCompleteEmail(
  email: string,
  riskScore: number,
  riskCategory: string,
  topGenes: { gene: string; shapValue: number }[],
  analysisId: string
) {
  const riskColor =
    riskCategory === "low" ? "#00FFA3" :
    riskCategory === "moderate" ? "#00D9FF" :
    riskCategory === "high" ? "#FF6B35" : "#FF3232";

  const topGenesHtml = topGenes
    .slice(0, 3)
    .map(
      (g) =>
        `<li style="margin-bottom:4px;">
          <strong>${g.gene}</strong>: SHAP = ${g.shapValue > 0 ? "+" : ""}${g.shapValue.toFixed(3)}
        </li>`
    )
    .join("");

  return resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@genomic-risk.ai",
    to: email,
    subject: `🧬 Analysis Complete — Risk: ${riskCategory.toUpperCase()}`,
    html: `
      <div style="background:#0D0F14;color:#E0E4EC;padding:40px;font-family:monospace;max-width:600px;margin:0 auto;">
        <h1 style="font-family:Georgia,serif;color:#00D9FF;font-size:24px;">Analysis Complete</h1>
        <div style="border:1.5px dashed rgba(0,217,255,0.3);border-radius:4px;padding:20px;margin:20px 0;">
          <p style="font-size:14px;margin-bottom:8px;">Risk Score</p>
          <p style="font-size:48px;color:${riskColor};font-weight:bold;margin:0;">
            ${(riskScore * 100).toFixed(1)}%
          </p>
          <p style="color:${riskColor};font-size:14px;text-transform:uppercase;letter-spacing:0.1em;">
            ${riskCategory}
          </p>
        </div>
        <h3 style="color:#FFFE8A;font-size:16px;">Top Contributing Genes</h3>
        <ul style="font-size:13px;line-height:1.8;">${topGenesHtml}</ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/analysis/${analysisId}" style="display:inline-block;background:linear-gradient(135deg,#00D9FF,#0099CC);color:#0D0F14;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;font-size:13px;margin-top:16px;">
          VIEW FULL REPORT →
        </a>
      </div>
    `,
  });
}
