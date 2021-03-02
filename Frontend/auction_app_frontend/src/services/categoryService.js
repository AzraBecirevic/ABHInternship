import { ENDPOINT, PORT } from "../constants/auth";

class CategoryService {
  async getCategories() {
    const requestOptions = {
      method: "GET",
    };
    const response = await fetch(
      ENDPOINT + PORT + "/category",
      requestOptions
    ).catch((error) => {
      if (!error.response) {
        return null;
      } else {
        return;
      }
    });
    if (!response || response.status === 404) {
      throw response;
    }

    if (response.status === 200) {
      var categoryList = await response.json();
      return categoryList;
    } else {
      return null;
    }
  }
}
export default CategoryService;
