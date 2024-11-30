const { ProductRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-errors");

// All Business logic will be here
class ProductService {
  private repository: any;
  constructor() {
    this.repository = new ProductRepository();
  }

  async CreateProduct(productInputs: any) {
    console.log("CreateProduct service this.repository :", this.repository);
    try {
      const productResult = await this.repository.CreateProduct(productInputs);
      return FormateData(productResult);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProducts() {
    try {
      const products = await this.repository.Products();

      let categories: { [key: string]: string } = {};

      products.map(({ type }: any) => {
        categories[type] = type;
      });

      return FormateData({
        products,
        categories: Object.keys(categories),
      });
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductDescription(productId: string) {
    try {
      const product = await this.repository.FindById(productId);
      return FormateData(product);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductsByCategory(category: any) {
    try {
      const products = await this.repository.FindByCategory(category);
      return FormateData(products);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetSelectedProducts(selectedIds: any) {
    try {
      const products = await this.repository.FindSelectedProducts(selectedIds);
      return FormateData(products);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductById(productId: string) {
    try {
      return await this.repository.FindById(productId);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductPayload(
    userId: string,
    { productId, qty }: { productId: string; qty?: number },
    event: string
  ) {
    try {
      const product = await this.repository.FindById(productId);

      if (product) {
        const payload = {
          event,
          data: { userId, product, qty },
        };
        return FormateData(payload);
      }
    } catch (err) {
      throw new APIError("Not product available. GetProductPayload func error");
    }
  }
}

export { ProductService };
