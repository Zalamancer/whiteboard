"use client";

import React from "react";
import { AssetPanel } from "../assets/AssetPanel";

export const LeftSidebar: React.FC = () => {
  return (
    <div className="flex w-[250px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
      <AssetPanel />
    </div>
  );
};
