import { STATUS_CODES } from "../../utils/app-errors";

const { ProductModel } = require("../models");
const { APIError, BadRequestError } = require("../../utils/app-errors");

interface ProductInput {
  name: string;
  desc: string;
  type: string;
  unit: number;
  price: number;
  available: boolean;
  supplier: string;
  banner: string;
}

//Dealing with data base operations
class ProductRepository {
  async CreateProduct({
    name,
    desc,
    type,
    unit,
    price,
    available,
    supplier,
    banner,
  }: ProductInput) {
    try {
      const product = new ProductModel({
        name,
        desc,
        type,
        unit,
        price,
        available,
        supplier,
        banner,
      });

      const productResult = await product.save();
      return productResult;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Product"
      );
    }
  }

  async Products() {
    try {
      return await ProductModel.find();
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Get Products"
      );
    }
  }

  async FindById(id: string) {
    try {
      const found_product = await ProductModel.findById(id);
      if (!found_product) {
        throw new APIError(
          "Product Not Found",
          STATUS_CODES.NOT_FOUND,
          `Product with ID ${id} does not exist`
        );
      }

      return found_product;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Product"
      );
    }
  }

  async FindByCategory(category: any) {
    try {
      const products = await ProductModel.find({ type: category });
      return products;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Category"
      );
    }
  }

  async FindSelectedProducts(selectedIds: any) {
    try {
      const products = await ProductModel.find()
        .where("_id")
        .in(selectedIds.map((_id: string) => _id))
        .exec();
      return products;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Product"
      );
    }
  }
}

module.exports = ProductRepository;
