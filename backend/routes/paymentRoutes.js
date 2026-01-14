const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount } = req.body;

    console.log("STRIPE AMOUNT RECEIVED 👉", amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

const session = await stripe.checkout.sessions.create({
  mode: "payment",

 payment_method_types: ["card"],


  line_items: [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: "Event Ticket",
        },
        unit_amount: amount * 100,
      },
      quantity: 1,
    },
  ],

  success_url: "http://localhost:5173/payment-success",
  cancel_url: "http://localhost:5173/events"

});

    res.json({ url: session.url });
  } catch (err) {
    console.error("STRIPE ERROR ❌", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
