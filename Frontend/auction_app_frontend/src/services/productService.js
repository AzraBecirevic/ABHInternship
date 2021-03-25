import { Router } from "react-router";
import { ENDPOINT } from "../constants/auth";
import {
  GET_LAST_CHANCE_ENDPOINT,
  GET_NEW_ARRIVALS_ENDPOINT,
  GET_OFFERED_PRODUCTS_ENDPOINT,
  GET_PRODUCTS_BY_CATEGORY_ENDPOINT,
  GET_MOST_EXPENSIVE_PRODUCT_ENDPOINT,
  GET_PRODUCT_BY_ID_ENDPOINT,
  GET_PRODUCT_BY_NAME,
  GET_FILTERED_PRODUCTS,
  GET_PRICE_FILTER_VALUES,
} from "../constants/endpoints";

class ProductService {
  async getProducts() {
    return await this.getData(GET_OFFERED_PRODUCTS_ENDPOINT);
  }

  async getNewArrivals(fetchNumber) {
    return await this.getData(GET_NEW_ARRIVALS_ENDPOINT + fetchNumber);
  }

  async getLastChance(fetchNumber) {
    return await this.getData(GET_LAST_CHANCE_ENDPOINT + fetchNumber);
  }

  async getProductsByCategoryId(chosenCategory, fetchNumber) {
    return await this.getData(
      GET_PRODUCTS_BY_CATEGORY_ENDPOINT + chosenCategory + "/" + fetchNumber
    );
  }

  async getProduct() {
    return await this.getData(GET_MOST_EXPENSIVE_PRODUCT_ENDPOINT);
  }

  async getProductById(productId) {
    return await this.getData(GET_PRODUCT_BY_ID_ENDPOINT + productId);
  }

  async getProductByName(productName) {
    return await this.getData(GET_PRODUCT_BY_NAME + productName);
  }

  async getPriceFilterData() {
    return await this.getData(GET_PRICE_FILTER_VALUES);
  }

  async getFilteredProducts(filteredProducts, filterFetchNumber) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryIds: filteredProducts.categoryIds,
        subcategoryIds: filteredProducts.subcategoryIds,
        productName: filteredProducts.productName,
        fetchNumber: filterFetchNumber,
        minPrice: filteredProducts.minPrice,
        maxPrice: filteredProducts.maxPrice,
      }),
    };

    const response = await fetch(
      ENDPOINT + GET_FILTERED_PRODUCTS,
      requestOptions
    ).catch((error) => {
      if (!error.response) {
        return null;
      } else {
        return;
      }
    });
    if (!response) {
      throw response;
    }

    if (response.status === 200) {
      var data = await response.json();
      return data;
    } else {
      return null;
    }
  }

  async getData(link) {
    const requestOptions = {
      method: "GET",
    };
    const response = await fetch(ENDPOINT + link, requestOptions).catch(
      (error) => {
        if (!error.response) {
          return null;
        } else {
          return;
        }
      }
    );
    if (!response) {
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
