"use client";

import React, { useState } from "react";
import { IconBrowser } from "./IconBrowser";
import { TextTool } from "./TextTool";
import { ShapePicker } from "./ShapePicker";
import { ImageUploader } from "./ImageUploader";
import { TemplateBrowser } from "../templates/TemplateBrowser";

const TABS = ["Icons", "Text", "Shapes", "Images", "Templates"] as const;
type Tab = (typeof TABS)[number];

export const AssetPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Icons");

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex shrink-0 gap-0.5 border-b border-zinc-700/50 px-2 py-1.5">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-2 py-1 text-[10px] font-medium transition-colors ${
              activeTab === tab
                ? "bg-green-500 text-white"
                : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === "Icons" && <IconBrowser />}
        {activeTab === "Text" && <TextTool />}
        {activeTab === "Shapes" && <ShapePicker />}
        {activeTab === "Images" && <ImageUploader />}
        {activeTab === "Templates" && <TemplateBrowser />}
      </div>
    </div>
  );
};
