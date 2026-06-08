"use client";

import React from "react";
import { AssetPanel } from "../assets/AssetPanel";

export const LeftSidebar: React.FC = () => {
  return (
    <div className="flex w-[340px] shrink-0 flex-col border-r border-zinc-700/50 bg-zinc-800">
      <AssetPanel />
    </div>
  );
};
