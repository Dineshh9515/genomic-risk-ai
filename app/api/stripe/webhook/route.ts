import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    // In production, verify the webhook signature:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    // Parse the event
    const event = JSON.parse(body);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        // Update user plan in Supabase
        console.log("Checkout completed:", session.id);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        // Downgrade user plan to free
        console.log("Subscription cancelled:", subscription.id);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        // Notify user of payment failure
        console.log("Payment failed:", invoice.id);
        break;
      }
      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
