import { useEffect, useMemo, useState } from "react";

import { useEditor, EditorContext } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import Typography from "@tiptap/extension-typography";
import { TaskItem, TaskList } from "@tiptap/extension-list";

import NavBar from "./app-shell/NavBar.jsx";
import FileList from "./app-shell/FileList.jsx";
import Tiptap from "./app-shell/Tiptap.jsx";

import {
  debouncedAutoSave,
  getInitialFileObject,
} from "./storage/indexedDB.js";

export default function App() {
  const [currentFile, setCurrentFile] = useState({ HTMLContent: "" });

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
    ],
    content: currentFile?.HTMLContent ?? "", // initial content
    autofocus: "end",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      debouncedAutoSave({
        ...currentFile,
        HTMLContent: editor.getHTML(),
      });
    },
  });
  useEffect(() => {
    getInitialFileObject().then((currentFile) => {
      setCurrentFile(currentFile);
    });
  }, []);
  useEffect(() => {
    if (editor && currentFile.HTMLContent !== "") {
      editor.commands.setContent(currentFile.HTMLContent);
    }
  }, [editor, currentFile]);

  // Memoize the provider value to avoid unnecessary re-renders
  const providerValue = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={providerValue}>
      <div className="flex min-h-screen overflow-hidden bg-white text-neutral-900">
        <div className="flex min-w-0 flex-1 flex-col">
          <NavBar />
          <main className="max-h-[calc(100vh-40px)] flex-1 overflow-y-auto">
            <Tiptap />
          </main>
        </div>
      </div>
    </EditorContext.Provider>
  );
}
