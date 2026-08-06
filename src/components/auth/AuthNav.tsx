import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/components/auth/AuthProvider";
import { getDashboardPath } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Truck, Store, LayoutDashboard } from "lucide-react";

export function AuthNav() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("dt_auth_token");
    logout();
    router.navigate({ to: "/" });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-3">
        <Button variant="ghost" asChild>
          <Link to="/auth/signin">Sign In</Link>
        </Button>
        <Button asChild>
          <Link to="/auth/signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const roleIcon = {
    vendor: Store,
    transport: Truck,
    customer: User,
  }[user.role];

  const RoleIcon = roleIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center gap-2 p-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <RoleIcon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={getDashboardPath(user.role)} className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
