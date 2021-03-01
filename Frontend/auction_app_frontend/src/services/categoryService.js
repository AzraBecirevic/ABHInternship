import { ENDPOINT, PORT } from "../constants/auth";

class CategoryService {
  async getCategories(isFirstCall) {
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
      var categoryList = await response.json();
      return categoryList;
    } else {
      return null;
    }
  }
}
export default CategoryService;
