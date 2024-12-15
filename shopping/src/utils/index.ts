const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = require("../config");

// * Utility functions
export const GenerateSalt = async (): Promise<string> => {
  return await bcryptjs.genSalt();
};

export const GeneratePassword = async (
  password: string,
  salt: string
): Promise<string> => {
  return await bcryptjs.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
): Promise<boolean> => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = async (
  payload: object
): Promise<string | Error> => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error instanceof Error
      ? error
      : new Error("Unknown error occurred during signature generation");
  }
};

export const ValidateSignature = async (req: any) => {
  try {
    const signature = req.get("Authorization");
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const FormateData = (data: any) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

// * ---------- REPLACED by message-broker.ts  ---------- * //
/*
export const PublishCustomerEvent = async (payload: any) => {
  try {
    console.log("PublishCustomerEvent called", payload);
    axios.post(`http://localhost:${GATEWAY_PORT}/customer/app-events`, {
      payload,
    });
  } catch {
    throw new Error("PublisherCustomerEvent from shopping error !");
  }
};
*/
