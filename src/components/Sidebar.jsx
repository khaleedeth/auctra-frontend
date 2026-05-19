import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Gavel,
  User,
  LayoutDashboard,
  LogOut,
  Landmark,
  Sun,
  Moon
  
} from "lucide-react";

const navItems = [
  { to: "/auctions", icon: Gavel, label: "Auctions" },
  { to: "/profile", icon: User, label: "Profile" },
];

const adminItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="
      group fixed left-0 top-0 h-screen
      w-16 hover:w-56
      bg-auction-surface border-r border-auction-border
      flex flex-col
      transition-all duration-300 ease-in-out
      z-50 overflow-hidden
    ">

      {/* Logo */}
     <div className="h-16 flex items-center px-4 border-b border-auction-border shrink-0 overflow-hidden">
         <Landmark 
    size={22} 
    className="text-auction-accent shrink-0 group-hover:opacity-0 group-hover:scale-75 transition-all duration-200" 
  />

  {/* Full logo — shows when expanded */}
  <span className="
    font-display text-2xl text-auction-accent tracking-widest
    absolute left-4
    opacity-0 group-hover:opacity-100
    translate-x-[-8px] group-hover:translate-x-0
    transition-all duration-300 ease-in-out
    whitespace-nowrap
  ">
    AUCTRA
  </span>

</div>

      {/* Nav links */}
      <nav className="flex-1 py-6 flex flex-col gap-1 px-2">

        {/* Main nav */}
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 transition-all duration-200
              ${isActive
                ? "text-auction-accent bg-auction-accent/10 border-l-2 border-auction-accent"
                : "text-auction-muted hover:text-auction-text hover:bg-auction-card"
              }
            `}
          >
            <Icon size={20} className="shrink-0" />
            <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {label}
            </span>
          </NavLink>
        ))}

        {/* Admin section */}
        {user?.role === "admin" && (
          <>
            <div className="my-3 border-t border-auction-border" />
            <p className="px-3 text-auction-muted text-xs uppercase tracking-widest mb-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Admin
            </p>
            {adminItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-3 transition-all duration-200
                  ${isActive
                    ? "text-auction-accent bg-auction-accent/10 border-l-2 border-auction-accent"
                    : "text-auction-muted hover:text-auction-text hover:bg-auction-card"
                  }
                `}
              >
                <Icon size={20} className="shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {label}
                </span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Bottom — user + logout */}
      <div className="border-t border-auction-border p-2 shrink-0">

        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="w-8 h-8 bg-auction-accent/10 border border-auction-accent/20 flex items-center justify-center shrink-0">
            <span className="font-display text-sm text-auction-accent">
              {user?.username?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 overflow-hidden">
            <p className="text-auction-text text-sm font-medium whitespace-nowrap">
              {user?.username}
            </p>
            <p className="text-auction-muted text-xs whitespace-nowrap">
              {user?.role}
            </p>
          </div>
        </div>

          {/* Theme toggle */}
          <button
  onClick={toggleTheme}
  className="w-full flex items-center gap-3 px-3 py-3 text-auction-muted hover:text-auction-accent hover:bg-auction-accent/5 transition-all duration-200"
>
  {theme === "dark"
    ? <Sun size={20} className="shrink-0" />
    : <Moon size={20} className="shrink-0" />
  }
  <span className="text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
    {theme === "dark" ? "Light Mode" : "Dark Mode"}
  </span>
</button>


        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-auction-muted hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Logout
          </span>
        </button>

      </div>
    </aside>
  );
}