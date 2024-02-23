import { Search } from "lucide-react";
import React from "react";

const SearchBar = () => {
  return (
    <>
      <div className="relative mx-auto hidden w-full max-w-md overflow-hidden sm:block">
        <input
          className="w-full border bg-transparent py-1 pl-8 pr-3 placeholder-white outline-none sm:py-2"
          placeholder="Search"
        />
        <span className="absolute left-2.5 top-1/2 inline-block -translate-y-1/2">
          <Search width={16} height={16} />
        </span>
      </div>
    </>
  );
};

export default SearchBar;
