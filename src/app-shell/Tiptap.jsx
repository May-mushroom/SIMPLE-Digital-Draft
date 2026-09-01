// src/Tiptap.tsx
import React from "react";

import { Placeholder } from "@tiptap/extensions";
import Typography from "@tiptap/extension-typography";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import InlineMenu from "./InlineMenu";

const Tiptap = () => {
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
    ], // define your extension array
    content: "<p>hello</p>", // initial content
    autofocus: "end",
  });

  return (
    <main className="min-h-[calc(100vh-3.5rem)] pt-6">
      <div className="mx-auto max-w-4xl px-8 py-4">
        <EditorContent
          editor={editor}
          className="min-h-[calc(100vh-5rem)] px-8 py-3 text-lg leading-8 outline-none"
        />

        <InlineMenu editor={editor} />
      </div>
    </main>
  );
};

export default Tiptap;
