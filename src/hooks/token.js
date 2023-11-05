import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export const useTokenRefresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [token, setToken] = useToken("token", null);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        setIsRefreshing(true);
        const { data } = await axios.post(
          process.env.NEXT_PUBLIC_API_BASE_URL + "/token/refresh",
          {
            refresh_token: token.refresh_token,
          }
        );
        setToken({
          ...data,
          expiresIn: new Date(
            new Date().getTime() + process.env.NEXT_PUBLIC_TOKEN_EXPIRES_IN
          ),
        });
      } catch (error) {
        // Handle error (e.g., logout user, show error message)
        console.error("Failed to refresh access token", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    const intervalId = setInterval(() => {
      // Refresh the access token 5 minutes before it expires
      const currentTime = new Date();
      const expiresIn = new Date(+token?.expiresIn);
      const timeUntilExpiration = expiresIn?.getTime() - currentTime?.getTime(); // calculate time until expiration of access token
      if (timeUntilExpiration < 5 * 60 * 1000) {
        refreshAccessToken();
      }
    }, +process.env.NEXT_PUBLIC_TOKEN_REFRESH_CHECK); // Check every minute

    return () => clearInterval(intervalId);
  }, [token]);

  return isRefreshing;
};

const useToken = (key, initialValue) => {
  if (typeof window !== "undefined") {
    const router = useRouter();
  }
  const [token, setState] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const value = window.localStorage.getItem(key);
        // Check if the local storage already has any values,
        // otherwise initialize it with the passed initialValue
        if (value === null) {
          if (typeof window !== "undefined") {
            const currentPathname = window.location.pathname;
            if (token === null) {
              if (currentPathname.startsWith("/admin")) {
                router.push(`/auth/admins?callbackUrl=${currentPathname}`);
              }
              if (currentPathname.startsWith("/user")) {
                router.push(`/auth/users?callbackUrl=${currentPathname}`);
              }
            }
          }
        }
        return value ? JSON.parse(value) : initialValue;
      }
    } catch (error) {
      console.log(error);
    }
  });

  const setToken = (value) => {
    try {
      // If the passed value is a callback function,
      //  then call it with the existing state.
      if (typeof window !== "undefined") {
        const valueToStore = value instanceof Function ? value(state) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        setState(value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [token, setToken];
};

export default useToken;

const getUserTypeBasePath = (userType) => {
  const basePaths = {
    consultant: "/f",
    manager: "/a",
    admin: "/d",
  };
  return basePaths[userType];
};

export const useTokenValidation = () => {
  const router = useRouter();

  useEffect(() => {
    let token = null;
    let data = null;
    const item = localStorage.getItem("szevent_token");
    if (item !== null) {
      data = JSON.parse(item);
      token = data ? data?.access_token : null;
    }
    if (typeof window !== "undefined") {
      const currentPathname = window.location.pathname;
      if (token === null) {
        if (currentPathname.startsWith("/admin")) {
          router.push(`/auth/admins?callbackUrl=${currentPathname}`);
        }
        if (currentPathname.startsWith("/user")) {
          router.push(`/auth/users?callbackUrl=${currentPathname}`);
        }
      }

      // const userType = data?.me.type;
      // const basePath = getUserTypeBasePath(userType);
      // if (
      //   !currentPathname.startsWith(basePath) &&
      //   currentPathname !== "/auth/login"
      // ) {
      //   if (window.location.pathname !== "/auth/login") {
      //     router.push(`/auth/login?callbackUrl=${currentPathname}`);
      //   }
      // }
    }
  }, []);
};
