const MenuItem = require("../models/MenuItem");

async function getMenu(req, res) {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.available === "true") {
      filter.available = true;
    }

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMenuItem(req, res) {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: "Invalid menu item ID" });
  }
}

async function createMenuItem(req, res) {
  try {
    const { name, price, category } = req.body;

    if (!name?.trim() || price == null || !category?.trim()) {
      return res.status(400).json({
        message: "Name, price and category are required",
      });
    }

    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateMenuItem(req, res) {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteMenuItem(req, res) {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(400).json({ message: "Invalid menu item ID" });
  }
}

module.exports = {
  getMenu,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};