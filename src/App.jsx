import { createContext, useEffect, useMemo, useState } from "react";

import { useEditor, EditorContext } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import Typography from "@tiptap/extension-typography";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Markdown } from "@tiptap/markdown";

import NavBar from "./app-shell/NavBar.jsx";
import Tiptap from "./app-shell/Tiptap.jsx";

import {
  debouncedAutoSave,
  getCurrentFileObj,
  updateObj,
} from "./storage/indexedDB.js";

export const AppContext = createContext();
export default function App() {
  // const [currentFile, setCurrentFile] = useState({});
  const [fileMeta, setFileMeta] = useState({});
  const [fileContent, setFileContent] = useState("");
  const [inlineMenuOn, setInlineMenuOn] = useState(true);
  const [autoSaveOn, setAutoSaveOn] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "start here baby !!",
      }),
      Typography,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Markdown,
    ],
    content: "", // initial content
    editable: true,
    autofocus: "end",
    immediatelyRender: false,
    onCreate: () => {
      getCurrentFileObj().then((currentFile) => {
        // setCurrentFile(currentFile);
        const { HTMLContent, ...rest } = currentFile;
        setFileMeta(rest);
        setFileContent(HTMLContent);
        editor.commands.setContent(currentFile.HTMLContent);
      });
    },
    onUpdate: ({ editor, transaction }) => {
      if (!autoSaveOn || !transaction.docChanged) {
        console.log(`doc changed: ${transaction.docChanged}`);
        console.log(`autosave is on: ${autoSaveOn}`);
        return;
      }
      debouncedAutoSave({
        ...fileMeta,
        HTMLContent: editor.getHTML(),
      });
    },
  });
  // useEffect(() => {
  //   if (!editor) return;
  //   // pretty much whenever currentFile change, its the data fetch from "current" or "files"
  //   // so currentHTMLContent is up-to-date, so not update with editor.content
  //   updateObj("current", currentFile);
  //   editor.commands.setContent(currentFile.HTMLContent);
  // }, [currentFile]);
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(fileContent);
  }, [fileContent]);
  useEffect(() => {
    if (!editor) return;
    updateObj("current", { ...fileMeta, HTMLContent: editor.getHTML() });
  }, [fileMeta]);

  /**
   * whats this useEffect for?
   */
  // useEffect(() => {
  //   if (editor && currentFile.HTMLContent !== "") {
  //     editor.commands.setContent(currentFile.HTMLContent);
  //   }
  // }, [editor, currentFile.HTMLContent]);
  // Memoize the provider value to avoid unnecessary re-renders
  const providerValue = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={providerValue}>
      <AppContext
        value={{
          fileMeta: fileMeta,
          fileContent: fileContent,
          // currentFile: currentFile,
          inlineMenuOn: inlineMenuOn,
          autoSaveOn: autoSaveOn,

          // setCurrentFile: setCurrentFile,
          setFileMeta: setFileMeta,
          setFileContent: setFileContent,
          setInlineMenuOn: setInlineMenuOn,
          setAutoSaveOn: setAutoSaveOn,
        }}
      >
        <div className="relative flex min-h-screen overflow-hidden bg-white text-neutral-900">
          <div className="flex min-w-0 flex-1 flex-col">
            <main className="max-h-[calc(100vh-40px)] flex-1 overflow-y-auto">
              <NavBar />
              <Tiptap />
              <DocumentStats />
            </main>
          </div>
        </div>
      </AppContext>
    </EditorContext.Provider>
  );
}
function DocumentStats({ lines = 0, words = 0, chars = 0 }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
      <div className="pointer-events-auto w-1/2 px-4 py-1.5 text-center text-[15px] text-neutral-500">
        {lines} lines&nbsp;&nbsp;|&nbsp;&nbsp;{words}{" "}
        words&nbsp;&nbsp;|&nbsp;&nbsp;
        {chars.toLocaleString()} chars
      </div>
    </div>
  );
}
