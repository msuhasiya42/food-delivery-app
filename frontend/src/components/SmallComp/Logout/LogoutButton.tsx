import React from "react";
import useAuthStore from "../../../Store/authStore";
import { LogoutOutlined } from "@ant-design/icons";
const LogoutButton = () => {
  const { logout } = useAuthStore();
  const logoutUser = () => {
    logout();
  };
  return (
    <div className="ml-4">
      <button
        onClick={logoutUser}
        className=" text-white flex flex-row justify-center items-center m-1 btn-sm w-24 rounded-md hover:cursor-pointer"
      >
        <LogoutOutlined className="mr-2" />
        <p className="hidden sm:block"> Logout</p>
      </button>
    </div>
  );
};

export default LogoutButton;
