let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price, image) {
    const sizeSelect = document.getElementById("size");
    let size = sizeSelect ? sizeSelect.value : null;

    let existingItem = cart.find(item => item.name === name && item.size === size);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, size, quantity: 1, image });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} (${size || "default"}) added to cart!`);
    updateCart();
}

function updateCart() {
    const list = document.getElementById("cart-items");
    const total = document.getElementById("cart-total");
    if (!list) return;

    list.innerHTML = "";
    let sum = 0;

    // Group by product name, then size
    const grouped = [...cart].sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;

        if ((a.size || "") < (b.size || "")) return 1;
        if ((a.size || "") > (b.size || "")) return -1;
        return 0;
    });

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
        };

        const plusBtn = document.createElement("button");
        plusBtn.textContent = "+";
        plusBtn.style.marginLeft = "0.3rem";
        plusBtn.onclick = () => {
            item.quantity += 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        };

        const qtySpan = document.createElement("span");
        qtySpan.textContent = `Quantity: ${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`;
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
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let summary = cart.map(item => 
        `${item.name} (${item.size || "default"}) x${item.quantity} - €${item.price * item.quantity}`
    ).join("\n");

    alert("Checkout:\n" + summary + `\nTotal: €${cart.reduce((a,b) => a + b.price * b.quantity, 0)}`);
}

// Run updateCart on page load
document.addEventListener("DOMContentLoaded", updateCart);

// Size button selection
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