import axios from "axios";

const baseURL = "https://localhost:7204/api/v1/ph-manager";

export const Login = async (loginDTO) => {
  const URL = `${baseURL}/login`;

  const form = new FormData();

  form.append("Email", loginDTO.email);
  form.append("Password", loginDTO.password);
  form.append("PINCode", loginDTO.pinCode);

  try {
    const response = await axios.post(URL, form, {
      withCredentials: true,
    });

    const result = response.data;

    return {
      IsSuccess: true,
      result,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: "فشل تسجيل الدخول!",
    };
  }
};

export const CheckLoginStatus = async (ManagerId) => {
  const URL = `${baseURL}/${ManagerId}/logged/status`;

  try {
    const response = await axios.get(URL, {
      withCredentials: true,
    });

    const result = response.data;

    return {
      IsSuccess: true,
      result,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response?.data?.message || "فشل التحقق !",
      statusCode: error.response?.status || 500,
    };
  }
};

export const ShowAdminsList = async (ManagerId) => {
  const URL = `${baseURL}/${ManagerId}/show/admins`;

  try {
    const response = await axios.get(URL, {
      withCredentials: true,
    });

    const result = response.data.admins ? response.data.admins : null;

    return {
      IsSuccess: true,
      result,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response?.data?.message || "فشل تحميل البيانات!",
    };
  }
};

export const DeleteAdmin = async (ManagerId, AdminId) => {
  const URL = `${baseURL}/${ManagerId}/admin/${AdminId}/delete`;

  try {
    const response = await axios.delete(URL, {
      withCredentials: true,
    });

    return {
      IsSuccess: response.data.result,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response?.data?.message || "فشل حضف المستخدم !",
    };
  }
};

export const ChangeActivateStatusForAdmin = async (changeStatus, ManagerId) => {
  const URL = `${baseURL}/${ManagerId}/change/admin/activate/status`;

  try {
    const response = await axios.put(
      URL,
      {
        UserId: changeStatus.userId,
        IsActive: changeStatus.isActive,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return {
      IsSuccess: response.data.result,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response?.data?.message || "فشل حضف المستخدم !",
    };
  }
};

export const PreRegisterAdminAPI = async (PreRegisterAdmin, ManagerId) => {
  const URL = `${baseURL}/${ManagerId}/admins/add/pre-register`;

  var form = new FormData();

  form.append("Email", PreRegisterAdmin.email);
  form.append("password", PreRegisterAdmin.password);

  try {
    const response = await axios.post(URL, form, {
      withCredentials: true,
    });

    const result = response.data.registerdPersonDTO;

    return {
      IsSuccess: true,
      result,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response?.data?.message || "فشل اضافة المستخدم",
      statusCode: error.response?.status,
    };
  }
};

export const RegisterAmdinAPI = async (AdminRegister, ManagerId) => {
  const URL = `${baseURL}/${ManagerId}/admins/add/register`;

  const form = new FormData();
  form.append("PersonRegisterDTO.PersonId", AdminRegister.personId);
  form.append("PersonRegisterDTO.FirstName", AdminRegister.firstName);
  form.append("PersonRegisterDTO.LastName", AdminRegister.lastName);
  form.append("PersonRegisterDTO.Phone", AdminRegister.phone);

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

export const PreRegisterManagerAPI = async (ManagerRegister) => {
  const URL = `${baseURL}/pre-register`;

  const form = new FormData();

  form.append("Email", ManagerRegister.Email);
  form.append("Password", ManagerRegister.Password);

  try {
    const response = await axios.post(URL, form, {
      withCredentials: true,
    });

    const result = response.data.preRegistredResult;

    return {
      IsSuccess: true,
      IsPreRegisterDone: result.isPersonRegistred,
      message: result.message,
      registerdPerson: result.registredPerson,
    };
  } catch (error) {
    return {
      IsSuccess: false,
      error: error.response?.data?.message,
    };
  }
};

export const RegisterManagerAPI = async (ManagerRegister) => {
  const URL = `${baseURL}/register`;

  const form = new FormData();

  form.append("PersonRegisterDTO.PersonId", ManagerRegister.PersonId);
  form.append("PersonRegisterDTO.FirstName", ManagerRegister.FirstName);
  form.append("PersonRegisterDTO.LastName", ManagerRegister.LastName);
  form.append("PersonRegisterDTO.Phone", ManagerRegister.Phone);
  form.append("Image", ManagerRegister.Image);

  try {
    const response = await axios.post(URL, form, {
      withCredentials: true,
    });

    const result = response.data;

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
