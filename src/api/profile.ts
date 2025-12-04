import routes from './routes';
import appConstant from '../../public/json/appConstant.json';
import {  getApiAccessToken } from './authToken';
import { useAppDispatch } from "@/lib/hooks";
import { useToast } from "@/components/ui/use-toast";
import { logoutUser } from "@/lib/slices/authSlice";


export default function ProfileApi() {

    const dispatch = useAppDispatch();
    const { toast } = useToast();
    
    const getProfileDetail = async () => {
        try {
          const url = routes.ADMIN_PROFILE();
          const accessToken = await getApiAccessToken();

          const options =  {
            headers: { Authorization: "Bearer " + accessToken },
          }

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



    const updateProfile = async (data: any, id:any) => {
        try {
            const url = await routes.UPDATE_PROFILE(id);
            const accessToken = await getApiAccessToken();
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessToken
                },
                body: JSON.stringify(data)
            };
            const response = await fetch(url, options);
            const responseData = await response.json();
            return responseData;
        } catch (error:any) {
            return { error: true, errorMessage: error?.message };
          }
    }


    const updatePassword = async (data: any) => {
        try {
            const url = await routes.CHANGE_PASSWORD();
            const accessToken = await getApiAccessToken();

            // const accessToken = await getApiAccessToken();  
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessToken
                },
                body: JSON.stringify(data)
            };
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
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
          description:  status == 401 
          ? 'Session expired. Please log in again.' 
          : 'You do not have permission to perform this action.',
        });
    }

    return { updateProfile,updatePassword, getProfileDetail }

}