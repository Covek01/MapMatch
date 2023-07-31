import { axiosInstance } from "utils/http";
import React from 'react'
import UserService from "Services/UserService";
import { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import {
  lsGetToken,
  lsGetUser,
  lsRemoveToken,
  lsRemoveUser,
  lsReplaceToken,
  lsSetToken,
  lsSetUser,
} from "../../utils/localStorage"
import { redirect } from "react-router-dom";
import axios from "axios";

const AuthStateContext = createContext({
  user: null,
  signIn: (prop) => { },
  signOut: () => { },
  autoLogin: () => { },
  isAuthenticated: () => { },
  // getUserRole: () => { },
  isUserAuthenticatedTest: () => { },
});

export function useAuthContext() {
  const context = useContext(AuthStateContext);
  if (!context)
    throw new Error("useAuthState must be used within AuthProvider");

  return context;
}

export function AuthStateProvider({ children }) {
  const [authState, setAuthState] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      autoLogin();
    }
    // else {
    //   if (status === "authenticated" && session) {
    //     console.log(session);
    //     const token = lsGetToken();

    //     const emp = {

    //     };
    //     UserService.signIn(emp)
    //       .then((response) => {
    //         if (response.status == 200) {
    //           signIn({
    //             authToken: response.data.token,
    //             user: response.data.employee,
    //           });
    //         }
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //         signOut();
    //       });
    //   }
    // }
  }, []);

  const signIn = (authState) => {
    setAuthState(authState);
    lsSetToken(authState.authToken);
    lsSetUser(authState.user);
  };

  const signOut = () => {
    if (lsGetToken() == null) {
      return;
    }

    setAuthState(null);
    lsRemoveToken();
    lsRemoveUser();
    redirect("/login");
  };

  const autoLogin = () => {
    const user = lsGetUser();
    const token = lsGetToken();

    if (!user || !token) {
      return;
    }

    setAuthState({ user, authToken: token });
  };
  const isUserAuthenticatedTest = () => !!authState?.authToken;

  const isAuthenticated = () => {

    const token = lsGetToken();
    if (!token) return false;

    const decoded = jwtDecode(token);

    if (decoded?.exp) {
      if ((Date.now() + 600000) > (decoded.exp * 1000)) {
        //TODO: Implement token renew method and call each time
        const renewToken = async () => {
          try {
            const { data: response, status } = await UserService.renewToken();
            if (status == 200) {
              lsReplaceToken(response);
            }
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.error(error.message);
              signOut();
            }
          }
        };
        renewToken();
        return true;
      }
      else if (Date.now() < decoded.exp * 1000) {
        return true;
      }
    }
    signOut();
    return false;
  };

  // //parse user role from JWT token
  // const getUserRole = (): UserRole | null => {
  //   const token = lsGetToken();

  //   if (!token) return null;
  //   const {
  //     "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": role,
  //   } = jwtDecode < {
  //     "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": UserRole;
  //   } > (token);
  //   return role;
  // };

  return (
    <AuthStateContext.Provider
      value={{
        autoLogin,
        signIn,
        signOut,
        isAuthenticated,
        isUserAuthenticatedTest,
        // getUserRole,
        user: authState?.user ?? null,
      }}
    >
      {children}
    </AuthStateContext.Provider>
  );
}
