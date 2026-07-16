import * as React from "react";

export const metadata = {
  title: "Cover Cropper Tool | Taanga-Taanga Admin",
};

export default function CoverCropperPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary">Cover Cropper Tool</h1>
          <p className="text-muted-foreground mt-1">
            Extract front covers from full print wrappers to use on the website.
          </p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[800px] border border-border rounded-lg overflow-hidden bg-white shadow-sm">
        <iframe 
          src="/crop-tool.html" 
          title="Cover Cropper Tool"
          className="w-full h-full border-0"
          style={{ minHeight: '800px' }}
        />
      </div>
    </div>
  );
}
