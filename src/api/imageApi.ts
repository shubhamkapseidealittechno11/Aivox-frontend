import routes from "./routes";
import { getApiAccessToken } from "./authToken";
import { useAppDispatch } from "@/lib/hooks";
import { logoutUser } from "@/lib/slices/authSlice";
import appConstant from "../../public/json/appConstant.json";
import { useToast } from "@/components/ui/use-toast";

export default function ImageApi() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const getPresignedPostData = async (file: any) => {
    try {
      const imageData = {
        fileName: "temp/" + file.randomFileName,
        fileType: file?.fileType,
      };
      const url = routes.CONTENT_UPLOAD_URL();
      const accessFileToken = await getApiAccessToken();

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessFileToken,
        },
        body: JSON.stringify(imageData),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();
      if (!response.ok) {
        if (response?.status === 401 || response?.status === 403) {
          errorHandle(response?.status);
        }
      }
      return responseData;
    } catch (error: any) {
      return { error: true, errorMessage: error?.message };
    }
  };

  const uploadFileToS3 = async (data: any, file: any) => {
    try {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": file?.type,
        },
        body: file,
      };
      const response = await fetch(data?.url, options);
      if (!response.ok) {
        if (response?.status === 401 || response?.status === 403) {
          errorHandle(response?.status);
        }
      }
      return response;
    } catch (error: any) {
      return { error: true, errorMessage: error?.message };
    }
  };

 
  // const uploadFileToS3 = async (data: any, file: any) => {
  //   try {

  //     const formData = new FormData();

  //     // Append all the necessary form fields
  //     Object.keys(data.fields).forEach((key) => {
  //       formData.append(key, data.fields[key]);
  //     });

  //     // Append the file
  //     formData.append("file", file);
  
  //     const response = await fetch(data.url, {
  //       method: "POST",
  //       body: formData,
  //     });
  
  //     if (!response.ok) {
  //       errorHandle(response.status);
  //     }
  
  //     return response;
  //   } catch (error:any) {
  //     return { error: true, errorMessage: error?.message };
  // }

  // };
  
  const moveImageFile = async (data:any)=>{

    try {
      const imageData = {
        fileName: data.image,
      };
      const url = routes.MOVE_CONTENT();
      // const accessFileToken = await getAccessToken();
   
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer " + accessFileToken
        },
        body: JSON.stringify(imageData)
      };

      const response = await fetch(url, options);
      const responseData = await response.json();
      if (!response.ok) {
        if (response?.status === 401 || response?.status === 403) {
            errorHandle(response?.status);
        }
    }
      return responseData;
    } catch (error:any) {
      return { error: true, errorMessage: error?.message };
  }

  }
  
  const errorHandle = (status :any)=>{
    const tokenLocalStorageKey: any = `${appConstant.NEXT_PUBLIC_TOKEN}`;
    const userLocalStorageKey: any = `${appConstant.NEXT_PUBLIC_USER_INFO}`;
    localStorage.removeItem(userLocalStorageKey);
    localStorage.removeItem(tokenLocalStorageKey);
    dispatch(logoutUser());
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description:
        status == 401
          ? "Session expired. Please log in again."
          : "You do not have permission to perform this action.",
    });
  };

  return { uploadFileToS3, getPresignedPostData , moveImageFile};
}
