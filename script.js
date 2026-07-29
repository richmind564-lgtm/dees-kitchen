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