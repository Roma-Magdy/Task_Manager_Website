// import { useState } from "react";
// import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
// import { LayoutDashboard, FolderKanban, ListChecks, LogOut, Menu, X, User } from "lucide-react";

// const Layout = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const handleLogout = async () => {
//     // Add your logout logic here (e.g., await supabase.auth.signOut())
//     navigate("/login");
//   };

//   const navItems = [
//     { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
//     { path: "/projects", label: "Projects", icon: FolderKanban },
//     { path: "/tasks",  label: "Tasks", icon: ListChecks },
//   ];

//   const isActive = (path) => {
//     return location.pathname === path || location.pathname.startsWith(path + "/");
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">

//       {/* NAVBAR */}
//       <nav className="bg-blue-900 shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
            
//             {/* Logo */}
//             <div className="flex items-center">
//               <Link to="/dashboard" className="text-white text-2xl font-bold">
//                 Task Flow
//               </Link>
//             </div>

//             {/* Desktop Menu */}
//             <div className="hidden md:flex items-center space-x-4">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.path}
//                     to={item.path}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
//                       isActive(item.path)
//                         ? "bg-blue-800 text-white"
//                         : "text-blue-100 hover:bg-blue-800"
//                     }`}
//                   >
//                     <Icon className="w-5 h-5" />
//                     {item.label}
//                   </Link>
//                 );
//               })}

//               {/* Profile button */}
//               <Link
//                 to="/profile"
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-100 hover:bg-blue-800 transition-all"
//               >
//                 <User className="w-5 h-5" />
//                 Profile
//               </Link>

//               {/* Logout */}
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-4 py-2 text-blue-100 hover:bg-blue-800 rounded-lg transition-all"
//               >
//                 <LogOut className="w-5 h-5" />
//                 Logout
//               </button>
//             </div>

//             {/* Mobile toggle */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="md:hidden text-white"
//             >
//               {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden bg-blue-800">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.path}
//                     to={item.path}
//                     onClick={() => setMobileMenuOpen(false)}
//                     className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
//                       isActive(item.path)
//                         ? "bg-blue-700 text-white"
//                         : "text-blue-100 hover:bg-blue-700"
//                     }`}
//                   >
//                     <Icon className="w-5 h-5" />
//                     {item.label}
//                   </Link>
//                 );
//               })}

//               {/* Profile mobile */}
//               <Link
//                 to="/profile"
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="flex items-center gap-2 px-3 py-2 text-blue-100 hover:bg-blue-700 rounded-lg transition-all"
//               >
//                 <User className="w-5 h-5" />
//                 Profile
//               </Link>

//               {/* Logout mobile */}
//               <button
//                 onClick={() => {
//                   setMobileMenuOpen(false);
//                   handleLogout();
//                 }}
//                 className="flex items-center gap-2 w-full px-3 py-2 text-blue-100 hover:bg-blue-700 rounded-lg transition-all"
//               >
//                 <LogOut className="w-5 h-5" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* CONTENT */}
//       <main className="grow">
//         <Outlet />
//       </main>

//       {/* FOOTER */}

//       {location.pathname !== "/landing" && (
//         <footer className="bg-blue-900 text-white text-center py-4">
//           © {new Date().getFullYear()} Task Flow — All Rights Reserved
//         </footer>
//       )}
//     </div>
//   );
// };

// export default Layout;

"use client"

import { useState, useContext } from "react"
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom"
import { LayoutDashboard, FolderKanban, ListChecks, LogOut, Menu, X, User } from "lucide-react"
import { NotificationDropdown } from "../components/Notification"
import { NotificationContext } from "../context/NotificationContext"

const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { unreadCount } = useContext(NotificationContext)

  const handleLogout = async () => {
    navigate("/login")
  }

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/projects", label: "Projects", icon: FolderKanban },
    { path: "/tasks", label: "Tasks", icon: ListChecks },
    { path: "/profile", label: "Profile", icon: User },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/")

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* LOGO */}
            <div className="flex items-center">
              <Link to="/dashboard" className="text-white text-2xl font-bold">
                Task Flow
              </Link>
            </div>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive(item.path) ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}

              {/* NOTIFICATION DROPDOWN */}
              <NotificationDropdown isDarkMode={false} />

              {/* LOGOUT BUTTON */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-blue-100 hover:bg-blue-800 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>

            {/* MOBILE MENU ICON */}
            <div className="md:hidden flex items-center gap-4">
              <NotificationDropdown isDarkMode={false} />
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      isActive(item.path) ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}

              {/* MOBILE LOGOUT */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-blue-100 hover:bg-blue-700 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <Outlet />
        <div>
               {location.pathname !== "/landing" && (  
                      <footer className="bg-blue-900 text-white text-center py-4">
           © {new Date().getFullYear()} Task Flow — All Rights Reserved
         </footer>
      )}
   </div>
    </div>
  )
}

export default Layout
