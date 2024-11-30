const { ValidateSignature } = require("../../utils");

const UserAuth = async (req: Express.Request, res: any, next: any) => {
  const isAuthorized = await ValidateSignature(req);

  if (isAuthorized) {
    return next();
  }
  return res.status(403).json({ message: "Not Authorized" });
};

export { UserAuth };
