// ===============================
// ADD TO CART
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(".add-cart");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            const name = button.dataset.name;
            const price = Number(button.dataset.price);

            const existingItem = cart.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            alert(name + " added to cart!");

        });

    });

});


// ===============================
// THREE-DOT MENU
// ===============================

function toggleMenu() {

    const menu = document.getElementById("dropdownMenu");

    if (!menu) return;

    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }

}


// ===============================
// CHECKOUT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const checkoutForm = document.getElementById("checkout-form");

    if (!checkoutForm) return;

    checkoutForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const customerName =
            document.getElementById("customer-name").value;

        const customerPhone =
            document.getElementById("customer-phone").value;

        const deliveryAddress =
            document.getElementById("delivery-address").value;

        const selectedPayment =
            document.querySelector('input[name="payment"]:checked');

        if (!selectedPayment) {
            alert("Please select a payment method.");
            return;
        }

        const cart =
            JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const total = cart.reduce(
            (sum, item) =>
                sum + item.price * (item.quantity || 1),
            0
        );

        // Load Supabase only when checkout is used
        const SUPABASE_URL =
            "https://wecbwwotcjyxbadksdkg.supabase.co";

        const SUPABASE_KEY =
            "sb_publishable_pCUuKymWa6mgAriqeYaSSQ__RBOOWgF";

        const supabase =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );

        const { error } = await supabase
            .from("orders")
            .insert([
                {
                    customer_name: customerName,
                    customer_phone: customerPhone,
                    delivery_address: deliveryAddress,
                    payment_method: selectedPayment.value,
                    items: cart,
                    total: total,
                    status: "Pending"
                }
            ]);

        if (error) {
            console.error("Order error:", error);
            alert("There was a problem placing your order.");
            return;
        }

        alert("Order placed successfully!");

        localStorage.removeItem("cart");

        window.location.href = "index.html";

    });

});
