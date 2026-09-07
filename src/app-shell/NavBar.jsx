import React, { useState } from "react";
import SettingBar from "./SettingBar";
import FileList from "./FileList";
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
  const [fileBarOpen, setFileBarOpen] = useState(false);
  const handleSettingClick = () => {
    setSettingOpen((settingOpen) => !settingOpen);
  };
  const handleFileBarOpen = () => {
    setFileBarOpen((fileBarOpen) => !fileBarOpen);
  };
  return (
    <div className="relative">
      <NavBarTool
        handleSettingClick={handleSettingClick}
        handleFileBarOpen={handleFileBarOpen}
      />
      {settingOpen && <SettingBar />}
      <FileList open={fileBarOpen} />
    </div>
  );
}

function NavBarTool({ handleSettingClick, handleFileBarOpen }) {
  return (
    <nav className="sticky top-0 z-50 h-10 shrink-0 border-b border-neutral-200 bg-white">
      <div className="flex h-full items-center justify-between px-5">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            className="p-1 transition-colors hover:bg-neutral-300 rounded-md "
            onClick={handleFileBarOpen}
          >
            <PanelLeft size={20} />
          </button>
          <button className="p-1 transition-colors hover:bg-neutral-300 rounded-md">
            <Plus size={20} />
          </button>
          <button className="p-1 transition-colors hover:bg-neutral-300 rounded-md">
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
            className="p-1 transition-colors hover:bg-neutral-300 rounded-md"
          >
            <EllipsisVertical size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
