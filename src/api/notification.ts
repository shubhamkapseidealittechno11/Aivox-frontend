import routes from './routes';
import { getApiAccessToken } from './authToken';
import { logoutUser } from "@/lib/slices/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import appConstant from "../../public/json/appConstant.json";
import { useToast } from '@/components/ui/use-toast';

export default function NotificationApi() {
    const { toast } = useToast();
    const dispatch = useAppDispatch();
    //add new notification
    const addNotification = async (info: any) => {
        try {
            const url = "";
            const accessToken = await getApiAccessToken();
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessToken
                },
                body: JSON.stringify(info)
            };
            const response = await fetch(url, options);            
            const responseData = await response.json();
            if (!response.ok) {
                if (response?.status === 401 || response?.status === 403) {
                    errorHandle(response?.status);
                }
             await errorHandle(response?.status);
            }
            return responseData;
        } catch(error:any){
            return { error: true, errorMessage: error?.message };
          }
    };

    // update Notification
    const updateNotification = async (data: any, id:string) => {
        try {
            const url = ""
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
            if (!response.ok) {
                if (response?.status === 401 || response?.status === 403) {
                    errorHandle(response?.status);
                }
             await errorHandle(response?.status);
            }
            return responseData;
        } catch(error:any){
            return { error: true, errorMessage: error?.message };
          }
    }

    // delete Notification    
    const deleteNotification = async (id:string) =>{
        try {
            const url = `routes.NOTIFICATION()+"/"+id`;
            const accessToken = await getApiAccessToken();
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessToken
                },
            };
            const response = await fetch(url, options);
            const responseData = await response.json();
            if (!response.ok) {
                if (response?.status === 401 || response?.status === 403) {
                    errorHandle(response?.status);
                }
             await errorHandle(response?.status);
            }
            return responseData;
        } catch(error:any){
            return { error: true, errorMessage: error?.message };
          }
    }

    //get notification details
    const notificationDetail = async (id:string)=>{
        try {
            const url = `routes.NOTIFICATION()+"/"+id`;
            const accessToken = await getApiAccessToken();
            const response :any = (await fetch(
                url, { headers: { Authorization: 'Bearer ' + accessToken } }
              ))
              const responseData = await response.json();
              if (!response.ok) {
                if (response?.status === 401 || response?.status === 403) {
                    errorHandle(response?.status);
                }
             await errorHandle(response?.status);
            }
              return responseData;
            } catch(error:any){
                return { error: true, errorMessage: error?.message };
              }
    }

    const sendNotification = async (data: any) => {
        try {
            const url = `routes.NOTIFICATION_SEND()`;
            const accessToken = await getApiAccessToken();
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessToken
                },
                body: JSON.stringify(data)
            };
            const response = await fetch(url, options);            
            const responseData = await response.json();
            if (!response.ok) {
                if (response?.status === 401 || response?.status === 403) {
                    errorHandle(response?.status);
                }
             await errorHandle(response?.status);
            }
            return responseData;
        } catch(error:any){
            return { error: true, errorMessage: error?.message };
          }
    };

    const errorHandle=(status :any)=>{
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


    return { addNotification, updateNotification, deleteNotification, notificationDetail, sendNotification}
}
