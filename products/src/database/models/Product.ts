const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String },
  desc: { type: String },
  banner: { type: String },
  type: { type: String },
  unit: { type: Number },
  price: { type: Number },
  available: { type: Boolean },
  supplier: { type: String },
});

module.exports = mongoose.model("product", ProductSchema);
