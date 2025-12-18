import routes from "./routes";
import { getApiAccessToken } from "./authToken";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { logoutUser } from "@/lib/slices/authSlice";
import appConstant from "../../public/json/appConstant.json";

export default function agentsApi() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  const createAgent = async (data: any) => {
    try {
      //   const body = {
      //     fileName: `content_pages/${data}.json`,
      //     fileType: 'application/json'
      //   };
      const url = routes.CREATE_AGENT();
      const accessFileToken = await getApiAccessToken();
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessFileToken,
        },
        body: JSON.stringify(data),
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

  const deleteAgent = async (data: any) => {
    try {
      //  const body = {userId:data}
      const url = routes.DELETE_AGENT(data);
      const accessToken = await getApiAccessToken();
      // const accessToken = await getAccessToken();
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        // body: JSON.stringify(body),
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

  const updateUser = async (data: any) => {
    try {
      const url = await routes.USER_UPDATE();
      const accessToken = await getApiAccessToken();
      // const accessToken = await getAccessToken();
      const body = {
        status: data?.status,
        id: data?.userId,
      };
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify(body),
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

  const userDetail = async (id: string) => {
    try {
      const param = { id: id };
      const url = await routes.USER_DETAIL(id);
      // const accessToken = await getAccessToken();
      const accessToken = await getApiAccessToken();

      const options = {
        headers: { Authorization: "Bearer " + accessToken },
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

  const syncAgent = async (data: any) => {
    try {
      //   const body = {
      //     fileName: `content_pages/${data}.json`,
      //     fileType: 'application/json'
      //   };
      const url = routes.SYNC_AGENT();
      const accessFileToken = await getApiAccessToken();
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessFileToken,
        },
        body: JSON.stringify(data),
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

  const saveChat = async (data: any, id: any) => {
    try {
      const url = routes.SAVE_CHAT(id);
      const accessFileToken = await getApiAccessToken();
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessFileToken,
        },
        body: JSON.stringify(data),
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

 const saveN8Nchat = async (data: any) => {
  try {
    const url = routes.SAVE_N8N_CHAT();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    if (!response.ok) {
      return { error: true, status: response.status, message: responseData };
    }

    return responseData;
  } catch (error: any) {
    return { error: true, errorMessage: error?.message };
  }
};
;

  const editAgent = async (id:any, data: any) => {
    try {
      const url = await routes.EDIT_PROMPT(id);
      const accessToken = await getApiAccessToken();
      // const accessToken = await getAccessToken();
      // const body = {
      //   status: data?.status,
      //   id: data?.userId,
      // };
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify(data),
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
    createAgent,
    updateUser,
    deleteAgent,
    userDetail,
    syncAgent,
    saveChat,
    saveN8Nchat,
    editAgent
  };
}
