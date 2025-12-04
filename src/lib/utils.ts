import { encryptAccessToken } from "@/service/EncryptionUtil";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatName = (name: any) => {
  if (name) {
    const fullName = name?.split(" ");
    return (
      fullName[0]?.charAt(0)?.toUpperCase() +
      `${
        fullName[1]
          ? fullName[1]?.charAt(0)?.toUpperCase()
          : fullName[0]?.charAt(1)?.toUpperCase()
      }`
    );
  }
};

export const shortName = (name: string, isExpanded: boolean, length:number) => {
  if (!name) return '';
  if (isExpanded) return name + ' ';
  if (name.length >= length) return name.slice(0, length) + '...';
  return name + ' ';
};


export const setLocalStorage = async (
  response: any,
  key: string
): Promise<any> => {
  let encryptedData = encryptAccessToken(response);
  encryptedData ? localStorage.setItem(key, encryptedData) : "";
};
export  function titleCase(data:any) {
  const string = data?.split?.(" ");
 const titleCaseArray= string?.map((res:any)=>{
    return res?.[0]?.toUpperCase()+res?.slice(1)
  });
  const titleCaseValue=titleCaseArray?.join(" ")
  return titleCaseValue;
}
