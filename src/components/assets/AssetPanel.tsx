"use client";

import React, { useState } from "react";
import { IconBrowser } from "./IconBrowser";
import { TextTool } from "./TextTool";
import { ShapePicker } from "./ShapePicker";
import { ImageUploader } from "./ImageUploader";

const TABS = ["Icons", "Text", "Shapes", "Images"] as const;
type Tab = (typeof TABS)[number];

export const AssetPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Icons");

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex shrink-0 border-b border-[var(--border)]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-2 py-2 text-[10px] font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === "Icons" && <IconBrowser />}
        {activeTab === "Text" && <TextTool />}
        {activeTab === "Shapes" && <ShapePicker />}
        {activeTab === "Images" && <ImageUploader />}
      </div>
    </div>
  );
};
