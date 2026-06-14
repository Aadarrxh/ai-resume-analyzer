import React, { useState } from "react";
import { IoGrid, IoSettingsSharp } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";

import Button from "../../ui/components/buttons/Button";
import useAppNavigate from "../../ui/hooks/navigator";

import Profile from "../components/Profile";
import Overview from "../components/Overview";
import EditProfile from "../components/EditProfile";
import History from "../components/History";

import "./styles/sidebar.scss";

const SideBar = () => {
  const goTo = useAppNavigate();

  const [activeTab, setActiveTab] = useState("profile");

  const barItems = [
    { key: "dashboard", icon: <IoGrid />, label: "Dashboard" },
    { key: "history", icon: <FaClockRotateLeft size={18} />, label: "History" },
    { key: "profile", icon: <FaRegUser />, label: "Profile" },
    { key: "edit", icon: <IoSettingsSharp size={20} />, label: "Edit Profile" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Overview />;
      case "history":
        return <History />;
      case "profile":
        return <Profile />;
      case "edit":
        return <EditProfile />;
      default:
        return <Profile />;
    }
  };

  return (
    <div
      className={`layout ${
        activeTab === "dashboard" ? "overview-layout" : "normal-layout"
      }`}

      style={{
          minHeight: activeTab === "dashboard" ? "205svh" : "125svh",
      }}
    >
    <aside className="side-bar">
        <div className="bar-items">
          {barItems.map((item) => (
            <div
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`bar-item  ${
                activeTab === item.key ? "active-blue offset-black" : ""
              }`}
            >
              {item.icon}
              <p>{item.label}</p>
            </div>
          ))}
        </div>

        <div className="scan-btn">
          <Button
            clickHandler={() => goTo("/app")}
            text="New Analysis"
            color="#000"
            bg="#fff"
            isBorder={true}
            borderValue={2}
          />
        </div>
      </aside>

      <main className="content-area">{renderContent()}</main>
    </div>
  );
};

export default SideBar;