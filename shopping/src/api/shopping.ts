import { ShoppingService } from "../services/shopping-service";
// const UserService = require("../services/customer-service");
import { UserAuth } from "./middlewares/auth";

// *import { PublishCustomerEvent } from "../utils";
// *Replaced by MessageBroker by passing channel in parameters
const { SubscribeMessage, PublishMessage } = require("../utils/message-broker");
const { CUSTOMER_BINDING_KEY } = require("../config");

module.exports = (app: any, channel: any) => {
  const service: {
    PlaceOrder: ({
      _id,
      transactionId,
    }: {
      _id: string;
      transactionId: string;
    }) => any;
    GetOrderPayload: (_id: string, data: any, event: "CREATE_ORDER") => any;
    GetOrders: (_id: string) => any;
    getCart: ({ _id }: { _id: string }) => any;
  } = new ShoppingService();
  // * removed in order to transite from Monolith to MS
  // * const userService = new UserService();

  SubscribeMessage(channel, service);

  app.post("/order", UserAuth, async (req: any, res: any, next: any) => {
    const { _id } = req.user;
    const { transactionId } = req.body;

    try {
      const { data } = await service.PlaceOrder({ _id, transactionId });

      // * Call event in customer/src/services/customer-service.ts
      const payload = await service.GetOrderPayload(_id, data, "CREATE_ORDER");

      // * PublishCustomerEvent(payload);
      // * Replace by Message Broker Publisher:
      PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(payload));

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/orders", UserAuth, async (req: any, res: any, next: any) => {
    const { _id } = req.user;

    try {
      // * Monolith to MS
      // * const { data } = await userService.GetShopingDetails(_id);
      const { data } = await service.GetOrders(_id);

      return res.status(200).json(data); // .json(data.orders);
    } catch (err) {
      next(err);
    }
  });

  app.get("/cart", UserAuth, async (req: any, res: any, next: any) => {
    const { _id } = req.user;
    try {
      // * Monolith to MS
      // * const { data } = await userService.GetShopingDetails(_id);

      if (_id) {
        const { data } = await service.getCart({ _id });
        return res.status(200).json(data); // (data.cart);
      }
      // TODO: handle when empty
    } catch (err) {
      next(err);
    }
  });
};
