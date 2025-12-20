import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner"; 
import { useNavigate } from "@tanstack/react-router";

export const UseProtectedNav = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (path: string) => {
      if (!user) {
        toast.error("You need to login first");
        navigate({ to: "/login", search: { redirect: path } });
        return;
      }
      navigate({ to: path });
  };
};