import routes from '../routes';
import appConstant from '../../../public/json/appConstant.json';
import {
  encryptAccessToken,
  decryptAccessToken,
} from '@/service/EncryptionUtil';

const tokenLocalStorageKey = `${appConstant.NEXT_PUBLIC_TOKEN}`;
const userLocalStorageKey = `${appConstant.NEXT_PUBLIC_USER_INFO}`;
const otpTokenLocalStorageKey = `${appConstant.NEXT_PUBLIC_OTP_TOKEN}`;

/**
 * Login with email and password
 * @param email - User email
 * @param password - User password
 * @returns Promise with user data and token
 */
export const loginApi = async (email: string, password: string) => {
  try {
    const url = routes.LOGIN();
    const body = {
      email: email.toLowerCase(),
      password,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Login failed');
    }

    const responseData = await response.json();

    // Store token
    if (responseData?.token) {
      setLocalStorage(responseData.token, tokenLocalStorageKey);
    }

    // Store user info
    if (responseData?.user) {
      setLocalStorage(responseData.user, userLocalStorageKey);
    }

    return responseData;
  } catch (error: any) {
    console.error('Login API error:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutApi = async () => {
  try {
    // Clear local storage
    localStorage.removeItem(userLocalStorageKey);
    localStorage.removeItem(tokenLocalStorageKey);
    localStorage.removeItem(otpTokenLocalStorageKey);
    return { success: true };
  } catch (error: any) {
    console.error('Logout API error:', error);
    throw error;
  }
};

/**
 * Get stored token from localStorage
 */
export const getStoredToken = (): string | null => {
  try {
    const encryptedToken = localStorage.getItem(tokenLocalStorageKey);
    if (!encryptedToken) return null;
    return decryptAccessToken(encryptedToken);
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};

/**
 * Get stored user from localStorage
 */
export const getStoredUser = () => {
  try {
    const encryptedUser = localStorage.getItem(userLocalStorageKey);
    if (!encryptedUser) return null;
    return decryptAccessToken(encryptedUser);
  } catch (error) {
    console.error('Error getting stored user:', error);
    return null;
  }
};

/**
 * Forgot password - request OTP
 */
export const forgotPasswordApi = async (email: string) => {
  try {
    const url = routes.FORGOT_PASSWORD();
    const body = { email };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Failed to send reset email');
    }

    const responseData = await response.json();

    // Store OTP token if provided
    if (responseData?.token) {
      localStorage.setItem(otpTokenLocalStorageKey, responseData.token);
    }

    return responseData;
  } catch (error: any) {
    console.error('Forgot password API error:', error);
    throw error;
  }
};

/**
 * Verify OTP
 */
export const verifyOtpApi = async (otp: string) => {
  try {
    const token = localStorage.getItem(otpTokenLocalStorageKey);
    if (!token) {
      throw new Error('No OTP token found');
    }

    const url = routes.OTP_VERIFY();
    const body = {
      token,
      otp,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'OTP verification failed');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    console.error('Verify OTP API error:', error);
    throw error;
  }
};

/**
 * Reset password
 */
export const resetPasswordApi = async (newPassword: string, confirmPassword: string) => {
  try {
    const token = localStorage.getItem(otpTokenLocalStorageKey);
    if (!token) {
      throw new Error('No OTP token found');
    }

    const url = routes.RESET_PASSWORD();
    const body = {
      token,
      password: newPassword,
      confirmPassword,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Password reset failed');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    console.error('Reset password API error:', error);
    throw error;
  }
};

/**
 * Resend OTP
 */
export const resendOtpApi = async () => {
  try {
    const token = localStorage.getItem(otpTokenLocalStorageKey);
    if (!token) {
      throw new Error('No OTP token found');
    }

    const url = routes.RESEND_OTP();
    const body = { token };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Failed to resend OTP');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    console.error('Resend OTP API error:', error);
    throw error;
  }
};

/**
 * Helper function to encrypt and store data in localStorage
 */
const setLocalStorage = (data: any, key: string): void => {
  try {
    const encryptedData = encryptAccessToken(data);
    if (encryptedData) {
      localStorage.setItem(key, encryptedData);
    }
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};
