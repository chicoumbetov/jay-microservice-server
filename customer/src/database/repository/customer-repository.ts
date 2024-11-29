const { CustomerModel, AddressModel } = require("../models");
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-errors");

//Dealing with data base operations
class CustomerRepository {
  async CreateCustomer({
    email,
    password,
    phone,
    salt,
  }: {
    email: string;
    password: string;
    phone: any;
    salt: string;
  }) {
    try {
      const customer = new CustomerModel({
        email,
        password,
        salt,
        phone,
        address: [],
      });
      const customerResult = await customer.save();
      return customerResult;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Customer Repo or Model error"
      );
    }
  }

  async CreateAddress({
    _id,
    street,
    postalCode,
    city,
    country,
  }: {
    _id: string;
    street: string;
    postalCode: number;
    city: string;
    country: string;
  }) {
    try {
      const profile = await CustomerModel.findById(_id);

      if (profile) {
        const newAddress = new AddressModel({
          street,
          postalCode,
          city,
          country,
        });

        await newAddress.save();

        profile.address.push(newAddress);
      }

      return await profile.save();
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Create Address"
      );
    }
  }

  async FindCustomer({ email }: { email: string }) {
    try {
      const existingCustomer = await CustomerModel.findOne({ email: email });
      return existingCustomer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer"
      );
    }
  }

  async FindCustomerById({ id }: { id: string }) {
    try {
      const existingCustomer = await CustomerModel.findById(id).populate(
        "address"
      );
      /*
        .populate("wishlist")
        .populate("orders")
        .populate("cart.product");
        */
      return existingCustomer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer"
      );
    }
  }

  async Wishlist(customerId: string) {
    try {
      const profile = await CustomerModel.findById(customerId).populate(
        "wishlist"
      );

      return profile.wishlist;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Get Wishlist "
      );
    }
  }

  async AddWishlistItem(
    customerId: string,
    {
      _id,
      name,
      description,
      price,
      available,
      banner,
    }: {
      _id: string;
      name: string;
      description: string;
      price: number;
      available: boolean;
      banner: string;
    }
  ) {
    // product: any) {

    const product = { _id, name, description, price, available, banner };

    try {
      const profile = await CustomerModel.findById(customerId).populate(
        "wishlist"
      );

      if (profile) {
        let wishlist = profile.wishlist;

        if (wishlist.length > 0) {
          let isExist = false;
          wishlist.map((item: any) => {
            if (item._id.toString() === product._id.toString()) {
              const index = wishlist.indexOf(item);
              wishlist.splice(index, 1);
              isExist = true;
            }
          });

          if (!isExist) {
            wishlist.push(product);
          }
        } else {
          wishlist.push(product);
        }

        profile.wishlist = wishlist;
      }

      const profileResult = await profile.save();

      return profileResult.wishlist;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Add to WishList"
      );
    }
  }

  async AddCartItem(
    customerId: string,
    // * product:
    {
      _id,
      name,
      price,
      banner,
    }: {
      _id: string;
      name: string;
      price: number;
      banner: string;
    },
    qty: number,
    isRemove: boolean
  ) {
    try {
      const profile = await CustomerModel.findById(customerId).populate(
        // "cart.product"
        "cart"
      );

      if (profile) {
        const cartItem = {
          product: { _id, name, price, banner },
          unit: qty,
        };

        let cartItems = profile.cart;

        if (cartItems.length > 0) {
          let isExist = false;
          cartItems.map((item: any) => {
            if (item.product._id.toString() === _id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });

          if (!isExist) {
            cartItems.push(cartItem);
          }
        } else {
          cartItems.push(cartItem);
        }

        profile.cart = cartItems;

        const cartSaveResult = await profile.save();

        return cartSaveResult; // cartSaveResult.cart;
      }

      throw new Error("Unable to add to cart!");
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer"
      );
    }
  }

  async AddOrderToProfile(
    customerId: string,
    order: { _id: string; amount: string; date: Date }
  ) {
    try {
      const profile = await CustomerModel.findById(customerId);

      if (profile) {
        if (profile.orders == undefined) {
          profile.orders = [];
        }
        profile.orders.push(order);

        profile.cart = [];

        const profileResult = await profile.save();

        return profileResult;
      }

      throw new Error("Unable to add to order!");
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer"
      );
    }
  }
}

module.exports = CustomerRepository;

export default CustomerRepository;
