import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
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

export function AvatarMenu() {
  return (
    <div>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger>
            <DropdownMenuTrigger>
              <Avatar className="hover:opacity-50">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Options</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent>
          <DropdownMenuLabel> My Account </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem> Profile </DropdownMenuItem>
          <DropdownMenuItem> Log Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
