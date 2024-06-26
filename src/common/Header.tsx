import React, { useEffect, useRef, useState } from "react";
import ConnectWallet from "./ConnectWallet";
import Icon from "./Icon";
import { useNavigate, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState("");

  const history = useRef<string[]>([]);

  useEffect(() => {
    history.current.push(location.pathname);

    if (location.pathname == "/") history.current = [];

    setTimeout(() => {
      const titleArr = document.title.split("|");
      setTitle(titleArr.at(titleArr.length - 1) || "Home");
    }, 10);
  }, [location]);

  return (
    <header className="border-border border-b p-page py-3 flex justify-between items-center sticky top-0 bg-background z-[101]">
      <div className="flex justify-center items-center">
        <button
          className={twMerge(
            "group duration-300 pr-2",
            history.current.length == 0 && "w-0 scale-0 pr-0"
          )}
          onClick={() => {
            history.current.pop();
            navigate(history.current.pop() || "");
          }}
        >
          <Icon
            icon="back_ios_new"
            className="text-mute group-hover:text-front"
          />
        </button>

        <h1 className="text-xl font-black text-mute">{title}</h1>
      </div>

      <div className="flex items-center gap-x-4 mobile:-translate-x-12">
        <ConnectWallet />
      </div>
      {/*className="text-sm max-h-10 py-2 px-6 w-max h-max" />*/}
    </header>
  );
}
