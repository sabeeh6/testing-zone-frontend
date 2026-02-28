import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    LogOut,
    Bell,
    ChevronDown,
} from "lucide-react";
import { authService } from "../api/authService";

// ─── Sidebar Item ──────────────────────────────────────────────────────────────
function SidebarItem({ item, onClick }) {
    return (
        <div>
            <button
                onClick={onClick}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${item.active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
            >
                <item.icon
                    size={17}
                    className={item.active ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-700"}
                />
                <span className="flex-1 text-left">{item.label}</span>
            </button>
        </div>
    );
}

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await authService.logout();
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; samesite=strict";
            navigate("/signin");
            toast.success("Logged out successfully");
        } catch (error) {
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; samesite=strict";
            navigate("/signin");
        }
    };

    const navItems = [
        {
            label: "Projects",
            icon: FolderKanban,
            active: location.pathname === "/dashboard",
            path: "/dashboard"
        },
        {
            label: "User",
            icon: Users,
            active: location.pathname === "/users",
            path: "/users"
        },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {/* ── SIDEBAR ── */}
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-60 bg-white border-r border-gray-100 flex flex-col h-full flex-shrink-0 shadow-sm"
            >
                <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 shadow flex items-center justify-center">
                            <LayoutDashboard size={14} className="text-white" />
                        </div>
                        <span className="font-bold text-gray-900 text-sm tracking-tight">Testing Zone</span>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    <div className="pt-4 pb-1">
                        {navItems.map((item) => (
                            <SidebarItem
                                key={item.label}
                                item={item}
                                onClick={() => navigate(item.path)}
                            />
                        ))}
                    </div>
                </nav>
                <div className="p-3 border-t border-gray-100">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">A</div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">Admin User</p>
                            <p className="text-[10px] text-gray-400 truncate">admin@projecthub.io</p>
                        </div>
                        <LogOut size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                    </button>
                </div>
            </motion.aside>

            {/* ── MAIN ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <motion.header
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0 shadow-sm"
                >
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <span
                            onClick={() => navigate("/dashboard")}
                            className="hover:text-gray-800 cursor-pointer transition-colors"
                        >
                            Dashboard
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="hover:text-gray-800 cursor-pointer transition-colors" onClick={() => navigate("/dashboard")}>Projects</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-900 font-semibold truncate">
                            {location.pathname === "/dashboard" ? "List" : "Features"}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
                            <Bell size={17} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                        </button>
                        <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">A</div>
                            <ChevronDown size={14} className="text-gray-400" />
                        </button>
                    </div>
                </motion.header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
