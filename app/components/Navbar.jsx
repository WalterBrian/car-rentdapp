"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { Link } from "react-router-dom";
import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="pt-4 container mx-auto px-8">
      <nav className=" flex justify-between items-center mt-[30px]">
        <div className=" sm:flex cursor-pointer gap-3">
          <Link href="/">
          <h3 className="text-[#2e37ba] text-4xl max-sm:text-2xl font-bold leading-none">
            Car Tour
          </h3></Link>
        </div>
        <div className=" sm:flex cursor-pointer gap-3">
          <Link href="/car">
          <h3 className="text-[#2e37ba] text-2xl max-sm:text-xl font-bold leading-none">
            Hire Car
          </h3></Link>
        </div>
        <div className="hidden  sm:flex mt-[20px] ">
          <ConnectButton />
        </div>

        <div className="md:hidden  mt-3">
          <button className="text-dark" onClick={toggleMenu}>
            {isOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed 
         flex flex-col 
         items-center gap-6 justify-center"
        >
          <button
            className="text-white absolute top-12 right-4"
            onClick={toggleMenu}
          >
            <FaTimes className="text-2xl" />
          </button>

          <div className="  sm:flex mt-[20px] ">
            <ConnectButton />
          </div>
        </div>
      )}
    </header>
  );
}
