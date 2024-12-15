const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-errors");

// All Business logic will be here
class ShoppingService {
  private repository: any;
  constructor() {
    this.repository = new ShoppingRepository();
  }

  // * this method is in this service for future
  // * may be for transaction, promo, payment related stuff
  async getCart({ _id }: { _id: string }) {
    try {
      const cartItems = await this.repository.Cart(_id);

      return FormateData(cartItems);
    } catch (error) {
      throw new APIError("Error in getCart of shopping service");
    }
  }

  async PlaceOrder(userInput: { _id: string; transactionId: string }) {
    const { _id, transactionId } = userInput;

    // Verify the txn number with payment logs

    try {
      const orderResult = await this.repository.CreateNewOrder(
        _id,
        transactionId
      );
      return FormateData(orderResult);
    } catch (err) {
      // Type check for err to ensure compatibility with APIError constructor
      if (err instanceof Error) {
        throw new APIError("Data Not Found", 404, err.message, true); //,  err.stack);
      } else {
        throw new APIError("Data Not Found", 404, "Unknown error", true);
      }
    }
  }

  async GetOrders(customerId: string) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (err) {
      if (err instanceof Error) {
        throw new APIError("Data Not Found", 404, err.message, true); // , err.stack);
      } else {
        throw new APIError("Data Not Found", 404, "Unknown error", true);
      }
    }
  }

  // ? get order details

  async ManageCart(
    customerId: string,
    item: any,
    qty: number,
    isRemove: boolean
  ) {
    try {
      const cart_result = await this.repository.AddCartItem(
        customerId,
        item,
        qty,
        isRemove
      );

      return FormateData(cart_result);
    } catch (error) {
      throw error;
    }
  }

  // * Take care of communication with other services
  async SubscribeEvents(payload: string) {
    const parsedPayload = JSON.parse(payload);

    const { event, data } = parsedPayload;

    const { userId, product, qty } = data;

    switch (event) {
      case "ADD_TO_CART":
        this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
        break;
      case "TEST_SHOPPING_SERVICE_SUBSCRIBER":
        console.log("WORKING ...Shopping Subscriber");

        break;
      default:
        break;
    }
  }

  async GetOrderPayload(userId: string, order: any, event: string) {
    try {
      if (order) {
        const payload = {
          event,
          data: { userId, order },
        };
        return payload;
      } else {
        return FormateData({ error: "No Order Available" });
      }
    } catch (err) {
      throw new APIError("No Order is available. GetProductPayload func error");
    }
  }
}

export { ShoppingService };
