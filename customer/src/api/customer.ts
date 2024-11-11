import { CustomerService } from "../services/customer-service";
import { UserAuth } from "./middlewares/auth";

module.exports = (app: any) => {
  const service = new CustomerService();

  app.post("/customer/signup", async (req: any, res: any, next: any) => {
    try {
      const { email, password, phone } = req.body;
      const { data } = await service.SignUp({ email, password, phone });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/customer/login", async (req: any, res: any, next: any) => {
    try {
      const { email, password } = req.body;

      const { data } = await service.SignIn({ email, password });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post(
    "/customer/address",
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
    "/customer/profile",
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
    "/customer/shoping-details",
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
    "/customer/wishlist",
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
