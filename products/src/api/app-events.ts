export const appEvents = (app: any) => {
  app.use("/app-events", async (req: any, res: any, next: any) => {
    const { payload } = req.body;

    console.log("============= Products Service received Event =============");
    return res.status(200).json(payload);
  });
};
