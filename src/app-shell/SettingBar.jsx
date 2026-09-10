import React from "react";
import {
  Save,
  PencilLine,
  Trash2,
  Download,
  Star,
  Braces,
  FileInput,
  MopSparkles,
  ALargeSmall,
  MouseLeft,
  RemoveFormatting,
} from "lucide-react";
const BTN_NAMES = {
  FILE: [
    { name: "Save", icon: <Save size={16} /> },
    { name: "Save As", icon: <Save size={16} /> },
    { name: "Rename", icon: <PencilLine size={16} /> },
    { name: "Delete", icon: <Trash2 size={16} /> },
    { name: "Download", icon: <Download size={16} /> },
    { name: "Pin", icon: <Star size={16} /> },
    { name: "Convert To JSON", icon: <Braces size={16} /> },
    { name: "Move To Google Docs", icon: <FileInput size={16} /> },
  ],
  APP: [{ name: "Clear All Local Data", icon: <MopSparkles size={16} /> }],
  VIEW: [
    { name: "Statistics", icon: <ALargeSmall size={16} /> },
    { name: "Scrollbar", icon: <MouseLeft size={16} /> },
    { name: "Auto Save", icon: <Save size={16} /> },
    { name: "Auto Inline Tool Bar", icon: <RemoveFormatting size={16} /> },
  ],
};
export default function SettingBar() {
  const fileBtns = BTN_NAMES.FILE.map(({ name, icon }) => (
    <MenuItem icon={icon}>{name}</MenuItem>
  ));
  const appBtns = BTN_NAMES.APP.map(({ name, icon }) => (
    <MenuItem icon={icon}>{name}</MenuItem>
  ));
  const viewBtns = BTN_NAMES.VIEW.map(({ name, icon }) => (
    <MenuItem icon={icon}>{name}</MenuItem>
  ));

  return (
    <div className="absolute right-10 top-[52px] z-50 w-[250px] rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
      {/* File */}
      <section>
        <h3 className="mb-2 px-2 text-sm font-semibold text-neutral-400">
          File
        </h3>
        {fileBtns}
      </section>

      {/* App */}
      <section className="mt-3">
        <h3 className="mb-2 px-2 text-sm font-semibold text-neutral-400">
          App
        </h3>
        {appBtns}
      </section>

      {/* View & Settings */}
      <section className="mt-3">
        <h3 className="mb-2 px-2 text-sm font-semibold text-neutral-400">
          View & Settings
        </h3>
        {viewBtns}
      </section>
    </div>
  );
}
function MenuItem({ icon, children, danger = false }) {
  return (
    <button
      className={`flex w-full items-center gap-4 rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-neutral-800 hover:bg-neutral-100"
      }`}
    >
      <span className="w-5 shrink-0">{icon}</span>

      <span>{children}</span>
    </button>
  );
}
