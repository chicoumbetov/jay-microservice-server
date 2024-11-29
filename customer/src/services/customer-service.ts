const CustomerRepository = require("../database/repository/customer-repository");

const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../utils/app-errors");

// All Business logic will be here
class CustomerService {
  private repository: any;
  /*
  constructor() {
    this.repository = new CustomerRepository();
  }
  */

  async SignIn(userInputs: any) {
    const { email, password } = userInputs;

    try {
      const existingCustomer = await new CustomerRepository().FindCustomer({
        email,
      });

      if (existingCustomer) {
        const validPassword = await ValidatePassword(
          password,
          existingCustomer.password,
          existingCustomer.salt
        );

        if (validPassword) {
          const token = await GenerateSignature({
            email: existingCustomer.email,
            _id: existingCustomer._id,
          });
          return FormateData({ id: existingCustomer._id, token });
        }
      }

      return FormateData(null);
    } catch (err) {
      throw new APIError(
        "Data Not found",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find customer data",
        true
      ); // , err);
    }
  }

  async SignUp(userInputs: any) {
    const { email, password, phone } = userInputs;
    try {
      console.log(
        "Testing CustomerRepository access:",
        await new CustomerRepository().FindCustomer({ email })
      );
    } catch (error) {
      console.error("Repository test failed:", error);
    }
    try {
      // create salt
      let salt = await GenerateSalt();

      let userPassword = await GeneratePassword(password, salt);

      const existingCustomer = await new CustomerRepository().CreateCustomer({
        email,
        password: userPassword,
        phone,
        salt,
      });
      console.log("existing customer :", existingCustomer);

      if (existingCustomer) {
        const token = await GenerateSignature({
          email: email,
          _id: existingCustomer._id,
        });

        return FormateData({ id: existingCustomer._id, token });
      }
    } catch (err: any) {
      // ! APIError attend un entier pour statusCode
      console.log(
        "Sign up error :",
        err,
        "status code is err",
        err.statusCode,
        err.isOperational
      );

      throw new APIError(
        "SignUp Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create customer",
        true
      ); // , err);
    }
  }

  async AddNewAddress(
    _id: string,
    userInputs: {
      street: string;
      postalCode: string;
      city: string;
      country: string;
    }
  ) {
    const { street, postalCode, city, country } = userInputs;

    try {
      const addressResult = await this.repository.CreateAddress({
        _id,
        street,
        postalCode,
        city,
        country,
      });
      return FormateData(addressResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetProfile(id: { _id: string }) {
    try {
      const existingCustomer = await this.repository.FindCustomerById({ id });
      return FormateData(existingCustomer);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetShopingDetails(id: string) {
    try {
      const existingCustomer = await this.repository.FindCustomerById({ id });

      if (existingCustomer) {
        return FormateData(existingCustomer);
      }
      return FormateData({ msg: "Error" });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetWishList(customerId: string) {
    try {
      const wishListItems = await this.repository.Wishlist(customerId);
      return FormateData(wishListItems);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async AddToWishlist(customerId: string, product: any) {
    try {
      const wishlistResult = await this.repository.AddWishlistItem(
        customerId,
        product
      );
      return FormateData(wishlistResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async ManageCart(
    customerId: string,
    product: any,
    qty: any,
    isRemove: boolean
  ) {
    try {
      const cartResult = await this.repository.AddCartItem(
        customerId,
        product,
        qty,
        isRemove
      );
      return FormateData(cartResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async ManageOrder(customerId: string, order: any) {
    try {
      const orderResult = await this.repository.AddOrderToProfile(
        customerId,
        order
      );
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  // * Take care of communication with other services
  async SubscribeEvents(payload: any) {
    const { event, data } = payload;

    const { userId, product, order, qty } = data;

    switch (event) {
      case "ADD_TO_WISHLIST":
      case "REMOVE_FROM_WISHLIST":
        this.AddToWishlist(userId, product);
        break;
      case "ADD_TO_CART":
        this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
        break;
      case "CREATE_ORDER":
        this.ManageOrder(userId, order);
        break;
      case "TEST":
        console.log("WORKING ... Subscriber");

        break;
      default:
        break;
    }
  }
}

export { CustomerService };
