import Link from "next/link";
import React from "react";

import { images } from "../constants";
const Header = () => {
  return (
    <header className="flex max-w-7xl justify-between p-5 mx-auto">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img
            src={images.medium_1.src}
            alt="medium"
            className="w-44 object-contain cursor-pointer"
          />
        </Link>
        <div className="hidden md:inline-flex items-center space-x-5">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="rounded-full px-5 py-1 bg-green-600">Follow</h3>
        </div>
      </div>
      <div className="flex items-center space-x-5 text-green-600">
        <h3>Sign In</h3>
        <h3 className="rounded-full border px-5 py-1 border-green-600">
          Get Started
        </h3>
      </div>
    </header>
  );
};

export default Header;
