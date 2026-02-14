async function loadOrder() {
  const params = new URLSearchParams(window.location.search);
  const session_id = params.get("session_id");
  const container = document.getElementById("order-details");

  if (!session_id) {
    container.innerHTML = "<p>Invalid session. Cannot load order.</p>";
    return;
  }

  try {
    const res = await fetch(`/api/get-session?session_id=${session_id}`);
    const session = await res.json();

    if (!session || !session.line_items) {
      container.innerHTML = "<p>Failed to load order details.</p>";
      return;
    }

    let html = "<h2>Your Order:</h2><ul>";
    let total = 0;

    session.line_items.data.forEach(item => {
      const name = item.description;
      const qty = item.quantity;
      const price = (item.price.unit_amount / 100).toFixed(2);
      total += item.price.unit_amount * qty;

      html += `<li>${name} ×${qty} — €${(item.price.unit_amount * qty / 100).toFixed(2)}</li>`;
    });

    html += `</ul><p><strong>Total: €${(total / 100).toFixed(2)}</strong></p>`;

    container.innerHTML = html;
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Could not load order details. Try again later.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadOrder);
