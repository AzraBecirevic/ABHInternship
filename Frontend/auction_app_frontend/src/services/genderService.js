import { ENDPOINT } from "../constants/auth";
import { GET_GENDERS } from "../constants/endpoints";

class GenderService {
  async getGenders(token) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: token,
      },
    };
    const response = await fetch(ENDPOINT + GET_GENDERS, requestOptions).catch(
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
export default GenderService;
