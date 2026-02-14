import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    try {
        const { items } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",

            line_items: items.map(item => ({
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price, // cents
                },
                quantity: item.quantity,
            })),

            success_url: "https://nileritzcarlton.github.io/314",
            cancel_url: "https://nileritzcarlton.github.io/314",

            shipping_address_collection: {
                allowed_countries: ["US", "CA", "GB", "AU", "DE"]
            }
        });

        res.status(200).json({ url: session.url });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Checkout failed" });
    }
}
