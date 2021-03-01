import { ENDPOINT, PORT } from "../constants/auth";
import ToastService from "./toastService";

class ProductService {
  toastService = new ToastService();

  showErrorMessage = (errorMessage) => {
    this.toastService.showErrorToast(errorMessage);
  };

  async getProducts(isFirstCall) {
    return await this.getData("/product/getOffered", isFirstCall);
  }

  async getNewArrivals(isFirstCall) {
    return await this.getData("/product/newArrivals", isFirstCall);
  }

  async getLastChance(isFirstCall) {
    return await this.getData("/product/lastChance", isFirstCall);
  }

  async getProductsByCategoryId(isFirstCall, chosenCategory) {
    return await this.getData(
      "/product/byCategory/" + chosenCategory,
      isFirstCall
    );
  }

  async getProduct(isFirstCall) {
    return await this.getData("/product/getMostExpensive", isFirstCall);
  }

  async getData(link, isFirstCall) {
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
    if (!response) {
      if (isFirstCall) {
        this.showErrorMessage("Connection refused. Please try later.");
      }
      return null;
    }
    if (response.status === 404) {
      if (isFirstCall) {
        this.showErrorMessage("Connection refused. Please try later.");
      }
      return null;
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
