import { toast } from "@/components/ui/use-toast";
import appConstant from "../../public/json/appConstant.json";
import { getApiAccessToken } from "./authToken";
import routes from "./routes";
import { useAppDispatch } from "@/lib/hooks";
import { logoutUser } from "@/lib/slices/authSlice";

export default function conversationApi() {
      const dispatch = useAppDispatch();


  const getConversations = async (agentId: string) => {
    try {
      const url = routes.GET_CONVERSATIONS(agentId);
      const accessToken = await getApiAccessToken();
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
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


  const openChat = async (conversationId: string) => {
    try {
      const url = routes.OPEN_CONVERSATION(conversationId);
      const accessToken = await getApiAccessToken();
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
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
  }


  const errorHandle = (status: any) => {
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

  
  return {
    openChat,
    getConversations,
  };
}