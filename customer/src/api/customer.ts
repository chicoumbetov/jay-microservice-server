import { CustomerService } from "../services/customer-service";
import { UserAuth } from "./middlewares/auth";

module.exports = (app: any) => {
  const service = new CustomerService();

  app.post("/signup", async (req: any, res: any, next: any) => {
    // /customer/signup
    try {
      const { email, password, phone } = req.body;
      const { data } = await service.SignUp({ email, password, phone });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/login", async (req: any, res: any, next: any) => {
    // /customer/login
    try {
      const { email, password } = req.body;

      const { data } = await service.SignIn({ email, password });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post(
    "/address", // "/customer/address",
    UserAuth,
    async (req: any, res: any, next: any) => {
      try {
        const { _id } = req.user;

        const { street, postalCode, city, country } = req.body;

        const { data } = await service.AddNewAddress(_id, {
          street,
          postalCode,
          city,
          country,
        });

        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/profile", // "/customer/profile",
    UserAuth,
    async (req: any, res: any, next: any) => {
      try {
        const { _id } = req.user;
        const { data } = await service.GetProfile({ _id });
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/shoping-details", // "/customer/shoping-details",
    UserAuth,
    async (req: any, res: any, next: any) => {
      try {
        const { _id } = req.user;
        const { data } = await service.GetShopingDetails(_id);

        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/wishlist", // "/customer/wishlist",
    UserAuth,
    async (req: any, res: any, next: any) => {
      try {
        const { _id } = req.user;
        const { data } = await service.GetWishList(_id);
        return res.status(200).json(data);
      } catch (err) {
        next(err);
      }
    }
  );
};
