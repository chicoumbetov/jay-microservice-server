import { APIError } from "../utils/app-errors";

const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
export class ShoppingService {
  private repository: any;

  constructor() {
    this.repository = new ShoppingRepository();
  }

  async PlaceOrder(userInput: { _id: string; txnNumber: string }) {
    const { _id, txnNumber } = userInput;

    // Verify the txn number with payment logs

    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
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
}
