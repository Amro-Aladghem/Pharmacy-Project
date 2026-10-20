import axios from "axios";

const baseURL = "https://localhost:7204/api/v1/pharmacy";

export const GetPharmaciesList = async (Paginated) => {
  let URL =
    `${baseURL}/list` +
    `?LastPharmacyId=${Paginated.LastPharmacyId}` +
    `&Limit=${Paginated.Limit}` +
    `&IsRowsCountCalculated=${Paginated.IsRowsCountCalculated}`;

  if (Paginated.GovernorateId) {
    URL += `&GovernorateId=${Paginated.GovernorateId}`;
  }

  if (Paginated.RegionId) {
    URL += `&RegionId=${Paginated.RegionId}`;
  }

  try {
    const response = await axios.get(URL);

    const { pharmacies, rowsCount, lastPharmacyId } =
      response.data.pharmaciesResult;

    const result = { pharmacies, rowsCount, lastPharmacyId };

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

export const GetNearerPharmaciesFromCustomer = async (CustomerId) => {
  const URL = `${baseURL}/nearest/${CustomerId}`;

  try {
    const response = await axios.get(URL);

    const pharmacies = response.data.pharmacies;

    return {
      IsSuccess: true,
      result: pharmacies,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response,
    };
  }
};

export const GetPharmacyProfileInfo = async (PharmacyId) => {
  const URL = `${baseURL}/show/${PharmacyId}`;

  try {
    const response = await axios.get(URL);

    const result = response.data.pharmacyDTO;

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

export const GetDeliveryFees = async (PharmacyId, CustomerId) => {
  const URL = `${baseURL}/deliveryfees?customerId=${CustomerId}&pharmacyId=${PharmacyId}`;

  try {
    const response = await axios.get(URL, {
      withCredentials: true,
      credentials: "include",
    });

    const result = response.data.result;

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

export const GetMeetingServiceInfo = async (PharmacyId) => {
  const URL = `${baseURL}/vediocall/info/${PharmacyId}`;

  try {
    const response = await axios.get(URL);

    const result = response.data.pharmacyVedioCall;

    return {
      IsSuccess: true,
      result,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      erorr: error.response,
    };
  }
};

export const GetPharmaciesThatHaveMeetingService = async (Paginated) => {
  const URL = `${baseURL}/list/have-meeting/?LastPharmacyId=${Paginated.LastPharmacyId}&Limit=${Paginated.Limit}&IsRowsCountCalculated=${Paginated.IsRowsCountCalculated}`;

  try {
    const response = await axios.get(URL);

    if (!response.data.pharmaciesResult) {
      return {
        IsSuccess: true,
        result: null,
      };
    }

    const { pharmacies, nextPage, lastPharmacyId } =
      response.data.pharmaciesResult;

    const result = { pharmacies, nextPage, lastPharmacyId };

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

export const GetPharmacySummeryInfo = async (phUserId) => {
  const URL = `${baseURL}/summary/info?userId=${phUserId}`;

  try {
    const response = await axios.get(URL, {
      withCredentials: true,
    });

    const result = response.data.info;

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

export const AddNewPharmacy = async (ManagerId, PharmacyInfo) => {
  const URL = `${baseURL}/add/new?ManagerId=${ManagerId}`;

  const form = new FormData();

  form.append("Name", PharmacyInfo.Name);
  form.append("ArabicName", PharmacyInfo.Name);
  form.append("About", PharmacyInfo.About);
  form.append("CountryId", PharmacyInfo.CountryId);
  form.append("GovernateId", PharmacyInfo.GovernateId);
  form.append("RegionId", PharmacyInfo.RegionId);
  form.append("Phone", PharmacyInfo.Phone);
  form.append("PhEmail", PharmacyInfo.PhEmail);
  form.append("Longitude", PharmacyInfo.longitude);
  form.append("Latitude", PharmacyInfo.latitude);
  form.append("StreetName", PharmacyInfo.StreetName);
  form.append("VedioCallPrice", PharmacyInfo.VedioCallPrice);
  form.append("IsHasDelivery", PharmacyInfo.IsHasDelivery);
  form.append("Image", PharmacyInfo.ImageURL);

  try {
    const response = await axios.post(URL, form, {
      withCredentials: true,
    });

    const result = response.data.pharmacy;

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

export const GetPharmacyCurrentBalance = async (userId, role) => {
  const URL = `${baseURL}/balance?userId=${userId}&role=${role}`;

  try {
    const response = await axios.get(URL, {
      withCredentials: true,
    });

    return {
      IsSuccess: true,
      result: response.data.balance,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response?.data?.message,
    };
  }
};
