import paypal from "@paypal/checkout-server-sdk";

function environment() {
  return new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
}

const client = new paypal.core.PayPalHttpClient(environment());

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { items } = req.body;

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: total.toFixed(2),
          },
        },
      ],
    });

    const order = await client.execute(request);

    res.status(200).json({ id: order.result.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PayPal order creation failed" });
  }
}