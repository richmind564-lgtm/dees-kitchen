document.addEventListener("DOMContentLoaded", () => {

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");
    const clearCart = document.getElementById("clear-cart");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function displayCart() {

        cartItems.innerHTML = "";

        let total = 0;

        cart.forEach((item, index) => {

            total += item.price;

            const li = document.createElement("li");

            li.innerHTML = `
                <span>${item.name}</span>
                <span>₦${item.price}</span>

                <button class="remove-btn" data-index="${index}">
                    Remove
                </button>
            `;

            cartItems.appendChild(li);

        });

        cartTotal.textContent = total;
        cartCount.textContent = cart.length;

        localStorage.setItem("cart", JSON.stringify(cart));

        document.querySelectorAll(".remove-btn").forEach(button => {

            button.addEventListener("click", () => {

                const index = button.dataset.index;

                cart.splice(index, 1);

                displayCart();

            });

        });

    }

    displayCart();

    clearCart.addEventListener("click", () => {

        cart = [];

        localStorage.removeItem("cart");

        displayCart();

        alert("Cart cleared!");

    });

});