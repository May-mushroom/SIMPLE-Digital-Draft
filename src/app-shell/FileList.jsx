import React, { useEffect, useState } from "react";

import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import {
  clearObjStore,
  getAllFiles,
  saveFileToDBStore,
} from "@/storage/indexedDB";
import { useCurrentEditor } from "@tiptap/react";

/**
 * FileList
 *
 * All content is passed in via props — nothing is hardcoded.
 *
 * @param {boolean} open - whether the sidebar is visible
 * @param {function} setOpen - toggles sidebar visibility
 * @param {Array}  pinnedFiles - [{ id, name }]
 * @param {Array}  recentFiles - [{ id, name }]
 * @param {Array}  fileTree - [{ id, name, type: 'folder'|'file', children?: [...] }]
 * @param {string} selectedId - id of the currently active file
 * @param {function} onSelectFile - (file) => void, called when a file row is clicked
 */
function FileList({
  recentFiles = [],
  selectedId = null,
  open,
  currentFile,
  setOpen,
  setCurrentFile,
}) {
  const [activeSection, setActiveSection] = useState({
    recent: false,
    pin: false,
    file: true,
  });
  const [allFiles, setAllFiles] = useState([]);
  const pinnedFiles = allFiles.filter((file) => file.pinned == true);
  const { editor } = useCurrentEditor();

  useEffect(() => {
    getAllFiles("files")
      .then((files) => setAllFiles(files))
      .catch((error) => {
        console.error("Failed to load files:", error);
      });
  }, []);

  /**
   * 1. load current into files obj store
   * 2. load the selected into currentFile state
   * 3. load the currentFile state to current obj store
   */
  const handleSelectFile = async (fileObj) => {
    await saveFileToDBStore(
      {
        ...currentFile,
        HTMLContent: editor.getHTML(),
      },
      "files",
    );
    setCurrentFile(fileObj);
    await clearObjStore("current");
    await saveFileToDBStore(fileObj, "current");
    editor.commands.setContent(fileObj.HTMLContent);
    setOpen(false);
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 z-50
        flex h-screen w-[300px] flex-col
        border-r border-neutral-200 bg-white
        shadow-xl
        transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Header */}
      <div
        className="
          flex h-14 shrink-0 items-center justify-between
          border-b border-neutral-200
          px-4
        "
      >
        <span className="text-sm font-semibold text-neutral-700">Files</span>
        <button
          onClick={() => setOpen(false)}
          className="
            flex h-8 w-8 items-center justify-center
            rounded-md
            text-xl text-neutral-500
            transition-colors
            hover:bg-neutral-100
            hover:text-neutral-700
          "
          aria-label="Close sidebar"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Section title="Pinned" collapsible defaultOpen empty="No pinned files">
          {pinnedFiles.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              selected={file.id === selectedId} // what should I do with this?
              onSelectFile={handleSelectFile}
            />
          ))}
        </Section>

        <Section
          title="Recent"
          collapsible
          defaultOpen={false}
          empty="No recent files"
        >
          {recentFiles.map((file) => (
            <FileRow
              key={file.fileId}
              file={file}
              selected={file.id === selectedId}
              onSelectFile={handleSelectFile}
            />
          ))}
        </Section>

        <Section
          title="File"
          collapsible
          defaultOpen={false}
          empty="No recent files"
        >
          {allFiles.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              selected={file.id === selectedId}
              onSelectFile={handleSelectFile}
            />
          ))}
        </Section>
      </div>
    </aside>
  );
}

/** A labeled, optionally collapsible section wrapper. */
function Section({
  title,
  collapsible = false,
  defaultOpen = true,
  empty,
  children,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div>
      <button
        onClick={() => collapsible && setIsOpen((v) => !v)}
        className={`
          flex w-full items-center justify-between
          px-6 py-4
          ${collapsible ? "cursor-pointer" : "cursor-default"}
        `}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          {title}
        </p>
        {collapsible && (
          <span className="text-neutral-400 transition-transform">
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </span>
        )}
      </button>

      {(!collapsible || isOpen) && (
        <div>
          {hasChildren ? (
            children
          ) : (
            <p className="px-6 pb-3 text-sm text-neutral-400">{empty}</p>
          )}
        </div>
      )}
    </div>
  );
}
/** Styled component for file row */
function FileRow({ file, selected, onSelectFile }) {
  return (
    <button
      onClick={() => onSelectFile(file)}
      className={`
        flex w-full items-center justify-between
        py-3 px-6 text-left
        transition-colors
        ${selected ? "bg-neutral-100" : "hover:bg-neutral-100"}
      `}
    >
      <span
        className={`truncate text-sm ${
          selected
            ? "font-semibold text-neutral-900"
            : "font-medium text-neutral-700"
        }`}
      >
        {file.fileTitle}
      </span>
    </button>
  );
}

export default FileList;
