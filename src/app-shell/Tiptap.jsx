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
    <>
      <EditorContent editor={editor} />
      <InlineMenu editor={editor} />
    </>
  );
};

export default Tiptap;
