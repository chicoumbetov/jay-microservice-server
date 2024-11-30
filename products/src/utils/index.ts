const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { APP_SECRET, GATEWAY_PORT } = require("../config");

//Utility functions
export const GenerateSalt = async (): Promise<string> => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (
  password: string,
  salt: string
): Promise<string> => {
  return await bcrypt.hash(password, salt);
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
    console.log(
      "GenerateSignature APP_SECRET",
      APP_SECRET,
      "payload :",
      payload
    );

    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log("Error in GenerateSignature", error);
    return error instanceof Error
      ? error
      : new Error("Unknown error occurred during signature generation");
  }
};

export const ValidateSignature = async (req: any) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
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

export const PublishCustomerEvent = async (payload: any) => {
  try {
    axios.post(`http://localhost:${GATEWAY_PORT}/customer/app-events`, {
      payload,
    });
  } catch {
    throw new Error("PublisherCustomerEvent error !");
  }
};

export const PublishShoppingEvent = async (payload: any) => {
  try {
    // ! refactor process.env.GATEWAY_PORT using
    axios.post(`http://localhost:${GATEWAY_PORT}/shopping/app-events`, {
      payload,
    });
  } catch {
    throw new Error("PublisherShoppingEvent error !");
  }
};
