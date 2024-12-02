import { STATUS_CODES } from "../../utils/app-errors";

const { OrderModel, CartModel } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { APIError, BadRequestError } = require("../../utils/app-errors");

//Dealing with data base operations
class ShoppingRepository {
  // payment

  async Orders(customerId: string) {
    try {
      const orders = await OrderModel.find({ customerId });

      // * No need anymore since Product is already in OrderModel & disconnected from Product MS
      // .populate("items.product");
      return orders;
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Orders"
      );
    }
  }

  async Cart(customerId: string) {
    try {
      const cartItems = await CartModel.find({ customerId });
      if (cartItems) {
        return cartItems;
      }
    } catch (error) {}
  }

  // * Same as in Customer MS:
  // * customer/src/database/repository/customer-repository.ts
  async AddCartItem(
    customerId: string,
    // * product:
    item: {
      _id: string;
      name: string;
      price: number;
      banner: string;
    },
    qty: number,
    isRemove: boolean
  ) {
    try {
      const cart = await CartModel.findOne({ customerId });
      // .populate("cart"); "cart.product"
      const { _id } = item;

      if (cart) {
        let isExist = false;
        let cartItems = cart.items;

        if (cartItems?.length > 0) {
          cartItems.map((item: any) => {
            if (item.product._id.toString() === _id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });
        }

        if (!isExist && !isRemove) {
          cartItems.push({ product: { ...item }, unit: qty });
        }

        cart.items = cartItems;
        return await cart.save();
        /*  // * Move from Monolith to MS
        profile.cart = cartItems;
        const cartSaveResult = await profile.save();
        return cartSaveResult; // cartSaveResult.cart;
        */
      } else {
        // cartItems.push(cartItem);
        return await CartModel.create({
          customerId,
          items: [{ product: { ...item }, unit: qty }],
        });
      }
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer"
      );
    }
  }

  async CreateNewOrder(customerId: string, transactionId: string) {
    // * check transaction for payment Status

    try {
      const cart = await CartModel.findOne({ customerId });
      // * From Monolith to MS
      // const profile = await CustomerModel.findById(customerId).populate("cart.product");

      if (cart) {
        let amount = 0;

        let cartItems = cart.items; // profile.cart;

        if (cartItems.length > 0) {
          // * process Order
          cartItems.map((item: any) => {
            amount += parseInt(item.product.price) * parseInt(item.unit);
          });

          const orderId = uuidv4();

          const order = new OrderModel({
            orderId,
            customerId,
            amount,
            transactionId,
            status: "received",
            items: cartItems,
          });

          cart.items = [];
          // profile.cart = [];
          // order.populate("items.product").execPopulate();
          const orderResult = await order.save();

          // profile.orders.push(orderResult);
          // orders.push(orderResult);

          // await profile.save();
          await cart.save();

          return orderResult;
        }
      }

      return {};
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Category"
      );
    }
  }
}

module.exports = ShoppingRepository;
