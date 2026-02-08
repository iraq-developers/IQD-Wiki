"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

const mdParser = new MarkdownIt();

export default function MarkdownEditorPage() {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const savedContent = localStorage.getItem("markdown-content");
    if (savedContent) {
      setValue(savedContent);
    }
  }, []);

  const handleEditorChange = ({ text }: { text: string }) => {
    setValue(text);
    localStorage.setItem("markdown-content", text);
  };

  return (
    <div className="h-screen w-full bg-white text-black" dir="rtl">
      <style jsx global>{`
        .rc-md-editor {
          border: none !important;
          height: 100vh !important;
        }
        .rc-md-editor .editor-container .section {
          padding: 10px;
        }
        .rc-md-editor .editor-container .input {
          direction: rtl;
          text-align: right;
          font-family: var(--font-tajawal), sans-serif;
        }
        .rc-md-editor .editor-container .custom-html-style {
          direction: rtl;
          text-align: right;
          font-family: var(--font-tajawal), sans-serif;
        }
        .rc-md-navigation {
          direction: ltr;
        }
        .rc-md-editor .editor-container .sec-md .input {
          overflow: auto !important;
        }
      `}</style>
      <MdEditor
        style={{ height: "100vh" }}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
        value={value}
        config={{
          view: {
            menu: true,
            md: true,
            html: true,
          },
          canView: {
            menu: true,
            md: true,
            html: true,
            both: true,
            fullScreen: true,
            hideMenu: true,
          },
        }}
      />
    </div>
  );
}
