import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Ticket,
  Users,
  Package,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Ticket, label: "Tickets", path: "/tickets" },
  { icon: Users, label: "Customers", path: "/customers" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: FileText, label: "Invoices", path: "/invoices" },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-50"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      )}

      {/* Sidebar */}
      <nav
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out",
          isMobile && !isMenuOpen && "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-center border-b">
          <h1 className="text-xl font-semibold text-brand-600">RepairPro</h1>
        </div>
        <div className="space-y-1 p-4">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-brand-50 hover:text-brand-600",
                location.pathname === path
                  ? "bg-brand-50 text-brand-600"
                  : "text-gray-600"
              )}
              onClick={() => isMobile && setIsMenuOpen(false)}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out",
          !isMobile && "ml-64",
          "min-h-screen bg-gray-50 p-6"
        )}
      >
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
};