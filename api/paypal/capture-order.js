import paypal from "@paypal/checkout-server-sdk";

function environment() {
  return new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
}

const client = new paypal.core.PayPalHttpClient(environment());

export default async function handler(req, res) {
  const { orderID } = req.body;

  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client.execute(request);

    res.status(200).json(capture.result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Capture failed" });
  }
}