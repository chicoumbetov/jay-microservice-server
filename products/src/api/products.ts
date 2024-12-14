import { UserAuth } from "./middlewares/auth";
const { ProductService } = require("../services/product-service");
// * Déconnecter: import { CustomerService } from "../services/customer-service";
// * Replace by Publisher Events
// * const { PublishCustomerEvent, PublishShoppingEvent } = require("../utils");

// * PublishEvents above are replace also by PublishMessage of MESSAGE BROKER
const { PublishMessage } = require("../utils");
const { SHOPPING_BINDING_KEY, CUSTOMER_BINDING_KEY } = require("../config");

module.exports = (app: any, channel: any) => {
  const service = new ProductService();
  // * Déconnecter: const customerService = new CustomerService();

  app.post("/product/create", async (req: any, res: any, next: any) => {
    try {
      const { name, desc, type, unit, price, available, supplier, banner } =
        req.body;
      // validation
      const { data } = await service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        supplier,
        banner,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/category/:type", async (req: any, res: any, next: any) => {
    const type = req.params.type;

    try {
      const { data } = await service.GetProductsByCategory(type);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/:id", async (req: any, res: any, next: any) => {
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/ids", async (req: any, res: any, next: any) => {
    try {
      const { ids } = req.body;
      const products = await service.GetSelectedProducts(ids);
      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  });

  app.put("/wishlist", UserAuth, async (req: any, res: any, next: any) => {
    const { _id } = req.user;
    try {
      //* Transition from Monolith to MS */
      // * Get Payload & Send to Customer MS
      const { data } = await service.GetProductPayload(
        _id,
        {
          productId: req.body._id,
        },
        "ADD_TO_WISHLIST"
      );
      // * should match to SubscribeEvents of
      // * customer/src/services/customer-service.ts
      // * in order to call AddToWishlist funciton

      // * PublishCustomerEvent(data); Event Driven Updates
      // * Message Broker publisher:
      PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(data));

      /* // * Replace by code above - 
      const product = await service.GetProductById(req.body._id);
      const wishList = await customerService.AddToWishlist(_id, product);
      return res.status(200).json(wishList);
      */
      return res.status(200).json(data.data.product);
    } catch (err) {
      console.log("Wishlist api error :", err);
    }
  });

  app.delete(
    "/wishlist/:id",
    UserAuth,
    async (req: any, res: any, next: any) => {
      const { _id } = req.user;
      const productId = req.params.id;

      try {
        const { data } = await service.GetProductPayload(
          _id,
          {
            productId,
          },
          "REMOVE_FROM_WISHLIST"
        );

        // * PublishCustomerEvent(data);
        // * Replace by PublishMessage of MESSAGE BROKER:
        PublishMessage(
          channel,
          CUSTOMER_BINDING_KEY,
          JSON.stringify(data),
          "Customer"
        );

        return res.status(200).json(data.data.product);
      } catch (err) {
        next(err);
      }
    }
  );

  app.put("/cart", UserAuth, async (req: any, res: any, next: any) => {
    const { _id } = req.user;
    // const { _id, qty } = req.body;

    try {
      const { data } = await service.GetProductPayload(
        _id,
        {
          productId: req.body._id,
          qty: req.body.qty,
        },
        "ADD_TO_CART"
      );

      // PublishCustomerEvent(data);
      // PublishShoppingEvent(data);
      // * Replace by PublishMessage of MESSAGE BROKER:
      PublishMessage(
        channel,
        CUSTOMER_BINDING_KEY,
        JSON.stringify(data),
        "Customer"
      );
      PublishMessage(
        channel,
        SHOPPING_BINDING_KEY,
        JSON.stringify(data),
        "Shopping"
      );
      const result = {
        product: data.data.product,
        unit: data.data.qty,
      };
      /* // * Monolith to MS
      const product = await service.GetProductById(_id);
      const result = await customerService.ManageCart(
        req.user._id,
        product,
        qty,
        false
      );
      
      */
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/cart/:id", UserAuth, async (req: any, res: any, next: any) => {
    const { _id } = req.user;
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductPayload(
        _id,
        { productId },
        "REMOVE_FROM_CART"
      );

      // * PublishCustomerEvent(data);
      // * PublishShoppingEvent(data);
      // * Replace by PublishMessage of MESSAGE BROKER:
      PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(data));
      PublishMessage(channel, SHOPPING_BINDING_KEY, JSON.stringify(data));

      const result = {
        product: data.data.product,
        unit: data.data.qty,
      };
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  // * get Top products and category
  app.get("/", async (req: any, res: any, next: any) => {
    //check validation
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
};
