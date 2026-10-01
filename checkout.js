const SUPABASE_URL = "https://nreigsqxxolcbbzacmdg.supabase.co";
const SUPABASE_KEY = "sb_publishable_TU09leMRuVGZ59y7TjqZzg_n2M2R5Wc";
const PAYSTACK_PUBLIC_KEY = "pk_test_1462e5f288f730f361f59b23ad7dfa4c7b83c340";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const checkoutForm = document.getElementById("checkout-form");
const checkoutButton = document.getElementById("checkout-button");
const bankDetails = document.getElementById("bank-details");
const cardDetails = document.getElementById("card-details");

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function getCartTotal(cart) {
    return cart.reduce((total, item) => {
        return total + (Number(item.price) * Number(item.quantity));
    }, 0);
}

function displayTotal() {
    const cart = getCart();
    const total = getCartTotal(cart);

    const checkoutTotal = document.getElementById("checkout-total");
    const bankTotal = document.getElementById("bank-total");

    if (checkoutTotal) {
        checkoutTotal.textContent = total.toLocaleString();
    }

    if (bankTotal) {
        bankTotal.textContent = total.toLocaleString();
    }
}

displayTotal();

const paymentOptions = document.querySelectorAll('input[name="payment"]');

paymentOptions.forEach(option => {
    option.addEventListener("change", function () {
        if (bankDetails) {
            bankDetails.style.display = "none";
        }

        if (cardDetails) {
            cardDetails.style.display = "none";
        }

        if (this.value === "bank" && bankDetails) {
            bankDetails.style.display = "block";
        }

        if (this.value === "card" && cardDetails) {
            cardDetails.style.display = "block";
        }
    });
});

checkoutForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const customerName = document.getElementById("customer-name").value.trim();
    const customerPhone = document.getElementById("customer-phone").value.trim();
    const customerEmail = document.getElementById("customer-email").value.trim();
    const deliveryAddress = document.getElementById("delivery-address").value.trim();
    const selectedPayment = document.querySelector('input[name="payment"]:checked');

    if (!customerName || !customerPhone || !customerEmail || !deliveryAddress) {
        alert("Please fill in all customer details.");
        return;
    }

    if (!selectedPayment) {
        alert("Please select a payment method.");
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const totalAmount = getCartTotal(cart);

    if (totalAmount <= 0) {
        alert("Invalid order total.");
        return;
    }

    const paymentMethod = selectedPayment.value;

    checkoutButton.disabled = true;
    checkoutButton.textContent = "Processing...";

    if (paymentMethod === "bank") {
        await saveOrder(
            customerName,
            customerPhone,
            deliveryAddress,
            "bank",
            totalAmount,
            cart
        );
        return;
    }

    if (paymentMethod === "cash") {
        await saveOrder(
            customerName,
            customerPhone,
            deliveryAddress,
            "cash",
            totalAmount,
            cart
        );
        return;
    }

    if (paymentMethod === "card") {
        startPaystackPayment(
            customerName,
            customerPhone,
            customerEmail,
            deliveryAddress,
            totalAmount,
            cart
        );
    }
});

function startPaystackPayment(
    customerName,
    customerPhone,
    customerEmail,
    deliveryAddress,
    totalAmount,
    cart
) {
    const amountInKobo = Math.round(totalAmount * 100);

    try {
        const paystack = new PaystackPop();

        paystack.newTransaction({
            key: PAYSTACK_PUBLIC_KEY,
            email: customerEmail,
            amount: amountInKobo,
            channels: ["card", "ussd"],

            onSuccess: async function(transaction) {
                console.log("Payment successful:", transaction);

                await saveOrder(
                    customerName,
                    customerPhone,
                    deliveryAddress,
                    "card",
                    totalAmount,
                    cart,
                    transaction.reference
                );
            },

            onCancel: function() {
                checkoutButton.disabled = false;
                checkoutButton.textContent = "Continue to Payment";
                alert("Payment was cancelled.");
            }
        });

    } catch (error) {
        console.error("Paystack error:", error);

        checkoutButton.disabled = false;
        checkoutButton.textContent = "Continue to Payment";

        alert("Unable to open Paystack. Please try again.");
    }
}

async function saveOrder(
    customerName,
    customerPhone,
    deliveryAddress,
    paymentMethod,
    totalAmount,
    cart,
    paymentReference = null
) {
    try {
        const { data: orderId, error: orderError } =
            await supabaseClient.rpc("place_order", {
                p_customer_name: customerName,
                p_customer_phone: customerPhone,
                p_customer_address: deliveryAddress,
                p_payment_method: paymentMethod,
                p_total_amount: totalAmount,
                p_items: cart
            });

        if (orderError) {
            console.error("Supabase order error:", orderError);

            alert(
                "There was a problem saving your order:\n\n" +
                orderError.message
            );

            checkoutButton.disabled = false;
            checkoutButton.textContent = "Continue to Payment";
            return;
        }

        console.log("Order created:", orderId);
        console.log("Payment reference:", paymentReference);

        localStorage.removeItem("cart");

        if (paymentMethod === "bank") {
            alert(
                "Your order has been received.\n\n" +
                "Please complete the bank transfer using the account details provided."
            );
        } else if (paymentMethod === "cash") {
            alert(
                "Your order has been received.\n\n" +
                "Please pay when your food is delivered."
            );
        } else {
            alert(
                "Payment successful!\n\n" +
                "Your order has been received."
            );
        }

        window.location.href = "index.html";

    } catch (error) {
        console.error("Unexpected error:", error);

        alert("Something went wrong. Please try again.");

        checkoutButton.disabled = false;
        checkoutButton.textContent = "Continue to Payment";
    }
}