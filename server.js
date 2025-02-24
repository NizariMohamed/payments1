const express = require("express");
const stripe = require("stripe")("sk_test_51QvzQTRrjGImFw87jheskEQx3QXhknaUnPM4y3PTyoH1fQnlotLmODefuHcj8wE4lPZFPEKEbk5kx1x5epYrkGww00vOqgLsAQ"); // Replace with your actual secret key
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Serve frontend files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Payment intent route
app.post("/create-payment-intent", async (req, res) => {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
        return res.status(400).json({ error: "Amount and currency are required." });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ["card"],
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve index.html for any route (so frontend works properly)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => console.log("Server running on port 3000"));
