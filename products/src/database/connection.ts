import mongoose, { ConnectOptions } from "mongoose";
const {
  DB_URL, // LOCAL_DB_URL,
} = require("../config");

module.exports = async () => {
  try {
    await mongoose.connect(
      DB_URL, // LOCAL_DB_URL,
      {} as ConnectOptions
    );
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    console.log("Products Db Connected");
  } catch (error) {
    console.log("Error ============");
    console.log(error);
    process.exit(1);
  }
};
