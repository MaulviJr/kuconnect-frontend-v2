import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Loader from "./loader";
import useStore from "@/store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "@/utils/avatar-helper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {UserCircle2Icon} from 'lucide-react'

export function NavUser() {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const [loading, setLoading] = useState(false);
  const { user } = useStore((state) => state.auth);
  const logout = useStore((state) => state.logout);

  const handleLogout = () => {
    setLoading(true);
    logout();
    navigate("/login");
    setLoading(false);
  };

  if (loading) return <Loader />;

  // --- THIS IS THE FIX ---
  // Add this check right here. If there is no user,
  // the component will stop and render nothing,
  // preventing the crash.
 if (!user) {
  return null; // Or <Loader />, or a <LoginButton />
 }
  // --- END OF FIX ---

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <UserCircle2Icon className="h-8" />
                
                {/* <AvatarFallback className="rounded-lg">
                  {getInitials(user.fullName)}
                </AvatarFallback> */}
              </Avatar>
              <div className="grid flex-1 font-jost  text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.fullName} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.fullName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
