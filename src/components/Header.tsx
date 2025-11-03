import { NavLink } from "react-router";
import CartInfoHeader from "./CartInfoHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Logo */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-3xl font-bold tracking-tight transition hover:opacity-90 ${
              isActive ? "font-semibold" : ""
            }`
          }
        >
          Điện máy
        </NavLink>

        {/* Center: Search Bar */}
        <div className="w-full md:w-1/2 flex items-center bg-white rounded-2xl overflow-hidden shadow-sm">
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="border-0 text-gray-700 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            size="icon"
            variant="ghost"
            className="bg-indigo-500 hover:bg-indigo-700 text-white rounded-none"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Right: Navigation */}
        <nav>
          <ul className="flex items-center gap-x-4 text-sm font-medium">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold"
                    : "hover:font-semibold hover:text-gray-200"
                }
              >
                Trang chủ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold"
                    : "hover:font-semibold hover:text-gray-200"
                }
              >
                Đăng nhập
              </NavLink>
            </li>
            <li>
              <CartInfoHeader />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
