import React from "react";
import { Logo } from "../../assets/Logo";
import { Button, SearchBar } from "../index.js";

import {
  CameraIcon,
  FolderClosed,
  HelpCircle,
  History,
  HomeIcon,
  Search,
  Settings,
  ThumbsUpIcon,
  UserRoundCheck,
  XCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutBtn from "./LogoutBtn.jsx";

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);

  const navigate = useNavigate();

  const navItems = [
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
  ];

  const navItemSide = [
    {
      name: "Liked Videos",
      icon: <ThumbsUpIcon />,
      slug: "/liked-videos",
    },

    {
      name: " My Content",
      icon: <CameraIcon />,
      slug: "/my-content",
    },

    {
      name: "Support",
      icon: <HelpCircle />,
      slug: "/support",
    },

    {
      name: "Setting",
      icon: <Settings />,
      slug: "/setting",
    },
  ];
  return (
    <>
      <div className="h-screenbg-[#121212] text-white">
        <header className="sticky inset-x-0 top-0 z-50 w-full border-b border-white bg-[#121212] px-4">
          <nav className="mx-auto flex max-w-7xl items-center py-2">
            <div
              className="mr-4 w-12 shrink-0 sm:w-16"
              onClick={() => navigate("/")}
            >
              <Logo />
            </div>
            <SearchBar />
            <button className="ml-auto sm:hidden">
              <Search />
            </button>
            <button className="group peer ml-4 flex w-6 shrink-0 flex-wrap gap-y-1.5 sm:hidden">
              <span className="block h-[2px] w-full bg-white group-hover:bg-[#ae7aff]"></span>
              <span className="block h-[2px] w-2/3 bg-white group-hover:bg-[#ae7aff]"></span>
              <span className="block h-[2px] w-full bg-white group-hover:bg-[#ae7aff]"></span>
            </button>
            <div className="fixed inset-y-0 right-0 flex w-full max-w-xs shrink-0 translate-x-full flex-col border-l border-white bg-[#121212] duration-200 hover:translate-x-0 peer-focus:translate-x-0 sm:static sm:ml-4 sm:w-auto sm:translate-x-0 sm:border-none">
              <div className="relative flex w-full items-center justify-between border-b border-white px-4 py-2 sm:hidden">
                <span className="inline-block w-12">
                  <Logo />
                </span>
                <button className="inline-block w-8">
                  <XCircle />
                </button>
              </div>
              <ul className="my-4 flex w-full flex-wrap gap-2 px-4 sm:hidden">
                {navItemSide.map((item) => (
                  <NavLink className="w-full" to={item.slug} key={item.slug}>
                    <button className="flex w-full items-center justify-start gap-x-4 border border-white px-4 py-1.5 text-left hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black">
                      <span className="inline-block w-full max-w-[20px] group-hover:mr-4 lg:mr-4">
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </button>
                  </NavLink>
                ))}
              </ul>
              <div className="mb-8 mt-auto flex w-full flex-wrap gap-4 px-4 sm:mb-0 sm:mt-0 sm:items-center sm:px-0">
                {navItems.map((item) =>
                  item.active ? (
                    <div key={item.name}>
                      <button
                        onClick={() => navigate(item.slug)}
                        className="w-full bg-[#383737] px-3 py-2 hover:bg-[#4f4e4e] sm:w-auto sm:bg-transparent border-2 border-[#383737]"
                      >
                        {item.name}
                      </button>
                    </div>
                  ) : null
                )}
                {authStatus && (
                  <span>
                    <span className=" text-white">MyProfile</span>
                    <LogoutBtn />
                  </span>
                )}
              </div>
            </div>
          </nav>
        </header>
      </div>
    </>
  );
};

export default Header;
