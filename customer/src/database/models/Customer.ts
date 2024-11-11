const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    email: String,
    password: String,
    salt: String,
    phone: String,
    address: [{ type: Schema.Types.ObjectId, ref: "address", require: true }],
    cart: [
      {
        product: { type: Schema.Types.ObjectId, ref: "product", require: true },
        unit: { type: Number, require: true },
      },
    ],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
        require: true,
      },
    ],
    orders: [{ type: Schema.Types.ObjectId, ref: "order", require: true }],
  },
  {
    toJSON: {
      transform(doc: any, ret: any) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

export const CustomerModel = mongoose.model("customer", CustomerSchema);
