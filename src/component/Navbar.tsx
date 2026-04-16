"use client";

import { IUser } from "@/model/user.model"
import Image from "next/image";
import { useRouter } from "next/navigation"
import logo from "@/assets/logo@11.png"
import { AnimatePresence, motion } from "motion/react"
import {
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineAppstore,
  AiOutlinePhone,
  AiOutlineSearch,
  AiOutlineShop,
  AiOutlineLogin,
} from "react-icons/ai";
import { GoListUnordered } from "react-icons/go";
import { useState } from "react";
import { signOut } from "next-auth/react";


const Navbar = ({ user }: { user: IUser }) => {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full bg-black text-white z-50 shadow-lg">
      <div className="max-w-5xl  mx-auto px-6 py-3 flex items-center justify-between">
        {/* logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src={logo}
            width={40}
            height={40}
            alt="logo"
            className="rounded-full"
          />

          <span className="font-semibold text-xl hidden sm:inline">
            Multicart
          </span>


        </div>

        {user.role == "user" &&
          <div className="hidden md:flex gap-8">
            {/* nav items */}
            <NavItem label="Home" path="/" router={router} />
            <NavItem label="Categories" path="/category" router={router} />
            <NavItem label="Shop" path="/shop" router={router} />
            <NavItem label="Orders" path="/orders" router={router} />

          </div>}

        {/* desktop ke liye */}
        <div className="hidden md:flex items-center gap-6">
          {user?.role == "user" && <IconBtn Icon={AiOutlineSearch}
            onClick={() => router.push("/category")} />}

          <IconBtn Icon={AiOutlinePhone} onClick={() => router.push("/support")} />

          <div className="relative">
            {user?.image ? <Image src={user?.image} alt="user" width={40} height={40}
              className="w-10 h-10 rounded-full border border-gray-700 object-cover cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)} />
              : <IconBtn Icon={AiOutlineUser} onClick={() => setMenuOpen(!menuOpen)} />}

            <AnimatePresence>
              {menuOpen && <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="absolute right-0 mt-3 w-48 backdrop-blur-lg rounded-xl shadow-lg border border-[#f5f1f13c]">
                <DropDownBtn Icon={AiOutlineUser} label="Profile"
                  onClick={() => { router.push("/profile"); setMenuOpen(false) }} />

                <DropDownBtn Icon={AiOutlineLogin} label="SignIn"
                  onClick={() => { router.push("/login"); setMenuOpen(false) }} />

                <DropDownBtn Icon={AiOutlineLogout} label="SignOut"
                  onClick={() => { signOut(); setMenuOpen(false) }} />

              </motion.div>}
            </AnimatePresence>

          </div>

          {user?.role == "user" && <CartBtn router={router} count={user.cart?.length} />}
        </div>


        {/* mobileIcon ke liye  menu */}
        <div className="md:hidden flex items-center gap-4">
          {user?.role == "vendor" || user?.role == "admin" ? (
            <>
              <IconBtn Icon={AiOutlinePhone} onClick={() => router.push("/support")} />

              <div className="relative">
                {user?.image ? <Image src={user?.image} alt="user" width={32} height={32}
                  className="w-8 h-8 rounded-full border border-gray-700 object-cover cursor-pointer"
                  onClick={() => setMenuOpen(!menuOpen)} />
                  : <IconBtn Icon={AiOutlineUser} onClick={() => setMenuOpen(!menuOpen)} />}

                <AnimatePresence>
                  {menuOpen && <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="absolute right-0 mt-3 w-48 backdrop-blur-lg rounded-xl shadow-lg border border-[#f5f1f13c]">
                    <DropDownBtn Icon={AiOutlineUser} label="Profile"
                      onClick={() => { router.push("/profile"); setMenuOpen(false) }} />

                    <DropDownBtn Icon={AiOutlineLogin} label="SignIn"
                      onClick={() => { router.push("/login"); setMenuOpen(false) }} />

                    <DropDownBtn Icon={AiOutlineLogout} label="SignOut"
                      onClick={() => { signOut(); setMenuOpen(false) }} />

                  </motion.div>}
                </AnimatePresence>

              </div>
            </>
          ) : (
            // for user role ke liye mobile menu //
            <>
              <IconBtn Icon={AiOutlineSearch} onClick={() => router.push("/category")} />
              <IconBtn Icon={AiOutlinePhone} onClick={() => router.push("/support")} />
              <CartBtn router={router} count={user.cart?.length} />
              <AiOutlineMenu size={28} className="cursor-pointer" onClick={() => setSidebarOpen(true)} />

              <AnimatePresence>
                {sidebarOpen && <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                  className="fixed top-0 right-0 w-[65%] h-screen bg-black/90 backdrop-blur-lg p-6 text-white"
                >

                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-semibold">Menu</h1>
                    <AiOutlineClose size={28} className="cursor-pointer"
                      onClick={() => setSidebarOpen(false)} />
                  </div>


                  <div className="flex flex-col gap-4 text-lg">
                    <SidebarBtn label="Home" path="/" router={router} Icon={AiOutlineHome}
                      setsidebarOpen={setSidebarOpen} />

                    <SidebarBtn label="Categories" path="/category" router={router}
                      Icon={AiOutlineAppstore} setsidebarOpen={setSidebarOpen} />

                    <SidebarBtn label="Shop" path="/shop" router={router}
                      Icon={AiOutlineShop} setsidebarOpen={setSidebarOpen} />

                    <SidebarBtn label="Orders" path="/orders" router={router} Icon={GoListUnordered}
                      setsidebarOpen={setSidebarOpen} />

                    <SidebarBtn label="Support" path="/support" router={router} Icon={AiOutlinePhone}
                      setsidebarOpen={setSidebarOpen} />

                    <SidebarBtn label="Profile" path="/profile" router={router} Icon={AiOutlineUser}
                      setsidebarOpen={setSidebarOpen} />

                    <SidebarBtn label="SignIn" path="/login" router={router} Icon={AiOutlineLogin}
                      setsidebarOpen={setSidebarOpen} />

                    <SidebarBtnForSignOut label="SignOut" Icon={AiOutlineLogout}
                      setsidebarOpen={setSidebarOpen} />


                  </div>


                </motion.div>}
              </AnimatePresence>
            </>
          )}
        </div>


      </div>
    </div>
  )
}

export default Navbar


// components //
const NavItem = ({ label, path, router }: any) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    onClick={() => router.push(path)}
    className="hover:text-gray-300">
    {label}
  </motion.button>
)

const IconBtn = ({ Icon, onClick }: any) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
  >
    <Icon size={24} />

  </motion.button>
)


const DropDownBtn = ({ Icon, label, onClick }: any) => (
  <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 text-left"
    onClick={() => onClick()}>
    <Icon size={18} /> {label}
  </button>
)


const CartBtn = ({ router, count }: any) => (
  <button
    onClick={() => router.push("/cart")}
    className="relative"
  >
    <AiOutlineShoppingCart size={24} />

    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full px-1 leading-none">
        {count}
      </span>
    )}
  </button>
);


const SidebarBtn = ({ label, path, router, Icon, setsidebarOpen }: any) => (
  <button className="flex items-center gap-3 text-left px-4 py-2 rounded-lg bg-[#6a69693c] hover:bg-white/10"
    onClick={() => { router.push(path); setsidebarOpen(false) }}>
    <Icon size={20} />{label}
  </button>
)

const SidebarBtnForSignOut = ({ label, Icon, setsidebarOpen }: any) => (
  <button className="flex items-center gap-3 text-left px-4 py-2 rounded-lg bg-[#6a69693c] hover:bg-white/10"
    onClick={() => { signOut(); setsidebarOpen(false) }}>
    <Icon size={20} />{label}
  </button>
)