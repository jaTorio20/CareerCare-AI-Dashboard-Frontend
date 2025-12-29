import api from "@/lib/axios";

export const registerUser = async ({
  // name,
  email,
  // password
}: {
  // name: string;
  email: string;
  // password: string;
}) => {
  try {
    const { data } = await api.post('/auth/register', {
      // name,
      email,
      // password,
    });

    return data;
  } catch (err: any) {
    const message = err.response?.data?.error ||
      err.response?.data?.message ||
      'Failed to register';
    throw new Error(message);
  }
};

// Verify OTP
export const verifyUser = async ({
  email,
  name,
  password,
  otp,
  }: {
    email: string;
    name: string;
    password: string;
    otp: string;
  }) => {
    try {
      const { data } = await api.post("/auth/verify", {
        email,
        name,
        password,
        otp,
      });

      return data;
    } catch (err: any) {
    const message = err.response?.data?.error ||
      err.response?.data?.message ||
      'Failed to register';
    throw new Error(message);
    }
};

// Resend OTP
export const resendOtp = async ({ email }: { email: string }) => {
  try {
    const { data } = await api.post("/auth/resend-otp", { email });
    return data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to resend OTP";
    throw new Error(message);
  }
};

// Forgot Password
export const sendPasswordReset = async (email: string) => {
  try {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to send password reset";
    throw new Error(message);
  }
};


// Verify reset token
export const getPasswordToken = async (token: string) => {
  try {
    const { data } = await api.get(`/auth/reset-password/${token}`);
    return data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Invalid or expired reset token";
    throw new Error(message);
  }
};


// Save new password
export const saveNewPassword = async (token: string, password: string) => {
  try {
    const { data } = await api.post(`/auth/reset-password/${token}`, { password });
    return data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to reset password";
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
    const message = err.response?.data?.error 
    || err.response?.data?.message || 'Failed to login';
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