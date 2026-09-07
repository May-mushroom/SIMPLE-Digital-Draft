import React from "react";

function FileList({ open }) {
  return (
    <aside
      className={`
        fixed left-0 top-10 z-50
        flex min-h-screen w-[300px]
        border-r border-neutral-200 bg-white
        shadow-xl
        transform
        transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Recent */}
        <div
          className=" flex w-full items-center justify-between
            px-6 py-2 text-left"
        >
          <p className=" text-sm font-semibold uppercase tracking-wide text-neutral-400">
            Recent
          </p>
        </div>

        {/* Files */}
        <button
          className="
            flex w-full items-center justify-between
            px-6 py-2 text-left
            transition-colors
            hover:bg-neutral-100
          "
        >
          <span className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
            File
          </span>
          {/* <span className="text-2xl text-neutral-400">›</span> */}
        </button>
      </div>
    </aside>
  );
}

export default FileList;
