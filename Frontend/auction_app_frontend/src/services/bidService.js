import { ENDPOINT, PORT } from "../constants/auth";

class BidService {
  async getBidsByProductId(productId) {
    return await this.getData("/bid/byProductId/" + productId);
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

export default BidService;
