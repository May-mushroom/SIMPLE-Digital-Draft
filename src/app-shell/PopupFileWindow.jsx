import { useState, useEffect, useContext } from "react";

import { Clock, Star, FileText, X, Trash2 } from "lucide-react";

import {
  clearObjStore,
  deleteObj,
  getAllFiles,
  getFile,
  saveFileToDBStore,
} from "@/storage/indexedDB";
import { useCurrentEditor } from "@tiptap/react";
import { AppContext } from "@/App";

const NAV_ITEMS = [
  { id: "recent", label: "Recent", icon: Clock },
  { id: "pinned", label: "Pinned", icon: Star },
  { id: "local", label: "Local Cache", icon: null },
];

export default function PopupFileWindow({ setPopupFileWindow }) {
  const [activeNav, setActiveNav] = useState("local");
  const [files, setFiles] = useState([]);
  const { editor } = useCurrentEditor();
  const { currentFile, setCurrentFile } = useContext(AppContext);

  /**
   * popup window, when mounts, blocks actions in the writting area.
   * So fetch all files once everytime the component mounts always give up-to-date data
   */
  useEffect(() => {
    getAllFiles("files")
      .then((files) => setFiles(files))
      .catch((error) => {
        console.error("Failed to load files:", error);
      });
  }, []);

  const handleDelete = async (id) => {
    setFiles((prev) => prev.filter((file) => file.fileId !== id));
    await deleteObj(id, "files");
  };
  /**
   * 1. save current file to "files" obj store
   * 2. clear "current" obj store
   * 3. move the chosen file from "files" to "current"
   */
  const handleFileClick = async (id) => {
    await saveFileToDBStore(
      { ...currentFile, HTMLContent: editor.getHTML() },
      "files",
    );
    await clearObjStore("current");
    const chosenFile = await getFile(id, "files");
    console.log("chosen file", chosenFile);
    setCurrentFile(chosenFile);
    setPopupFileWindow(false);
  };

  const handleOnClose = () => {
    setPopupFileWindow(false);
  };
  const activeLabel =
    NAV_ITEMS.find((item) => item.id === activeNav)?.label ?? "";

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
      <div className="flex h-[80vh] z-30 w-[70vw] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
          <h2 className="text-2xl font-semibold text-gray-900">Open</h2>
          <button
            type="button"
            onClick={handleOnClose}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="flex w-64 flex-col justify-between border-r border-gray-100 p-6">
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  active={activeNav === item.id}
                  onClick={() => setActiveNav(item.id)}
                />
              ))}
            </nav>
          </div>

          {/* rendering */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="px-8 pb-2 pt-6 text-lg font-semibold text-gray-900">
              {activeLabel}
            </h3>
            <div className="divide-y divide-gray-100">
              {activeNav === "recent" && (
                <p className="px-8 py-4 text-sm text-gray-400">
                  recent: to be done soon...
                </p>
              )}
              {activeNav === "pinned" && (
                <p className="px-8 py-4 text-sm text-gray-400">
                  pinned: to be done soon...
                </p>
              )}
              {activeNav === "local" &&
                files.map((file) => (
                  <FileRow
                    key={file.fileId}
                    {...file}
                    onClick={() => handleFileClick(file.fileId)}
                    onDelete={() => handleDelete(file.fileId)}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ label, icon: Icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-base transition-colors ${
        active
          ? "bg-gray-100 font-medium text-gray-900"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {label}
    </button>
  );
}

export function FileRow({
  fileTitle,
  preview = "",
  active,
  onDelete,
  onClick,
}) {
  return (
    <div
      className={`group flex w-full items-center gap-4 px-8 py-4 transition-colors hover:bg-gray-50 ${
        active ? "bg-gray-100" : ""
      }`}
    >
      <button
        type="button"
        className="flex flex-1 items-center gap-4 text-left"
        onClick={onClick}
      >
        <FileText className="h-5 w-5 shrink-0 text-gray-400" />
        <span className="flex-1 truncate text-[15px] text-gray-900">
          {fileTitle}
          {preview && <span className="text-gray-400"> — {preview}</span>}
        </span>
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${fileTitle}`}
        className={`shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 ${
          active ? "block" : "hidden group-hover:block"
        }`}
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
