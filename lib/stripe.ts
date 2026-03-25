import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    analyses: 3,
    features: ["3 analyses/month", "Basic SHAP charts", "Knowledge graph view"],
  },
  pro: {
    name: "Pro",
    price: 19,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    analyses: Infinity,
    features: [
      "Unlimited analyses",
      "PDF export",
      "Comparison mode",
      "What-If Simulator",
      "Priority support",
    ],
  },
  research: {
    name: "Research",
    price: 49,
    priceId: process.env.NEXT_PUBLIC_STRIPE_RESEARCH_PRICE_ID,
    analyses: Infinity,
    features: [
      "Everything in Pro",
      "API access",
      "Priority ML queue",
      "Bulk analysis",
      "Custom integrations",
    ],
  },
} as const;
