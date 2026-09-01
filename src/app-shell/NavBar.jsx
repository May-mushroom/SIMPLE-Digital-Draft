import React, { useState } from "react";
import SettingBar from "./SettingBar";
import {
  EllipsisVertical,
  PanelLeft,
  Plus,
  FolderOpen,
  Info,
} from "lucide-react";

// replace button name with icon later
function NavBar() {
  const [settingOpen, setSettingOpen] = useState(false);
  const handleSettingClick = () => {
    setSettingOpen((settingOpen) => !settingOpen);
  };

  return (
    <div className="relative">
      <NavBarTool handleSettingClick={handleSettingClick} />
      {settingOpen && <SettingBar />}
    </div>
  );
}

function NavBarTool({ handleSettingClick }) {
  return (
    <nav className="sticky top-0 z-50 h-10 border-b border-neutral-200 bg-white">
      <div className="flex h-full items-center justify-between px-5">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button className="p-1">
            <PanelLeft size={20} />
          </button>
          <button className="p-1">
            <Plus size={20} />
          </button>
          <button className="p-1">
            <FolderOpen size={20} />
          </button>
        </div>

        {/* Center */}
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3">
          <span className="text-neutral-500">
            <Info size={20} />
          </span>
          <span className="text-sm">Title</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSettingClick}
            className="rounded-xl p-3 hover:bg-neutral-100"
          >
            <EllipsisVertical size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
