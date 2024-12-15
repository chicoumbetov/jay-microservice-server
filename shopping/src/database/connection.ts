import mongoose, { ConnectOptions } from "mongoose";
const {
  LOCAL_DB_URL, // DB_URL,
} = require("../config");

module.exports = async () => {
  try {
    await mongoose.connect(
      LOCAL_DB_URL, // DB_URL,
      {} as ConnectOptions
    );
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    console.log("Shopping Db Connected");
  } catch (error) {
    console.log("Error ============");
    console.log(error);
    process.exit(1);
  }
};
