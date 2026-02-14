import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    console.log("Stripe key:", process.env.STRIPE_SECRET_KEY?.slice(0,4)); // first 4 chars for safety

    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // Create Checkout Session with proper cents conversion and minimum amount
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",

            line_items: items.map(item => {
                const unitAmountCents = Math.max(50, Math.round(item.price * 100)); 
                // ensures Stripe never complains about < €0.50
                return {
                    price_data: {
                        currency: "eur",
                        product_data: { name: item.name },
                        unit_amount: unitAmountCents,
                    },
                    quantity: item.quantity,
                };
            }),

            success_url: "https://nileritzcarlton.github.io/314/success.html?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "https://nileritzcarlton.github.io/314/cancel.html",

            shipping_address_collection: {
                allowed_countries: ["US", "CA", "GB", "AU", "DE"]
            }
        });

        console.log("Stripe session created:", session.id, "total_amount:", session.amount_total);

        res.status(200).json({ url: session.url });

    } catch (err) {
        console.error("Stripe checkout error:", err);
        res.status(500).json({ error: "Checkout failed" });
    }
}
