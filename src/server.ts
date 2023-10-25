import mongoose from "mongoose";
import app from "./app";
import config from "./config";
async function main() {
  try {
    await mongoose.connect(config.db_url);

    console.log("Connected to database");
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("DB error===>", error);
  }
}

main();
