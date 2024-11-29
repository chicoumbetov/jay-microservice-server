import { CustomerService } from "../services/customer-service";

export const appEvents = (app: any) => {
  const service = new CustomerService();

  app.use("/app-events", async (req: any, res: any, next: any) => {
    const { payload } = req.body;
    service.SubscribeEvents(payload);

    console.log("============= Customer Service received Event =============");
    return res.status(200).json(payload);
  });
};
