"use client";

import { UserAvatar } from "../../../components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { auth0 } from "../../../lib/auth0";
import { useRouter } from "next/navigation";
import Toast from "typescript-toastify";

export function AvatarMenu() {
  const router = useRouter();

const handleLogout = async () => {
  try {
    // set a flag before redirecting
    localStorage.setItem("loggedOut", "true");

    await auth0.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

<<<<<<< Updated upstream
  const goToAlerts = async () => {
  router.replace("./Alerts")
  }
  
  const goToHome = async () => {
    router.replace("./home")
  }
=======
>>>>>>> Stashed changes


  return (
    <div>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger>
            <DropdownMenuTrigger>
              <UserAvatar />
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <TooltipContent>
            <p>Options</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
<<<<<<< Updated upstream
          <DropdownMenuItem onClick={goToHome}>Home</DropdownMenuItem>
          <DropdownMenuItem onClick={goToAlerts}>Alerts</DropdownMenuItem>
=======
          <DropdownMenuItem>Profile</DropdownMenuItem>
>>>>>>> Stashed changes
          <DropdownMenuItem onClick={handleLogout}>Log Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
