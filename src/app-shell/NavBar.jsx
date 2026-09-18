import React, { createContext, useContext, useState } from "react";
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
  getCurrentFileObj,
} from "../storage/indexedDB.js";
import { AppContext } from "@/App";

const NavBarContext = createContext();
function NavBar() {
  const [allFiles, setAllFiles] = useState([]);
  const [settingOpen, setSettingOpen] = useState(false);
  const [popupFileWindowOpen, setPopupFileWindow] = useState(false);
  const [fileBarOpen, setFileBarOpen] = useState(false);
  const [isPin, setIsPin] = useState(false);

  const { editor } = useCurrentEditor();
  // const { currentFile, setCurrentFile, fileMeta, setFileMeta, setFileContent } =
  //   useContext(AppContext);
  const { fileContent, fileMeta, setFileMeta, setFileContent } =
    useContext(AppContext);

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
    const { HTMLContent, ...rest } = createNewFileObj();
    if (editor.getText()) {
      await saveFileToDBStore(
        // {
        //   ...currentFile,
        //   HTMLContent: editor.getHTML(),
        // },
        { ...fileMeta, HTMLContent: editor.getHTML() },
        "files",
      );
    }
    await clearObjStore("current");
    // setCurrentFile(newFile);
    setFileContent(HTMLContent);
    setFileMeta(rest);
    editor.commands.clearContent(false);

    // await saveFileToDBStore(newFile, "current");
  };
  const handleOpenNewFile = async () => {
    setPopupFileWindow(true);
  };
  /**
   * handle pin and unpin
   */
  const handlePinFile = async () => {
    // const updatedObj = { ...currentFile, pinned: !currentFile.pinned };
    // setCurrentFile(updatedObj);
    // await updateObj("current", updatedObj);
    setFileMeta({ ...fileMeta, pinned: !fileMeta.pinned });
    setIsPin((isPin) => !isPin);
  };
  return (
    <div className="fixed top-0 left-0 right-0 z-10">
      <NavBarContext
        value={{
          fileTitle: fileMeta.fileTitle,
          isPin: isPin,

          handleOpenSetting: handleOpenSetting,
          handleOpenFileBar: handleOpenFileBar,
          handleCreateNewFile: handleCreateNewFile,
          handleOpenNewFile: handleOpenNewFile,
          handlePinFile: handlePinFile,
        }}
      >
        <NavBarTool />
      </NavBarContext>

      {settingOpen && <SettingBar setSettingOpen={setSettingOpen} />}
      {popupFileWindowOpen && (
        <PopupFileWindow setPopupFileWindow={setPopupFileWindow} />
      )}
      {fileBarOpen && (
        <FileList
          open={fileBarOpen}
          // currentFile={currentFile}
          setOpen={setFileBarOpen}
          // setCurrentFile={setCurrentFile}
        />
      )}
    </div>
  );
}

function NavBarTool() {
  const {
    fileTitle,
    isPin,

    handleOpenSetting,
    handleOpenFileBar,
    handleCreateNewFile,
    handleOpenNewFile,
    handlePinFile,
  } = useContext(NavBarContext);
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
          <span className="text-sm">{fileTitle}</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePinFile}
            className="p-1 transition-colors hover:bg-neutral-300 rounded-md"
          >
            <Star fill={isPin ? "currentColor" : "none"} />
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
