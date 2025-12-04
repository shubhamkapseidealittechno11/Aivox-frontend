import {
  decryptAccessToken,
  encryptAccessToken
} from "../service/EncryptionUtil";
import appConstant from "../../public/json/appConstant.json";

const tokenLocalStorageKey: any = appConstant.NEXT_PUBLIC_TOKEN;

const setLocalStorage = (response: any, key: string): any => {
  let encryptedData: any = encryptAccessToken(response);
  localStorage.setItem(key, encryptedData);
};

const getLocalStorage = ( encryptedData: string): any => {
  let decryptedData: any = decryptAccessToken(encryptedData);
  return decryptedData;
};

/**
 * Get stored API access token from localStorage
 */
export const getApiAccessToken: any = async () => {
  try {
    if (localStorage.getItem(tokenLocalStorageKey)) {
      const localData: any = localStorage.getItem(tokenLocalStorageKey);
      const decryptData = getLocalStorage(localData)

      return decryptData;
    }
  } catch (error) {
    return null
  }
};