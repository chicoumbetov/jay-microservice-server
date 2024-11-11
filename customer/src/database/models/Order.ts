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
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        unit: { type: Number, require: true },
      },
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

export const OrderModel = mongoose.model("order", OrderSchema);
