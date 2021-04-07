import { colors } from "@material-ui/core";
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
  GET_ACTIVE_PRODUCTS_ENDPOINT,
  GET_SOLD_PRODUCTS_ENDPOINT,
  GET_PRODUCTS_CUSTOMER_DID_BID_ENDPOINT,
  ADD_PRODUCT,
  ADD_PRODUCT_PHOTO,
} from "../constants/endpoints";
import ToastService from "./toastService";

class ProductService {
  toastService = new ToastService();

  async getProducts() {
    const requestOptions = {
      method: "GET",
    };
    return await this.getData(GET_OFFERED_PRODUCTS_ENDPOINT, requestOptions);
  }

  async getNewArrivals(fetchNumber) {
    const requestOptions = {
      method: "GET",
    };
    return await this.getData(
      GET_NEW_ARRIVALS_ENDPOINT + fetchNumber,
      requestOptions
    );
  }

  async getLastChance(fetchNumber) {
    const requestOptions = {
      method: "GET",
    };
    return await this.getData(
      GET_LAST_CHANCE_ENDPOINT + fetchNumber,
      requestOptions
    );
  }

  async getProductsByCategoryId(chosenCategory, fetchNumber) {
    const requestOptions = {
      method: "GET",
    };
    return await this.getData(
      GET_PRODUCTS_BY_CATEGORY_ENDPOINT + chosenCategory + "/" + fetchNumber,
      requestOptions
    );
  }

  async getProduct() {
    const requestOptions = {
      method: "GET",
    };
    return await this.getData(
      GET_MOST_EXPENSIVE_PRODUCT_ENDPOINT,
      requestOptions
    );
  }

  async getProductById(productId) {
    const requestOptions = {
      method: "GET",
    };
    return await this.getData(
      GET_PRODUCT_BY_ID_ENDPOINT + productId,
      requestOptions
    );
  }

  async getProductByName(productName) {
    const requestOptions = {
      method: "GET",
    };
    return await this.getData(
      GET_PRODUCT_BY_NAME + productName,
      requestOptions
    );
  }

  async getPriceFilterData() {
    const requestOptions = {
      method: "GET",
    };
    return await this.getData(GET_PRICE_FILTER_VALUES, requestOptions);
  }

  async getActiveProducts(userEmail, token) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: token,
      },
    };
    return await this.getData(
      GET_ACTIVE_PRODUCTS_ENDPOINT + userEmail,
      requestOptions
    );
  }

  async getSoldProducts(userEmail, token) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: token,
      },
    };
    return await this.getData(
      GET_SOLD_PRODUCTS_ENDPOINT + userEmail,
      requestOptions
    );
  }

  async getBidedProducts(email, token) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: token,
      },
    };
    return await this.getData(
      GET_PRODUCTS_CUSTOMER_DID_BID_ENDPOINT + email,
      requestOptions
    );
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
        sortType: filteredProducts.sortType,
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

  async addProduct(newProduct, email, token, setIsLoading) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        name: newProduct.name,
        startPrice: newProduct.startPrice,
        startDate: newProduct.startDate,
        startDateDay: newProduct.startDateDay,
        startDateMonth: newProduct.startDateMonth,
        startDateYear: newProduct.startDateYear,
        endDate: newProduct.endDate,
        endDateDay: newProduct.endDateDay,
        endDateMonth: newProduct.endDateMonth,
        endDateYear: newProduct.endDateYear,
        description: newProduct.description,
        subcategoryId: newProduct.subcategoryId,
        customerEmail: email,
      }),
    };

    const response = await fetch(ENDPOINT + ADD_PRODUCT, requestOptions).catch(
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

    if (response.status === 201) {
      var data = await response.json();
      setIsLoading(false);
      return data;
    } else {
      try {
        var data = await response.json();
        setIsLoading(false);
        this.toastService.showErrorToast(data.text);
        return null;
      } catch (err) {
        setIsLoading(false);
        this.toastService.showErrorToast("Photos could not be saved.");
      }
      return null;
    }
  }

  async savePhotos(imgFiles, productId, token, setIsLoading) {
    const formData = new FormData();
    for (let i = 0; i < imgFiles.length; i++) {
      formData.append("imgFiles", imgFiles[i].imgFile);
    }

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    };

    const response = await fetch(
      ENDPOINT + ADD_PRODUCT_PHOTO + productId,
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
      try {
        var data = await response.json();
        this.toastService.showErrorToast(data.text);
        return false;
      } catch (err) {}
      return false;
    }
  }

  async getData(link, requestOptions) {
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
