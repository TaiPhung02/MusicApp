import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { RiCloseLine } from "react-icons/ri";
import { MdFavorite, MdPlaylistPlay } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { logo } from "../assets";
import { links } from "../assets/constants";

const NavLinks = ({ handleClick, showFavourites, showPlaylist }) => (
  <div className="mt-10">
    {links.map((item) => (
      <NavLink
        key={item.name}
        to={item.to}
        end
        className={({ isActive }) =>
          `flex flex-row items-center my-8 text-sm font-medium transition-colors
          ${isActive ? "text-cyan-400" : "text-gray-400"} hover:text-cyan-400`
        }
        onClick={() => handleClick && handleClick()}>
        <item.icon className="w-6 h-6 mr-2 text-white" />{" "}
        {item.name}
      </NavLink>
    ))}

    {showFavourites && (
      <NavLink
        to="/my-favourites"
        className={({ isActive }) =>
          `flex flex-row items-center my-8 text-sm font-medium transition-colors
          ${isActive ? "text-red-400" : "text-gray-400"} hover:text-red-400`
        }
        onClick={() => handleClick && handleClick()}>
        <MdFavorite className="w-6 h-6 mr-2 text-red-400" />{" "}
        Favourites
      </NavLink>
    )}

    {showPlaylist && (
      <NavLink
        to="/my-playlist"
        className={({ isActive }) =>
          `flex flex-row items-center my-8 text-sm font-medium transition-colors
          ${isActive ? "text-blue-400" : "text-gray-400"} hover:text-blue-400`
        }
        onClick={() => handleClick && handleClick()}>
        <MdPlaylistPlay className="w-6 h-6 mr-2 text-blue-400" />{" "}
        Playlist
      </NavLink>
    )}
  </div>
);

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFavourites, setShowFavourites] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // check localStorage when component mount
  useEffect(() => {
    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    const playlists = JSON.parse(localStorage.getItem("playlists")) || [];

    setShowFavourites(favourites.length > 0);
    setShowPlaylist(playlists.length > 0);
  }, []);

  return (
    <>
      {/* Sidebar Desktop */}
      <div className="md:flex hidden flex-col w-[240px] py-10 px-4 bg-[#1B191F] border-r border-solid border-[#555257]">
        <LazyLoadImage
          src={logo}
          alt="logo"
          className="w-full h-14 object-contain"
          effect="blur"
        />
        <NavLinks showFavourites={showFavourites} showPlaylist={showPlaylist} />
      </div>

      <div className="absolute md:hidden block top-6 right-3">
        {mobileMenuOpen ? (
          <RiCloseLine
            className="w-6 h-6 text-white mr-2"
            onClick={() => setMobileMenuOpen(false)}
          />
        ) : (
          <HiOutlineMenu
            className="w-6 h-6 text-white mr-2"
            onClick={() => setMobileMenuOpen(true)}
          />
        )}
      </div>

      {/* Sidebar Mobile */}
      <div
        className={`absolute top-0 h-screen w-2/3 bg-gradient-to-tl from-white/10 to-[#483d8b] backdrop-blur-lg z-10 p-6 md:hidden smooth-transition ${
          mobileMenuOpen ? "left-0" : "-left-full"
        }`}>
        <LazyLoadImage
          src={logo}
          alt="logo"
          className="w-full h-14 object-contain"
          effect="blur"
        />
        <NavLinks
          handleClick={() => setMobileMenuOpen(false)}
          showFavourites={showFavourites}
          showPlaylist={showPlaylist}
        />
      </div>
    </>
  );
};

export default Sidebar;
