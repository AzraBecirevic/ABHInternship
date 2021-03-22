import { ENDPOINT } from "../constants/auth";
import { GET_SUBCATEGORIES_BY_CATEGORY_ID_ENDPOINT } from "../constants/endpoints";

class SubcategoryService {
  async getSubcategoriesByCategoryId(categoryId) {
    return this.getData(GET_SUBCATEGORIES_BY_CATEGORY_ID_ENDPOINT + categoryId);
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
}
export default SubcategoryService;
