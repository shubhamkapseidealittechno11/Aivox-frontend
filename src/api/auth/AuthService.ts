import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { logoutUser } from "@/lib/slices/authSlice";
import { logoutApi } from "./index";
import { useToast } from "@/components/ui/use-toast";

const AuthService = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const directLogout = async () => {
    try {
      await logoutApi();
      dispatch(logoutUser());
      router.push("/");
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "You have been logged out due to inactivity or invalid session.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // Force redirect
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  return { directLogout };
};

export default AuthService;
