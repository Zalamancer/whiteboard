"use client";

import React from "react";
import { PropertiesPanel } from "../properties/PropertiesPanel";

export const RightSidebar: React.FC = () => {
  return (
    <div className="flex w-[280px] shrink-0 flex-col border-l border-zinc-700/50 bg-zinc-800">
      <div className="border-b border-zinc-700/50 px-3 py-1.5">
        <h3 className="text-xs font-medium text-zinc-200">
          Properties
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        <PropertiesPanel />
      </div>
    </div>
  );
};
