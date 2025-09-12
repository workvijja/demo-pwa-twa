import {useMutation, useQueryClient} from "@tanstack/react-query";
import {login as loginFn, register as registerFn} from "@/services/authService";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {APIError} from "@/lib/axios";
import {parseJWT} from "@oslojs/jwt";
import {useSyncExternalStore} from "react";
// import {useLocalStorage} from "@uidotdev/usehooks";

const listeners = new Set<() => void>();

function getTokenExistSnapshot() {
  return !!localStorage.getItem("token");
}

function emitChange() {
  listeners.forEach((l) => l());
}

// subscribe to changes
function subscribeTokenChanges(callback: () => void) {
  listeners.add(callback)
  const handler = (e: StorageEvent) => {
    console.log("storage event", e);
    if (e.key === "token") {
      emitChange()
    }
  };
  window.addEventListener("storage", handler);

  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", handler)
  };
}

export const getToken = () => {
  try {
    const [,payload] = parseJWT(localStorage.getItem("token") || "");
    console.log(payload)
    return payload as {UserID: string}
  } catch(e) {
    return null
  }
}

export default function useAuth() {
  // const [token, setToken] = useLocalStorage("token", "");
  const isLoggedIn = useSyncExternalStore(subscribeTokenChanges, getTokenExistSnapshot, () => false);

  const queryClient = useQueryClient();
  const {mutate: login, status: loginStatus } = useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      // setToken(data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      emitChange();
      queryClient.invalidateQueries();
      toast.success("Login successfully");
    },
    onError: (error: AxiosError<APIError>) => {
      console.error(error);
      if (error.isAxiosError) {
        toast.error("Login Failed", {
          description: error.response?.data?.error
        })
        return
      }

      toast.error("Login Failed", {
        description: error.message,
      });
    }
  })

  const {mutate: register, status: registerStatus} = useMutation({
    mutationFn: registerFn,
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      // setToken(data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      emitChange();
      queryClient.invalidateQueries();
      toast.success("Register successfully");
    },
    onError: (error: AxiosError<APIError>) => {
      console.error(error);
      if (error.isAxiosError) {
        toast.error("Register Failed", {
          description: error.response?.data?.error
        })
        return
      }

      toast.error("Register Failed", {
        description: error.message,
      });
    }
  })

  const logout = () => {
    // localStorage.setItem("token", "");
    localStorage.removeItem("token");
    // setToken("");
    localStorage.removeItem("refreshToken");
    emitChange();
  }

  // const isLoggedIn = !!token;


  return {
    login, loginStatus,
    register, registerStatus,
    logout,
    isLoggedIn
  }
}
