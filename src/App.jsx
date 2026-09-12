import { createContext, useEffect, useMemo, useState } from "react";

import { useEditor, EditorContext } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import Typography from "@tiptap/extension-typography";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Markdown } from "@tiptap/markdown";

import NavBar from "./app-shell/NavBar.jsx";
import Tiptap from "./app-shell/Tiptap.jsx";

import { debouncedAutoSave, getCurrentFileObj } from "./storage/indexedDB.js";

export const AppContext = createContext();
export default function App() {
  const [currentFile, setCurrentFile] = useState({ HTMLContent: "" });
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
    content: currentFile?.HTMLContent ?? "", // initial content
    editable: true,
    autofocus: "end",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (!autoSaveOn) return;
      debouncedAutoSave({
        ...currentFile,
        HTMLContent: editor.getHTML(),
      });
    },
  });
  useEffect(() => {
    getCurrentFileObj().then((currentFile) => {
      setCurrentFile(currentFile);
      editor.commands.setContent(currentFile.HTMLContent);
    });
  }, [editor]);
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
          currentFile: currentFile,
          inlineMenuOn: inlineMenuOn,
          autoSaveOn: autoSaveOn,

          setCurrentFile: setCurrentFile,
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
