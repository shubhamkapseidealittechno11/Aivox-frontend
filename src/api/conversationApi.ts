import { toast } from "@/components/ui/use-toast";
import { getApiAccessToken } from "./authToken";
import routes from "./routes";
import { useAppDispatch } from "@/lib/hooks";
import AuthService from "./auth/AuthService";

export default function conversationApi() {
  const dispatch = useAppDispatch();
  const { directLogout } = AuthService();

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
          directLogout();
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
          directLogout();
        }
      }
      return responseData;
    } catch (error: any) {
      return { error: true, errorMessage: error?.message };
    }
  }

  return {
    openChat,
    getConversations,
  };
}