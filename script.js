document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(".add-cart");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const item = {
                name: button.dataset.name,
                price: Number(button.dataset.price),
                quantity: 1
            };

            let existingItem = cart.find(food => food.name === item.name);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(item);
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            alert(item.name + " added to cart!");

        });

    });

});
// Checkout button
const checkoutBtn = document.getElementById("checkout-btn");

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        alert("Thank you for your order! Your checkout was successful.");

        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    });
}
function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");

    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}