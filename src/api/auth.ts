import api from "@/lib/axios";

export const registerUser = async ({
  name,
  email,
  password
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const { data } = await api.post('/auth/register', {
      name,
      email,
      password,
    });

    return data;
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to register';
    throw new Error(message);
  }
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to login';
    throw new Error(message);
  }
};

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');

  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to logout';
    throw new Error(message);
  }
};

export const refreshAccessToken = async () => { //import it to AuthContext for global access
  try {
    const { data } = await api.post('/auth/refresh');
    return data;
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to refresh access token';
    throw new Error(message);    
  }
}