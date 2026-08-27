import React from "react";
import { ButtonGhost } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

export default function SettingBar() {
  return (
    <div id="setting-bar">
      <div id="file-setting">
        <p>File</p>
        <ButtonGhost name="Save" />
        <ButtonGhost name="Save As" />
        <ButtonGhost name="Rename" />
        <ButtonGhost name="Delete" />
        <ButtonGhost name="Download" />
        <ButtonGhost name="Pin" />
        <ButtonGhost name="Convert To JSON" />
        <ButtonGhost name="Move To Google Docs" />
      </div>
      <div id="app-setting">
        <ButtonGhost name="Clear All Local Data" />
      </div>
      <div id="view-setting">
        <Toggle>Statistics</Toggle>
        <Toggle>Scrollbar</Toggle>
        <Toggle>Auto Save</Toggle>
      </div>
    </div>
  );
}
