let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price, image, size = null, quantity = 1) {
    let existingItem = cart.find(
        item => item.name === name && item.size === size
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name,
            price,
            size,
            quantity,
            image
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    showToast(`${name}${size ? ` (Size ${size})` : ""} ×${quantity} added to cart`);

    updateCart();
    updateCartCount(); // at the end of updateCart
}

function updateCart() {
    const list = document.getElementById("cart-items");
    const total = document.getElementById("cart-total");
    if (!list) return;

    list.innerHTML = "";
    let sum = 0;

    const sizeOrder = { "S": 1, "M": 2, "L": 3, "XL": 4, "XXL": 5 };
    // Group by product name, then size
    const grouped = [...cart].sort((a, b) => {
        // Sort by name first
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;

        // Sort by size using custom order
        const aSize = sizeOrder[a.size] || 0;
        const bSize = sizeOrder[b.size] || 0;
        return aSize - bSize;
    })

    grouped.forEach((item, index) => {
        const li = document.createElement("li");

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;
        li.appendChild(img);

        const textDiv = document.createElement("div");
        textDiv.style.flex = "1";

        // Product name on top
        const nameDiv = document.createElement("div");
        nameDiv.textContent = item.name;
        nameDiv.style.fontWeight = "bold";
        textDiv.appendChild(nameDiv);

        // Size line
        const sizeDiv = document.createElement("div");
        sizeDiv.textContent = `Size: ${item.size || "default"}`;
        textDiv.appendChild(sizeDiv);

        // Quantity line with buttons
        const quantityDiv = document.createElement("div");

        const minusBtn = document.createElement("button");
        minusBtn.textContent = "-";
        minusBtn.style.marginRight = "0.3rem";
        minusBtn.onclick = () => {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Remove item if quantity reaches 0
                const originalIndex = cart.findIndex(
                    c => c.name === item.name && c.size === item.size
                );
                if (originalIndex > -1) cart.splice(originalIndex, 1);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
            updateCartCount(); // at the end of updateCart
        };

        const plusBtn = document.createElement("button");
        plusBtn.textContent = "+";
        const isMobile = window.innerWidth <= 780;

        minusBtn.style.marginRight = isMobile ? "0" : "0.3rem";
        plusBtn.style.marginLeft  = isMobile ? "0" : "0.3rem";

        plusBtn.onclick = () => {
            item.quantity += 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
            updateCartCount(); // at the end of updateCart
        };

        const qtySpan = document.createElement("span");
        if (isMobile) {
            qtySpan.textContent = `${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`;
        } else {
            qtySpan.textContent = `Quantity: ${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`;
        }
        qtySpan.style.margin = "0 0.5rem";

        quantityDiv.appendChild(minusBtn);
        quantityDiv.appendChild(qtySpan);
        quantityDiv.appendChild(plusBtn);

        textDiv.appendChild(quantityDiv);

        li.appendChild(textDiv);

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "🗑️"; // red trashcan
        removeBtn.style.color = "red";
        removeBtn.style.border = "none";
        removeBtn.style.background = "transparent";
        removeBtn.style.cursor = "pointer";
        removeBtn.style.fontSize = "1rem";
        removeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="darkred" viewBox="0 0 24 24"> <path d="M3 6h18v2H3V6zm2 3h14l-1.5 12.5a1 1 0 0 1-1 .5H7a1 1 0 0 1-1-.5L4 9zm5 2v8h2v-8H9zm4 0v8h2v-8h-2zM9 4h6v2H9V4z"/> </svg>`;
        removeBtn.onclick = () => {
            const originalIndex = cart.findIndex(
                c => c.name === item.name && c.size === item.size
            );
            if (originalIndex > -1) cart.splice(originalIndex, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        };

        li.appendChild(removeBtn);
        list.appendChild(li);

        sum += item.price * item.quantity;
    });

    if (total) total.textContent = sum.toFixed(2);

    updateCartCount(); // at the end of updateCart
}

function changeImage(thumb) {
    const mainImage = document.getElementById("main-image");
    if (mainImage) {
        mainImage.src = thumb.src;
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

let currentQty = 1;

function changeQty(amount) {
    currentQty = Math.max(1, currentQty + amount);
    document.getElementById("qty-value").textContent = currentQty;
}

function addProductFromPage(name, price, image) {
    const size = document.getElementById("size")?.value || null;
    addToCart(name, price, image, size, currentQty);

    // reset qty after adding
    currentQty = 1;
    document.getElementById("qty-value").textContent = "1";
}

const cartCountSpan = document.getElementById("cart-count");
if (cartCountSpan) {
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalQty;;
}

function updateCartCount() {
    const cartCountSpan = document.getElementById("cart-count");
    if (!cartCountSpan) return;

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    // Add parentheses directly
    cartCountSpan.textContent = totalQty;;
}

function toggleMenu() {
    const menu = document.querySelector(".left-links");
    if (!menu) return;
    menu.classList.toggle("active");
}

// Close menu if click outside
document.addEventListener("click", function(e) {
    const menu = document.querySelector(".left-links");
    const toggle = document.querySelector(".menu-toggle");
    if (!menu || !menu.classList.contains("active")) return;

    // If click is NOT inside the menu AND not on the toggle button
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove("active");
    }
});

document.addEventListener("DOMContentLoaded", updateCart);

document.addEventListener("DOMContentLoaded", () => {
    const sizeButtons = document.querySelectorAll(".size-btn");
    const sizeInput = document.getElementById("size");

    sizeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            sizeButtons.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            sizeInput.value = btn.dataset.size;
        });
    });

    // Optionally mark first button as selected on page load
    if (sizeButtons.length > 0) sizeButtons[0].classList.add("selected");
});

document.addEventListener("DOMContentLoaded", () => {
    // Only show T-Shirts on this page
    const products = document.querySelectorAll(".container .product");

    products.forEach(product => {
        if (product.dataset.category !== "tshirt") {
            product.style.display = "none"; // hide non-T-Shirts
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const searchWrapper = document.getElementById("mobile-search");
    if (!searchWrapper) return;

    const icon = searchWrapper.querySelector(".search-icon");

    icon.addEventListener("click", function (e) {
        e.preventDefault();
        searchWrapper.classList.toggle("active");
        const input = searchWrapper.querySelector("input");
        if (searchWrapper.classList.contains("active")) {
            input.focus();
        }
    });

    // Close if clicking outside
    document.addEventListener("click", function (e) {
        if (!searchWrapper.contains(e.target)) {
            searchWrapper.classList.remove("active");
        }
    });
});

async function checkout() {
    if (!cart || cart.length === 0) return alert("Your cart is empty.");

    const items = cart.map(item => ({
        name: item.name,
        price: item.price * 100,
        quantity: item.quantity
    }));

    const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart })
    });

    const data = await res.json();

    if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
    } else {
        alert("Checkout failed. Please try again.");
    }
}

function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    updateCartCount(); // you already have this
}

if (window.paypal) {
    paypal.Buttons({
        style: {
            layout: "horizontal",
            color: "silver",
            shape: "rect",
            label: "pay",
            height: 30,
            tagline: false
        },

        createOrder: async function () {

            const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: cart })
            });

            const data = await res.json();
            return data.id;
        },

        onApprove: async function (data) {

            const res = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: data.orderID })
            });

            const details = await res.json();

            clearCart();
            window.location.href = "/success.html";
        }

    }).render("#paypal-button-container");
}