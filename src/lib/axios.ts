import axios from 'axios';    
import { getStoredAccessToken, setStoredAccessToken } from "./authToken";
import { refreshAccessToken } from "@/api/auth";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
 });

 
// Attach token on refresh
api.interceptors.request.use((config) => { //it's how it test the token in the Postman, but set it in frontend to auto use token
  const token = getStoredAccessToken();
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }

  return config;
});

// Refresh token after expire
api.interceptors.response.use((res) => res, 
  async(error) => { //first one returns if its oaky, 2nd is if its error
    const originalRequest = error.config;

    if(
      error.response?.status === 401 && 
      !originalRequest._retry && //will make sure that it hasnot true yet and if it does, do not run
      !originalRequest.url.includes('/auth/refresh')     
    ){
      originalRequest._retry = true;

      try {
        const { accessToken:newToken } = await refreshAccessToken();
        setStoredAccessToken(newToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return api(originalRequest);
      } catch (err) {
        console.error('Refresh token failed', err)
      }
    }

    return Promise.reject(error); //if nothing happens in if statement pass an error
  }
);

export default api;