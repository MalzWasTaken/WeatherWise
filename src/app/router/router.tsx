// app/router/useAppRouter.ts
"use client";
import { auth0 } from "./../../lib/auth0";

export function useAppRouter() {
  const goToLogin = async () => {
    await auth0.loginWithRedirect(); // default login
  };

  const goToRegister = async () => {
    await auth0.loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup", // must be inside authorizationParams
      },
    });
  };

  const goToDashboard = () => {
    window.location.href = "./pages/home"; // internal navigation
  };

  const logout = async () => {
    await auth0.logout({
      logoutParams: {
        returnTo: window.location.origin, // must be inside logoutParams
      },
    });
  };

  return {
    goToLogin,
    goToRegister,
    goToDashboard,
    logout,
  };
}


