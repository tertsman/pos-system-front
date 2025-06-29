// import axios from "axios";
// import { config } from "./config";
// import { setServerStatus } from "../Store/server.Store";
// import { getAccessToken } from "../Store/profile.store";

// export const request = async (url = "", method = "get", data = {}) => {
//   const access_token = getAccessToken();
//   if (!access_token) {
//     console.error("No access token found! Please login again.");
//     return { error: true, message: "No access token. Please login again." };
//   }

//   let headers = {
//     "Content-Type": "application/json",
//   };

//   if (data instanceof FormData) {
//     // ចំពោះ FormData យើងមិនកំណត់ Content-Type ទេ
//     headers = {
//       Authorization: `Bearer ${access_token}`,
//       // no Content-Type here so axios/browser will auto-set it
//     };
//   } else {
//     // ជាទូទៅ
//     headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${access_token}`,
//     };
//   }
  
//   let param_query = "";
// if (method === "get" && data && typeof data === "object") {
//   const queryString = Object.entries(data)
//     .filter(([_, v]) => v !== "" && v !== null && v !== undefined)
//     .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
//     .join("&");
//   if (queryString.length) {
//     param_query = "?" + queryString;
//   }
// }

//   try {
//     const response = await axios({
//       url: config.base_url + url + param_query,
//       method: method,
//       data: data,
//       withCredentials: true,
//       headers: {
//         ...headers,
//         Authorization: `Bearer ${access_token}`, // Attach access token
//       },
//     });

//     setServerStatus(200); // Update server status to success
//     return response.data; // Return response data
//   } catch (err) {
//     const { response } = err;
//     if (response) {
//       const { status, data } = response;
//       console.error("Error Response:", data);

//       // Update server status for specific errors
//       if (status === 401 || status === 403) {
//         setServerStatus(403); // Unauthorized/Forbidden
//       } else {
//         setServerStatus(status || 500); // Other HTTP errors
//       }

//       return {
//         error: true,
//         status: status,
//         message: data?.message || "Request failed.",
//       };
//     } else if (err.code === "ERR_NETWORK") {
//       // Handle network errors
//       console.error("Network Error:", err.message);
//       setServerStatus("error");
//       return {
//         error: true,
//         message: "Network error. Please check your connection.",
//       };
//     } else {
//       // Handle unexpected errors
//       console.error("Unexpected Error:", err.message);
//       setServerStatus(500);
//       return { error: true, message: "An unexpected error occurred." };
//     }
//   }
// };


import axios from "axios";
import { config } from "./config";
import { setServerStatus } from "../Store/server.Store";
import { getAccessToken } from "../Store/profile.store";

// Create axios instance
const api = axios.create({
  baseURL: config.base_url,
  withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No token found when making request.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    setServerStatus(200); // Update on success
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      const { status, data } = response;

      if (status === 401 || status === 403) {
        setServerStatus(403);
        localStorage.removeItem("access_token");
        localStorage.removeItem("profile");

        // Redirect user to login if unauthorized
        window.location.href = "/login";
      } else {
        setServerStatus(status || 500);
      }

      return Promise.reject({
        error: true,
        status,
        message: data?.message || "Request failed.",
      });
    } else if (error.code === "ERR_NETWORK") {
      setServerStatus("error");
      return Promise.reject({
        error: true,
        message: "Network error. Please check your connection.",
      });
    } else {
      setServerStatus(500);
      return Promise.reject({
        error: true,
        message: "An unexpected error occurred.",
      });
    }
  }
);

export const request = async (url = "", method = "get", data = {}) => {
  try {
    const config = {
      url,
      method,
    };

    // Handle query string for GET
    if (method === "get" && data && typeof data === "object") {
      config.params = data;
    } else {
      config.data = data;
    }

    const response = await api(config);
    return response.data;
  } catch (err) {
    return err; // already normalized
  }
};
