const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  street: String,
  postalCode: String,
  city: String,
  country: String,
});

export const AddressModel = mongoose.model("address", AddressSchema);
