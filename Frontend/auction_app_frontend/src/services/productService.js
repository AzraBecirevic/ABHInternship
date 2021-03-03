import { ENDPOINT, PORT } from "../constants/auth";

class ProductService {
  async getProducts() {
    return await this.getData("/product/getOffered");
  }

  async getNewArrivals(fetchNumber) {
    return await this.getData("/product/newArrivals/" + fetchNumber);
  }

  async getLastChance(fetchNumber) {
    return await this.getData("/product/lastChance/" + fetchNumber);
  }

  async getProductsByCategoryId(chosenCategory, fetchNumber) {
    return await this.getData(
      "/product/byCategory/" + chosenCategory + "/" + fetchNumber
    );
  }

  async getProduct() {
    return await this.getData("/product/getMostExpensive");
  }

  async getData(link) {
    const requestOptions = {
      method: "GET",
    };
    const response = await fetch(ENDPOINT + PORT + link, requestOptions).catch(
      (error) => {
        if (!error.response) {
          return null;
        } else {
          return;
        }
      }
    );
    if (!response || response.status === 404) {
      throw response;
    }

    if (response.status === 200) {
      var data = await response.json();
      return data;
    } else {
      return null;
    }
  }
}
export default ProductService;
