const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

async function createOrder(req, res) {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const entry of items) {
      const quantity = Number(entry.quantity);

      if (
        !entry.menuItem ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 50
      ) {
        return res.status(400).json({ message: "Invalid order item" });
      }

      const menuItem = await MenuItem.findById(entry.menuItem);

      if (!menuItem || !menuItem.available) {
        return res.status(400).json({
          message: "A menu item is unavailable",
          menuItemId: entry.menuItem,
        });
      }

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      });

      totalAmount += menuItem.price * quantity;
    }

    // Basic demo token. For production, use an atomic counter to avoid
    // duplicate token numbers when orders are placed simultaneously.
    const tokenNumber = Date.now() % 1000000;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      tokenNumber,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const allowedStatuses = [
      "pending",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: "Unable to update order" });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};