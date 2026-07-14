import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const plan = req.body?.plan === "annual" || req.body?.plan === "kliniaplan_annual" ? "annual" : "monthly";
        const price = plan === "annual"
            ? process.env.STRIPE_PRICE_KLINIAPLAN_ANNUAL
            : (process.env.STRIPE_PRICE_KLINIAPLAN_MONTHLY || process.env.STRIPE_PRICE_KLINIAPLAN || process.env.STRIPE_PRICE_ID);

        if (!price) {
            return res.status(500).json({
                error: "Stripe price id not configured"
            });
        }

        const origin = process.env.FRONTEND_URL || "https://www.kliniasolutions.com";
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",

            line_items: [
                {
                    price,
                    quantity: 1
                }
            ],

            success_url: `${origin}?billing=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}?billing=cancelled&plan=${plan}`
        });

        return res.status(200).json({
            url: session.url
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }
}
