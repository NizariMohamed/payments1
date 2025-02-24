const stripe = Stripe("pk_test_51QvzQTRrjGImFw87F705HIT6rhkrsns8teIJuHWXqzTzBPIg9hCVhvNCApGSKiGjBEsDKaX4R7Ud4ieAjb0YJm3P00yyS7z0Hp"); // Replace with your actual public key
const elements = stripe.elements();
const cardElement = elements.create("card");

cardElement.mount("#card-element");

const form = document.getElementById("payment-form");
const message = document.getElementById("payment-message");
const payButton = document.getElementById("pay-button");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    payButton.disabled = true;
    payButton.textContent = "Processing...";

    try {
        const response = await fetch("http://localhost:3000/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 5000, currency: "usd" }), // 5000 = $50
        });

        const { clientSecret } = await response.json();

        if (!clientSecret) {
            throw new Error("Failed to get payment client secret.");
        }

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement },
        });

        if (error) {
            message.textContent = error.message;
        } else {
            message.textContent = "Payment successful!";
            message.style.color = "green"
        }
    } catch (err) {
        message.textContent = "Payment failed. Please try again.";
        message.style.colot = "red"
    } finally {
        payButton.disabled = false;
        payButton.textContent = "Pay";
    }
});
