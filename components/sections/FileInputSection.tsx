import React from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { FileInputSectionProps } from "@/lib/types";

export function FileInputSection({ onFileChange }: FileInputSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="csv-file"
        className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        UPLOAD CSV FILE
      </label>
      <div className="relative">
        <input
          id="csv-file"
          type="file"
          accept=".csv"
          onChange={(e) =>
            onFileChange(e.target.files ? e.target.files[0] : null)
          }
          className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[2px] px-4 py-2 text-white focus:outline-none focus:border-[#d946ef] text-[12px] h-[38px] w-full file:mr-4 file:py-1 file:px-3 file:rounded-[2px] file:border-0 file:text-[10px] file:uppercase file:tracking-[0.05em] file:bg-[rgba(255,255,255,0.1)] file:text-[#e5e2e1] hover:file:bg-[rgba(255,255,255,0.15)] cursor-pointer"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
      </div>
      <p
        className="text-[10px] text-[#71717a]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Upload a CSV file containing worker details for processing.
      </p>
    </div>
  );
}
