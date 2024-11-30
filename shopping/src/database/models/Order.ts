const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    orderId: String,
    customerId: String,
    amount: Number,
    status: String,
    txnId: String,
    items: [
      // * replace object same as in CartModel
      {
        product: {
          // * same as product in Product MS:
          // * products/src/database/models/Product.ts
          _id: { type: String, require: true },
          name: { type: String },
          desc: { type: String },
          banner: { type: String },
          type: { type: String },
          unit: { type: Number },
          price: { type: Number },
          available: { type: Boolean },
          supplier: { type: String },
        },
        unit: { type: Number, require: true },
      },
      /* // * Transition from Monolith to MS. Déconnecter "product"
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        unit: { type: Number, require: true },
      },
      */
    ],
  },
  {
    toJSON: {
      transform(doc: any, ret: any) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("order", OrderSchema);
export default OrderSchema;
