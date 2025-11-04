"use client";
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { auth0 } from "../../lib/auth0";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full text-sm font-medium",
        className
      )}
      {...props}
    />
  );
}

export function UserAvatar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await auth0.getUser();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching Auth0 user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <Avatar>
      {user?.picture ? (
        <AvatarImage src={user.picture} alt={user.name || "User"} />
      ) : (
        <AvatarFallback>
          {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
        </AvatarFallback>
      )}
    </Avatar>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
