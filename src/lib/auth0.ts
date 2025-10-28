import { Auth0Client } from "@auth0/auth0-spa-js";

export const auth0 = new Auth0Client({
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN!,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!,
  authorizationParams: {
    redirect_uri:
      typeof window !== "undefined" ? `${window.location.origin}/pages/home` : undefined,
  },
});

console.log("Auth0 domain:", process.env.NEXT_PUBLIC_AUTH0_DOMAIN);
console.log("Auth0 clientId:", process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID);
