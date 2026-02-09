let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    alert(name + " added to cart!");
    updateCart();
}

function updateCart() {
    const list = document.getElementById("cart-items");
    const total = document.getElementById("cart-total");
    if (!list) return; // on products page no list exists

    list.innerHTML = "";
    let sum = 0;
    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - €${item.price}`;
        list.appendChild(li);
        sum += item.price;
    });
    total.textContent = sum;
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    // Here you would redirect to Stripe/PayPal checkout
    alert("Redirecting to checkout...");
}
