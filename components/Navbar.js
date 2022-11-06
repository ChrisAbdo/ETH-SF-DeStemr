import { useEffect } from "react";

const Navbar = ({ Web3Handler, account }) => {
  // use effect to make id=dropdown-menu have an animation of fading in from the top, pure css
  useEffect(() => {
    const dropdownMenu = document.getElementById("dropdown-menu");
    dropdownMenu.classList.add("animate-fade-in-down");
  }, []);
  return (
    <>
      <div className="navbar  border-black border-b-[2px] sticky top-0 z-50 bg-white">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              id="dropdown-menu"
              tabIndex={0}
              className="shadow menu dropdown-content bg-black rounded-box  text-white w-52"
            >
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/marketplace">Marketplace</a>
              </li>

              <li>
                <a href="/create-and-list-nft">Create and List NFT</a>
              </li>
              <li>
                <a href="/my-listed-nfts">Listed Stems</a>
              </li>
              <li>
                <a href="/my-nfts">Owned Stems</a>
              </li>
              <li>
                <a href="/stream">Livestream</a>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost normal-case text-xl">DeStemr</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <img
            src="https://assets-global.website-files.com/6171b265e5c8aa59b42c3472/618ea7afd990103829d614ff_gumroad-logo.svg"
            alt="background"
            className=" xs:block md:hidden"
          />

          <div
            className="flex space-x-9 px-8 xl:px-20
            xl:space-x-20 text-[17px]
          "
          >
            <a
              href="/"
              className="hidden md:block relative before:content-[''] before:absolute before:block before:w-full before:h-[1px] 
              before:bottom-0 before:left-0 before:bg-black
              before:hover:scale-x-100 before:scale-x-0 before:origin-top-left
              before:transition before:ease-in-out before:duration-300"
            >
              Home
            </a>
            <a
              href="/marketplace"
              className="hidden md:block relative before:content-[''] before:absolute before:block before:w-full before:h-[1px] 
              before:bottom-0 before:left-0 before:bg-black
              before:hover:scale-x-100 before:scale-x-0 before:origin-top-left
              before:transition before:ease-in-out before:duration-300"
            >
              Marketplace
            </a>
            <a
              href="/create-and-list-nft"
              className="hidden md:block relative before:content-[''] before:absolute before:block before:w-full before:h-[1px] 
              before:bottom-0 before:left-0 before:bg-black
              before:hover:scale-x-100 before:scale-x-0 before:origin-top-left
              before:transition before:ease-in-out before:duration-300"
            >
              Create Stem
            </a>
            <a
              href="/my-nfts"
              className="hidden md:block relative before:content-[''] before:absolute before:block before:w-full before:h-[1px] 
              before:bottom-0 before:left-0 before:bg-black
              before:hover:scale-x-100 before:scale-x-0 before:origin-top-left
              before:transition before:ease-in-out before:duration-300"
            >
              Owned Stems
            </a>
            <a
              href="/my-listed-nfts"
              className="hidden md:block relative before:content-[''] before:absolute before:block before:w-full before:h-[1px] 
              before:bottom-0 before:left-0 before:bg-black
              before:hover:scale-x-100 before:scale-x-0 before:origin-top-left
              before:transition before:ease-in-out before:duration-300"
            >
              Listed Stems
            </a>
            <a
              href="/stream"
              className="hidden md:block relative before:content-[''] before:absolute before:block before:w-full before:h-[1px] 
              before:bottom-0 before:left-0 before:bg-black
              before:hover:scale-x-100 before:scale-x-0 before:origin-top-left
              before:transition before:ease-in-out before:duration-300"
            >
              Live Stream
            </a>
          </div>
        </div>
        <div className="navbar-end">
          <a
            onClick={Web3Handler}
            href="#_"
            className="relative inline-block px-4 py-2  group"
          >
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-[#6AB313] group-hover:-translate-x-0 group-hover:-translate-y-0 border-black border-[2px]"></span>
            <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-[#6AB313]"></span>
            {account ? (
              <span className="relative text-black group-hover:text-black ">
                {account.slice(0, 5) + "..." + account.slice(-4)}
              </span>
            ) : (
              <span className="relative text-black group-hover:text-black ">
                Connect Wallet
              </span>
            )}
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
