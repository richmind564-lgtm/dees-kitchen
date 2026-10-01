document.addEventListener("DOMContentLoaded", () => {

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartTotalSummary =
        document.getElementById("cart-total-summary");

    const cartCount = document.getElementById("cart-count");
    const clearCart = document.getElementById("clear-cart");

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    function displayCart() {

        cartItems.innerHTML = "";

        let total = 0;
        let count = 0;


        cart.forEach((item, index) => {

            const quantity = item.quantity || 1;

            total += Number(item.price) * quantity;
            count += quantity;


            const li = document.createElement("li");

            li.innerHTML = `
                <div class="cart-item-info">

                    <strong>
                        ${item.name}
                    </strong>

                    <span>
                        ₦${Number(item.price).toLocaleString()}
                    </span>

                </div>

                <div class="cart-controls">

                    <button
                        class="minus-btn"
                        data-index="${index}">
                        -
                    </button>

                    <span class="quantity">
                        ${quantity}
                    </span>

                    <button
                        class="plus-btn"
                        data-index="${index}">
                        +
                    </button>

                    <button
                        class="remove-btn"
                        data-index="${index}">
                        Remove
                    </button>

                </div>
            `;

            cartItems.appendChild(li);

        });


        // UPDATE TOTAL
        cartTotal.textContent =
            total.toLocaleString();

        if (cartTotalSummary) {
            cartTotalSummary.textContent =
                total.toLocaleString();
        }


        // UPDATE COUNT
        cartCount.textContent = count;


        // SAVE CART
        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        // PLUS
        document
            .querySelectorAll(".plus-btn")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const index =
                        button.dataset.index;

                    cart[index].quantity =
                        (cart[index].quantity || 1) + 1;

                    displayCart();

                });

            });


        // MINUS
        document
            .querySelectorAll(".minus-btn")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const index =
                        button.dataset.index;

                    if (
                        (cart[index].quantity || 1) > 1
                    ) {

                        cart[index].quantity--;

                    } else {

                        cart.splice(index, 1);

                    }

                    displayCart();

                });

            });


        // REMOVE
        document
            .querySelectorAll(".remove-btn")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const index =
                        button.dataset.index;

                    cart.splice(index, 1);

                    displayCart();

                });

            });

    }


    displayCart();


    // CLEAR CART
    if (clearCart) {

        clearCart.addEventListener("click", () => {

            cart = [];

            localStorage.removeItem("cart");

            displayCart();

            alert("Cart cleared!");

        });

    }

});
