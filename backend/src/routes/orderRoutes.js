const express = require("express");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createOrder);
router.get("/my", getMyOrders);
router.get("/", adminOnly, getAllOrders);
router.patch("/:id/status", adminOnly, updateOrderStatus);

module.exports = router;