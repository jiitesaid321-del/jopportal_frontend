import React, { useContext } from "react";
import { FaBriefcase } from "react-icons/fa";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";

function Navbar() {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setShowRecriuterLogin } = useContext(AppContext);

  // Handle logo click — go to home
  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <>
      {/* 👇 ENTIRE LOGO AREA IS NOW CLICKABLE */}
      <div
        onClick={handleLogoClick}
        className="cursor-pointer absolute top-5 left-5 flex items-center space-x-1 text-xl font-semibold hover:opacity-80 transition-opacity"
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleLogoClick();
          }
        }}
      >
        <FaBriefcase className="text-lime-500 text-2xl" />
        <span className="text-black">Job</span>
        <b className="text-lime-500">Portal</b>
      </div>

      {user ? (
        <div className="absolute top-0 right-0 p-4 space-x-4 flex items-center gap-1">
          <Link
            to={"/applications"}
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Applied Jobs
          </Link>
          <p className="text-gray-700">
            Hi, {user.firstName} {user.lastName}
          </p>
          <UserButton />
        </div>
      ) : (
        <div className="absolute top-0 right-0 p-4 space-x-4">
          {/* Green Yellow Button */}
          <button
            onClick={() => setShowRecriuterLogin(true)}
            className="px-4 py-1 text-white bg-[#A3E635] hover:bg-[#8fc52d] rounded-lg font-medium transition-colors"
          >
            Company Login
          </button>

          {/* Smaller Grey Text Button */}
          <button
            className="px-4 py-1 text-gray-500 border border-gray-500 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            onClick={() => openSignIn()}
          >
            Log in
          </button>
        </div>
      )}
    </>
  );
}

export default Navbar;
