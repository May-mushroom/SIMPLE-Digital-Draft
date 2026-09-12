// src/Tiptap.tsx
import React from "react";
import { EditorContent, useCurrentEditor } from "@tiptap/react";

import InlineMenu from "./InlineMenu";

const Tiptap = ({ inlineMenuOn }) => {
  const { editor } = useCurrentEditor();

  return (
    <main className="min-h-[calc(100vh-3.5rem)] pt-20">
      <div className="mx-auto max-w-4xl px-8 py-4">
        <EditorContent
          editor={editor}
          className="min-h-[calc(100vh-5rem)] px-8 py-3 text-lg leading-8 outline-none"
        />

        {inlineMenuOn && <InlineMenu />}
      </div>
    </main>
  );
};

export default Tiptap;
