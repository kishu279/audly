import React from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { FileInputSectionProps } from "@/lib/types";

export function FileInputSection({ onFileChange }: FileInputSectionProps) {
  return (
    <Field>
      <FieldLabel htmlFor="csv-file">CSV File</FieldLabel>
      <Input
        id="csv-file"
        type="file"
        accept=".csv"
        onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)}
      />
      <FieldDescription>Upload a CSV file for processing.</FieldDescription>
    </Field>
  );
}
