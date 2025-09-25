import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ----------------- Online Payment (Stripe) -----------------
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173/";
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false, // unpaid initially
      paymentMethod: "online",
    });

    await newOrder.save();

    // clear cart
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // prepare line items for Stripe
    const line_items = req.body.items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100, // INR → paise
      },
      quantity: item.quantity,
    }));

    // delivery charge (₹50)
    line_items.push({
      price_data: {
        currency: 'inr',
        product_data: { name: 'Delivery Charge' },
        unit_amount: 30 * 100,
      },
      quantity: 1,
    });

    // Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${frontend_url}verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
};

// ----------------- Cash on Delivery -----------------
const codOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false,   // still unpaid, COD means payment on delivery
      paymentMethod: "cod",
    });

    await newOrder.save();

    // clear cart
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    res.json({ success: true, message: "Order placed with Cash on Delivery" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to place COD order" });
  }
};

// ----------------- Verify Payment (for Stripe only) -----------------
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.query;

  try {
    if (String(success) === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: 'Paid successfully' });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error verifying payment' });
  }
};

// ----------------- User Orders -----------------
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Failed to fetch orders' });
  }
};

// ----------------- Admin: All Orders -----------------
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Failed to fetch orders' });
  }
};

// ----------------- Update Order Status -----------------
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Failed to update status' });
  }
};

export { placeOrder, codOrder, verifyOrder, userOrders, listOrders, updateStatus };
