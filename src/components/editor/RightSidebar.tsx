"use client";

import React from "react";
import { PropertiesPanel } from "../properties/PropertiesPanel";

export const RightSidebar: React.FC = () => {
  return (
    <div className="flex w-[280px] shrink-0 flex-col border-l border-[var(--border)] bg-[var(--surface)]">
      <div className="border-b border-[var(--border)] px-3 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Properties
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        <PropertiesPanel />
      </div>
    </div>
  );
};
