const Order = require("../models/Order");
const User = require("../models/User");
const MenuItem = require("../models/MenuItem");

async function getStats(req, res) {
  try {
    const [totalOrders, totalUsers, totalMenuItems, revenueResult] =
      await Promise.all([
        Order.countDocuments(),
        User.countDocuments({ role: "student" }),
        MenuItem.countDocuments(),
        Order.aggregate([
          { $match: { status: { $ne: "cancelled" } } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
      ]);

    res.json({
      totalOrders,
      totalUsers,
      totalMenuItems,
      totalRevenue: revenueResult[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getStats };