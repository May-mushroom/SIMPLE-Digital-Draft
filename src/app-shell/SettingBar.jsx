import React, { useContext, useRef, useState } from "react";
import {
  Save,
  PencilLine,
  Trash2,
  Download,
  Braces,
  FileInput,
  MopSparkles,
  RemoveFormatting,
  FileText,
  SquarePen,
  Moon,
} from "lucide-react";
import {
  clearObjStore,
  deleteObj,
  resetFileObjToDefault,
  updateObj,
} from "@/storage/indexedDB";
import { useCurrentEditor } from "@tiptap/react";
import { AppContext } from "@/App";

export default function SettingBar({ setSettingOpen }) {
  const { editor } = useCurrentEditor();
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editableOn, setEditableOn] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const renameRef = useRef(null);
  const {
    // currentFile,
    fileMeta,
    fileContent,
    inlineMenuOn,
    autoSaveOn,

    // setCurrentFile,
    setFileMeta,
    setFileContent,
    setAutoSaveOn,
    setInlineMenuOn,
  } = useContext(AppContext);

  const handleRename = () => {
    // setCurrentFile({ ...currentFile, fileTitle: renameRef.current.value });
    setFileMeta({ ...fileMeta, fileTitle: renameRef.current.value });
    setRenameOpen(false);
    setSettingOpen(false);
  };
  /**
   * 1. delete the file obj in "files" obj store (if exist)
   * 2. reset currentFile state
   * 3. delete the HTMLContent & pinned in "current" obj store: just put method (instead of delete and put)
   * - keep the current fileObj in current, just reset the current and delete the
   * current id in "files"
   */
  const handleDelete = async () => {
    // simply return if editor content is empty, since doesnt need to delete empty content
    if (!editor.getText()) {
      setDeleteOpen(false);
      return;
    }
    // const defaultFile = resetFileObjToDefault(currentFile.fileId);
    const defaultFile = resetFileObjToDefault(fileMeta.fileId);
    const { HTMLContent, ...rest } = defaultFile;
    // await deleteObj(currentFile.fileId, "files");
    await deleteObj(fileMeta.fileId, "files");

    // setCurrentFile(defaultFile);
    setFileMeta(rest);
    setFileContent(HTMLContent);
    // await updateObj("current", defaultFile);
    // editor.commands.setContent("");
    setDeleteOpen(false);
    setSettingOpen(false);
  };
  const handleDownload = (format) => {
    let content, extension;
    switch (format) {
      case "text":
        content = editor.getText();
        extension = "txt";
        break;
      case "json":
        content = JSON.stringify(editor.getJSON(), null, 2);
        extension = "json";
        break;
      case "markdown":
        content = editor.getMarkdown();
        extension = "md";
        console.log(content);
        break;
      default:
        content = "Error: there's something wrong. Report to the dev!!";
    }
    const blob = new Blob([content], { type: format });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    // a.download = `Digital-Draft-${currentFile.fileTitle}.${extension}`;
    a.download = `Digital-Draft-${fileMeta.fileTitle}.${extension}`;

    a.click();

    URL.revokeObjectURL(url);
  };
  /**
   * 1. clear all data in "files" obj store
   * 2. "current" and currentFile state stays the same
   */
  const handleClearData = async () => {
    await clearObjStore("files");
    setSettingOpen(false);
  };
  const handleToggleInlineMenu = () => {
    setInlineMenuOn((state) => !state);
  };
  const handleToggleAutoSave = () => {
    setAutoSaveOn((state) => !state);
  };
  const handleToggleEditable = (e) => {
    setEditableOn((state) => !state);
    editor.setEditable(e.target.checked);
  };
  const handleToggleDarkMode = (e) => {
    setDarkMode((darkMode) => !darkMode);
  };
  return (
    <div className="absolute right-10 top-[52px] z-50 w-[250px] rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
      {/* File */}
      <Section id="file-section" sectionTitle="File">
        <MenuItem
          name="Rename"
          icon={<PencilLine size={16} />}
          onClick={() => setRenameOpen(true)}
        />
        <MenuItem
          name="Delete"
          icon={<Trash2 size={16} />}
          danger={true}
          onClick={() => {
            setDeleteOpen(true);
          }}
        />
        <MenuItem
          name="Download"
          icon={<Download size={16} />}
          onClick={() => handleDownload("text")}
        />
        <MenuItem
          name="Download JSON"
          icon={<Braces size={16} />}
          onClick={() => handleDownload("json")}
        />
        <MenuItem
          name="Download Markdown"
          icon={<FileText size={16} />}
          onClick={() => handleDownload("markdown")}
        />
        <MenuItem
          name="Move To Google Docs"
          icon={<FileInput size={16} />}
          onClick={() => {}}
        />
      </Section>

      {/** App */}
      <Section id="app-section" sectionTitle="App">
        <MenuItem
          name="Clear All Local Data"
          icon={<MopSparkles size={16} />}
          onClick={handleClearData}
          danger={true}
        />
      </Section>
      {/** View & Settings */}
      <Section id="view-section" sectionTitle="View & Settings">
        <ToggleItem
          name="Auto Save"
          icon={<Save size={16} />}
          checked={autoSaveOn}
          onClick={handleToggleAutoSave}
        />
        <ToggleItem
          name="Inline Tool Bar"
          icon={<RemoveFormatting size={16} />}
          onClick={handleToggleInlineMenu}
          checked={inlineMenuOn}
        />
        <ToggleItem
          name="Editable"
          icon={<SquarePen size={16} />}
          checked={editableOn}
          onClick={(e) => handleToggleEditable(e)}
        />
        <ToggleItem
          name="Dark Mode"
          icon={<Moon size={16} />}
          checked={darkMode}
          onClick={handleToggleDarkMode}
        />
      </Section>
      {renameOpen && (
        <PopUpRename
          renameRef={renameRef}
          onRename={handleRename}
          setRenameOpen={setRenameOpen}
        />
      )}
      {deleteOpen && (
        <PopUpDelete
          setDeleteOpen={setDeleteOpen}
          onDeleteClick={handleDelete}
        />
      )}
    </div>
  );
}
function MenuItem({ icon, name, danger = false, onClick }) {
  return (
    <button
      className={`flex w-full items-center gap-4 rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-neutral-800 hover:bg-neutral-100"
      }`}
      onClick={onClick}
    >
      <span className="w-5 shrink-0">{icon}</span>

      <span>{name}</span>
    </button>
  );
}
function ToggleItem({ icon, name, checked, onClick }) {
  return (
    <div className="flex z-5 w-full items-center gap-4 rounded-lg px-2 py-1.5 text-left text-[13px] text-neutral-800">
      <span className="w-5 shrink-0">{icon}</span>

      <span className="flex-1">{name}</span>

      <label className="relative inline-flex w-10 aspect-[2/1] cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onClick}
          className="peer sr-only"
        />

        <div className="h-full w-full rounded-full bg-gray-300 peer-checked:bg-blue-500" />

        <div className="absolute left-[8%] top-[10%] aspect-square h-[80%] rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-[100%]" />
      </label>
    </div>
  );
}
function Section({ sectionTitle, children }) {
  return (
    <section className="mt-3">
      <h3 className="mb-2 px-2 text-sm font-semibold text-neutral-400">
        {sectionTitle}
      </h3>
      {children}
    </section>
  );
}
function PopUpRename({ renameRef, onRename, setRenameOpen }) {
  return (
    <div className="fixed inset-0 z-2 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="w-[35%] h-[30%] rounded-md bg-white p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Rename</h2>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => setRenameOpen(false)}
          >
            ✕
          </button>
        </div>
        <input
          ref={renameRef}
          className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none mb-5"
        />
        <div className="flex justify-center gap-3">
          <button
            className="px-5 py-2.5 rounded-lg bg-gray-100 font-medium hover:bg-gray-200"
            onClick={() => setRenameOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600"
            onClick={onRename}
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  );
}
function PopUpDelete({ setDeleteOpen, onDeleteClick }) {
  return (
    <div className="fixed inset-0 z-2 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="w-[35%] h-[30%] rounded-md bg-white p-6 shadow-xl">
        <div className="mb-4 text-center">
          <h2 className="mb-4 font-bold">Discard??</h2>
          <p>
            Discard this editing text data? (Delete completely from your local)
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            className="px-5 py-2.5 rounded-lg bg-gray-100 font-medium hover:bg-gray-200"
            onClick={() => {
              setDeleteOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
            onClick={onDeleteClick}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}
