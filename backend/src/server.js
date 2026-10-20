require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const ensureDefaultAdmin = require("./config/seedAdmin");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    await ensureDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`CampusBite API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();