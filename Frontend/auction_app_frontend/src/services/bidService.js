import { ENDPOINT } from "../constants/auth";

class BidService {
  async getBidsByProductId(productId) {
    return await this.getData("/bid/byProductId/" + productId);
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

  async placeBid(productId, email, bidPrice, token) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        productId: productId,
        customerEmail: email,
        bidPrice: bidPrice,
      }),
    };

    const response = await fetch(ENDPOINT + "/bid/add", requestOptions).catch(
      (error) => {
        if (!error.response) {
          return null;
        } else {
          return;
        }
      }
    );

    if (!response || response.status === 404 || response.status === 400) {
      throw response;
    }
    if (response.status === 200) {
      var data = await response.json();
      return data;
    }
  }
}

export default BidService;
