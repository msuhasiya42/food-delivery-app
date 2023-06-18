import React from "react";
// import { useState } from "react";
import { useEffect, useState } from "react";
import { getUserData } from "../../ApiCalls";
import { logout } from "../../utils/functions";

const Header = () => {
  // const [isOpen, setOpen] = useState(false);
  // const handleDropDown = () => {
  //   setOpen(!isOpen);
  // };
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");
  const categories = ["Apple", "Samsung", "Lenovo", "Nothing", "OnePlus"];
  const tags = ["work", "personal", "jobhunt", "learning"];

  // for dark light theme
  // var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
  // var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

  // // Change the icons inside the button based on previous settings
  // if (
  //   localStorage.getItem("color-theme") === "dark" ||
  //   (!("color-theme" in localStorage) &&
  //     window.matchMedia("(prefers-color-scheme: dark)").matches)
  // ) {
  //   themeToggleLightIcon !== null
  //     ? themeToggleLightIcon.classList.remove("hidden")
  //     : "";
  // } else {
  //   themeToggleDarkIcon !== null
  //     ? themeToggleDarkIcon.classList.remove("hidden")
  //     : "";
  // }

  // var themeToggleBtn = document.getElementById("theme-toggle");

  // themeToggleBtn.addEventListener("click", function () {
  //   // toggle icons inside button
  //   themeToggleDarkIcon.classList.toggle("hidden");
  //   themeToggleLightIcon.classList.toggle("hidden");

  //   // if set via local storage previously
  //   if (localStorage.getItem("color-theme")) {
  //     if (localStorage.getItem("color-theme") === "light") {
  //       document.documentElement.classList.add("dark");
  //       localStorage.setItem("color-theme", "dark");
  //     } else {
  //       document.documentElement.classList.remove("dark");
  //       localStorage.setItem("color-theme", "light");
  //     }

  //     // if NOT set via local storage previously
  //   } else {
  //     if (document.documentElement.classList.contains("dark")) {
  //       document.documentElement.classList.remove("dark");
  //       localStorage.setItem("color-theme", "light");
  //     } else {
  //       document.documentElement.classList.add("dark");
  //       localStorage.setItem("color-theme", "dark");
  //     }
  //   }
  // });
  useEffect(() => {
    // for light dark theme
    // if (
    //   localStorage.getItem("color-theme") === "dark" ||
    //   (!("color-theme" in localStorage) &&
    //     window.matchMedia("(prefers-color-scheme: dark)").matches)
    // ) {
    //   document.documentElement.classList.add("dark");
    // } else {
    //   document.documentElement.classList.remove("dark");
    // }

    // getting user data
    getUserData(userId)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error retrieving user data:", error);
      });
  }, [userId]);

  return (
    <div>
      <nav className=" bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/user-dashboard" className="flex items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/747/747095.png"
              className="h-8 ml-36 mr-2"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Task-Manager
            </span>
          </a>
          <button
            data-collapse-toggle="navbar-dropdown"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-dropdown"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>

          {/* nav bar right side buttons */}

          <div
            className="hidden w-full md:block md:w-auto"
            id="navbar-dropdown"
          >
            <ul className="flex flex-col font-medium p-2 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {/* <li>
                <form>
                  <label
                    htmlFor="default-search"
                    className=" mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                  >
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="search"
                      id="default-search"
                      className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search Task..."
                      required
                    />
                    <button
                      type="submit"
                      className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </li> */}

              {/* filter button */}
              <li>
                <div className="flex items-center justify-center p-2">
                  <button
                    id="dropdownDefault"
                    data-dropdown-toggle="dropdown"
                    className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    type="button"
                  >
                    Filter
                    <svg
                      className="w-4 h-4 ml-2"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>

                  {/* <!-- Dropdown menu --> */}
                  <div
                    id="dropdown"
                    className="z-10 hidden w-56 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
                  >
                    <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                      Members
                    </h6>
                    <ul
                      className="space-y-2 text-sm mb-3"
                      aria-labelledby="dropdownDefault"
                    >
                      {categories.map((category, index) => (
                        <li key={index} className="flex items-center">
                          <input
                            id="apple"
                            type="checkbox"
                            value=""
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />

                          <label
                            htmlFor="apple"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            {category}
                          </label>
                        </li>
                      ))}
                    </ul>

                    {/* filter: by due date */}
                    <hr />
                    <h6 className="mb-2 mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      Due Date
                    </h6>
                    <ul
                      className="space-y-2 text-sm mb-4"
                      aria-labelledby="dropdownDefault"
                    >
                      {categories.map((category, index) => (
                        <li key={index} className="flex items-center">
                          <input
                            id="apple"
                            type="checkbox"
                            value=""
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />

                          <label
                            htmlFor="apple"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            {category}
                          </label>
                        </li>
                      ))}
                    </ul>

                    {/* filter : tags */}
                    <hr />
                    <h6 className="mt-1 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Tags
                    </h6>
                    <ul
                      className="space-y-2 text-sm"
                      aria-labelledby="dropdownDefault"
                    >
                      {tags.map((tag, index) => (
                        <li key={index} className="flex items-center">
                          <input
                            id="apple"
                            type="checkbox"
                            value=""
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />

                          <label
                            htmlFor="apple"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            {tag}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
              {/* user photo with options on it */}

              <li>
                <a href="/user-profile">
                  <div className="mt-1 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                    <div className="flex items-center space-x-2 ">
                      <img
                        className="w-7 h-7 rounded-full"
                        src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Images.png"
                        alt="User profile"
                      />

                      <div className="font-medium dark:text-white">
                        <div className="text-sm">
                          {user !== null ? user.name.split(" ")[0] : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </li>

              {/* theme change button */}
              {/* <li>
                <button
                  id="theme-toggle"
                  type="button"
                  className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
                >
                  <svg
                    id="theme-toggle-dark-icon"
                    className="hidden w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                  </svg>
                  <svg
                    id="theme-toggle-light-icon"
                    className="hidden w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li> */}
              {/* theme button end */}
              <li>
                <a
                  href="/login"
                  onClick={logout}
                  className=" mt-2 block  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  <button
                    type="button"
                    className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Logout
                  </button>
                </a>
              </li>
            </ul>
          </div>

          {/* nav bar right side buttons end */}
        </div>
      </nav>
    </div>
  );
};

export default Header;
