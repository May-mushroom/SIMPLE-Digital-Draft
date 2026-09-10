import React, { useEffect, useState } from "react";
import { useCurrentEditor } from "@tiptap/react";

import {
  EllipsisVertical,
  PanelLeft,
  Plus,
  FolderOpen,
  Info,
  Star,
} from "lucide-react";

import PopupFileWindow from "./PopUpFileWindow";
import SettingBar from "./SettingBar";
import FileList from "./FileList";

import {
  saveFileToDBStore,
  createNewFileObj,
  clearObjStore,
  updateObj,
} from "../storage/indexedDB.js";

function NavBar({ currentFile, setCurrentFile }) {
  const [allFiles, setAllFiles] = useState([]);
  const [settingOpen, setSettingOpen] = useState(false);
  const [popupFileWindowOpen, setPopupFileWindow] = useState(false);
  const [fileBarOpen, setFileBarOpen] = useState(false);
  const { editor } = useCurrentEditor();

  const handleOpenSetting = () => {
    setSettingOpen((settingOpen) => !settingOpen);
  };
  const handleOpenFileBar = () => {
    setFileBarOpen((fileBarOpen) => !fileBarOpen);
  };
  /**
   * 1. save currentFile obj to digital-draft obj store
   * 2. reset currentFile state to {htmlContent: ""}
   * 3. remove old record in current obj store
   * 3b. update new empty current obj store
   * 4. update editor content
   */
  const handleCreateNewFile = async () => {
    const newFile = createNewFileObj();
    await saveFileToDBStore(
      {
        ...currentFile,
        HTMLContent: editor.getHTML(),
      },
      "files",
    );
    setCurrentFile(newFile);
    await clearObjStore("current");
    await saveFileToDBStore(newFile, "current");
    editor.commands.clearContent(false);
  };
  const handleOpenNewFile = async () => {
    setPopupFileWindow(true);
  };
  /**
   * handle pin and unpin
   */
  const handlePinFile = async () => {
    const updatedObj = { ...currentFile, pinned: !currentFile.pinned };
    setCurrentFile(updatedObj);
    await updateObj("current", updatedObj);
  };
  return (
    <div className="relative">
      <NavBarTool
        isPinnedCurrent={currentFile.pinned}
        handleOpenSetting={handleOpenSetting}
        handleOpenFileBar={handleOpenFileBar}
        handleCreateNewFile={handleCreateNewFile}
        handleOpenNewFile={handleOpenNewFile}
        handlePinFile={handlePinFile}
      />
      {settingOpen && <SettingBar />}
      {popupFileWindowOpen && (
        <PopupFileWindow setPopupFileWindow={setPopupFileWindow} />
      )}
      {fileBarOpen && (
        <FileList
          open={fileBarOpen}
          currentFile={currentFile}
          setOpen={setFileBarOpen}
          setCurrentFile={setCurrentFile}
        />
      )}
    </div>
  );
}

function NavBarTool({
  isPinnedCurrent,
  handleOpenSetting,
  handleOpenFileBar,
  handleCreateNewFile,
  handleOpenNewFile,
  handlePinFile,
}) {
  return (
    <nav className="sticky top-0 z-10 h-10 shrink-0 border-b border-neutral-200 bg-white">
      <div className="flex h-full items-center justify-between px-5">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            className="p-1 transition-colors hover:bg-neutral-300 rounded-md "
            onClick={handleOpenFileBar}
          >
            <PanelLeft size={20} />
          </button>
          <button
            className="p-1 transition-colors hover:bg-neutral-300 rounded-md"
            onClick={handleCreateNewFile}
          >
            <Plus size={20} />
          </button>
          <button
            className="p-1 transition-colors hover:bg-neutral-300 rounded-md"
            onClick={handleOpenNewFile}
          >
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
            onClick={handlePinFile}
            className="p-1 transition-colors hover:bg-neutral-300 rounded-md"
          >
            <Star fill={isPinnedCurrent ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleOpenSetting}
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
