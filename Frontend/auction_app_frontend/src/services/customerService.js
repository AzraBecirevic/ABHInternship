import { ENDPOINT } from "../constants/auth";
import { GET_CUSTOMER_INFO_DATA } from "../constants/endpoints";

class CustomerService {
  async getCustomerInfoData(email, token) {
    return await this.getData(GET_CUSTOMER_INFO_DATA + email, token);
  }

  async getData(link, token) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: token,
      },
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
export default CustomerService;
