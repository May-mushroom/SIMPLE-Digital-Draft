import React from "react";
import SettingBar from "./SettingBar";
import { ButtonGhost } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// replace button name with icon later
function NavBar() {
  return (
    <div id="nav-bar">
      <ButtonGhost name="show-file" />
      <ButtonGhost name="new-file" />
      <ButtonGhost name="open-file" />
      <Badge>Status</Badge>
      <Badge>Name</Badge>
      <ButtonGhost name="open-setting-bar" />
    </div>
  );
}

export default NavBar;
