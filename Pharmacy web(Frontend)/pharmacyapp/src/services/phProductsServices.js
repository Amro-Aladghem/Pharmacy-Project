import axios from "axios";

const baseURL = "https://localhost:7204/api/v1/phproducts";

export const GetProducts = async (Paginated) => {
  let URL =
    `${baseURL}?LastPhProductId=${Paginated.LastPhProductId}` +
    `&Limit=${Paginated.Limit}` +
    `&IsRowsCountCalculated=${Paginated.IsRowsCountCalculated}` +
    `&CategoryId=${Paginated.CategoryId}`;

  if (Paginated.GovernorateId) {
    URL += `&GovernorateId=${Paginated.GovernorateId}`;
  }

  if (Paginated.RegionId) {
    URL += `&RegionId=${Paginated.RegionId}`;
  }

  try {
    const response = await axios.get(URL);

    const { products, nextPage, total, lastPhProductId } =
      response.data.productsResult;

    const result = { products, nextPage, total, lastPhProductId };

    return {
      IsSuccess: true,
      result,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response,
    };
  }
};

export const GetProductFromSearchingByName = async (Paginated) => {
  let encodedSearchText = encodeURIComponent(Paginated.searchtext);

  const URL = `${baseURL}/search?searchtext=${encodedSearchText}&LastPhProductId=${Paginated.LastPhProductId}`;

  try {
    const response = await axios.get(URL);

    if (!response.data.productsResult) {
      return {
        IsSuccess: true,
        result: null,
      };
    }

    const { products, nextPage, total, lastPhProductId } =
      response.data.productsResult;

    const result = { products, nextPage, total, lastPhProductId };

    return {
      IsSuccess: true,
      result,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response,
    };
  }
};

export const GetPharmacyProducts = async (Paginated) => {
  let URL = `${baseURL}/list?pharmacyid=${Paginated.PharmacyId}&LastPhProductId=${Paginated.LastPhProductId}&Limit=${Paginated.Limit}&IsRowsCountCalculated=${Paginated.IsRowsCountCalculated}`;

  try {
    const response = await axios.get(URL);

    if (!response.data.products) {
      return {
        IsSuccess: true,
        result: null,
      };
    }

    const { products, nextPage, total, lastPhProductId } =
      response.data.products;

    const result = { products, nextPage, total, lastPhProductId };

    return {
      IsSuccess: true,
      result,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      result: error.response,
    };
  }
};

export const GetProductFullInfo = async (ProductId) => {
  const URL = `${baseURL}/info/${ProductId}`;

  try {
    const response = await axios.get(URL);

    const result = response.data;

    return {
      IsSuccess: true,
      result,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response,
    };
  }
};

export const GetProductDescription = async (ProductId) => {
  const URL = `${baseURL}/description/${ProductId}`;

  try {
    const response = await axios.get(URL);

    const result = response.data;

    return {
      IsSuccess: true,
      result,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response,
    };
  }
};

export const UpdateProduct = async (
  phUserId,
  role,
  updatedProduct,
  productId
) => {
  const URL = `${baseURL}/update?userId=${phUserId}&role=${role}`;

  const form = new FormData();

  form.append("PhProductId", productId);
  form.append("PhProduct.PharamcyId", updatedProduct.pharamcyId);
  form.append("PhProduct.Name", updatedProduct.name);
  form.append("PhProduct.PhDescription", updatedProduct.phDescription);
  form.append("PhProduct.Price", updatedProduct.price);
  form.append("PhProduct.Stoke", updatedProduct.stoke);
  form.append("PhProduct.ProducedDate", updatedProduct.producedDate);
  form.append("PhProduct.EndDate", updatedProduct.endDate);
  form.append("PhProduct.MedicalTypeId", updatedProduct.medicalTypeId);
  form.append("PhProduct.MedicalQuantity", updatedProduct.medicalQuantity);
  form.append("PhProduct.CategoryId", updatedProduct.categoryId);

  try {
    const response = await axios.put(URL, form, {
      withCredentials: true,
    });

    return {
      IsSuccess: true,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      result: error.response?.data?.message,
    };
  }
};

export const DeleteProduct = async (phUserId, role, productId) => {
  const URL = `${baseURL}/${productId}/delete?userId=${phUserId}&role=${role}`;

  try {
    const response = await axios.delete(URL, {
      withCredentials: true,
    });

    return {
      IsSuccess: true,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response?.data?.message,
    };
  }
};

export const GetProductFullInfoForPhUser = async (ProductId) => {
  const URL = `${baseURL}/${ProductId}/full-info`;

  try {
    const response = await axios.get(URL);

    const result = response.data.productInfo;

    return {
      IsSuccess: true,
      result,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response?.data?.message,
    };
  }
};

export const GetMatchSysProductsByName = async (Name) => {
  const URL = `${baseURL}/sysproducts/search?searchtext=${Name}`;

  try {
    const response = await axios.get(URL);
    const result = response.data.products;

    return {
      IsSuccess: true,
      result,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      reuslt: error.response?.data?.message,
    };
  }
};

export const AddNewPhProductAPI = async (PhProduct, phUserId, role) => {
  const URL = `${baseURL}/add?UserId=${phUserId}&role=${role}`;

  const sysProductId = PhProduct.IsNewProduct ? 0 : PhProduct.SysProductId;
  const Image = PhProduct.IsNewProduct ? PhProduct.Image : null;
  const sysDescription = PhProduct.PhDescription;

  const form = new FormData();

  form.append("SysProduct.SysProductId", sysProductId);
  form.append("SysProduct.ProductName", PhProduct.Name);
  form.append("SysProduct.Description", sysDescription);
  form.append("Image", Image);

  form.append("PhProduct.PharamcyId", PhProduct.PharmacyId);
  form.append("PhProduct.Name", PhProduct.Name);
  form.append("PhProduct.PhDescription", PhProduct.PhDescription);
  form.append("PhProduct.Price", PhProduct.Price);
  form.append("PhProduct.Stoke", PhProduct.Stoke);
  form.append("PhProduct.ProducedDate", PhProduct.ProducedDate);
  form.append("PhProduct.EndDate", PhProduct.EndDate);
  form.append("PhProduct.MedicalTypeId", PhProduct.MedicalTypeId);
  form.append("PhProduct.MedicalQuantity", PhProduct.MedicalQuantity);
  form.append("PhProduct.CategoryId", PhProduct.CategoryId);

  try {
    const response = await axios.post(URL, form, {
      withCredentials: true,
    });

    return {
      IsSuccess: true,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response?.data?.message,
    };
  }
};
