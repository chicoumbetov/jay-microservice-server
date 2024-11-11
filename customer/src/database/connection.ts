import mongoose, { ConnectOptions } from "mongoose";
const { DB_URL } = require("../config");

module.exports = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true
    } as ConnectOptions);
    console.log("Customer Db Connected");
  } catch (error) {
    console.log("Error ============");
    console.log(error);
    process.exit(1);
  }
};
