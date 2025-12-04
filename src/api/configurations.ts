import routes from './routes';
import { getApiAccessToken } from './authToken';
import { logoutUser } from "@/lib/slices/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import appConstant from "../../public/json/appConstant.json";
import { useToast } from '@/components/ui/use-toast';


export default function ConfigurationApi() {
    const { toast } = useToast();
    const dispatch = useAppDispatch();
    //add configuration
    const addConfig = async (info: any) => {
        try {
            const url = ""
            const accessToken = await getApiAccessToken();
            const options = {
                method: 'PATCH',
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
              }
            return responseData;
        } catch (error:any) {
            return { error: true, errorMessage: error?.message };
          }
    };

    const getConfigData = async () => {
        try{
          const url = routes.CONFIG_DETAIL();
          const accessToken = await getApiAccessToken();
          const response = await (await fetch(url, { headers: { Authorization: 'Bearer ' + accessToken } }))
          const responseData = await response.json();
          if (!response.ok) {
            if (response?.status === 401 || response?.status === 403) {
              errorHandle(response?.status);
            }
          }
          return responseData;
        }catch (error:any) {
            return { error: true, errorMessage: error?.message };
          }
      }


    

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

    return { addConfig, getConfigData }
}
