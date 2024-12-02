import { ShoppingService } from "../services/shopping-service";

export const appEvents = (app: any) => {
  const service = new ShoppingService();

  app.use("/app-events", async (req: any, res: any, next: any) => {
    const { payload } = req.body;

    service.SubscribeEvents(payload);

    console.log("============= Shopping Service received Event =============");
    return res.status(200).json(payload);
  });
};
