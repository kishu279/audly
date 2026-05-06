"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown, MoreVertical } from "lucide-react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { workerNodes, WorkerNode, WorkerStatus } from "./mockData";

type FilterStatus = "ALL" | WorkerStatus;

const STATUS_FILTERS: FilterStatus[] = ["ALL", "PAID", "PENDING"];

function StatusBadge({ status }: { status: WorkerStatus }) {
  const isPaid = status === "PAID";
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-[4px] h-[4px] rounded-full shrink-0"
        style={{
          background: isPaid ? "#10b981" : "#f59e0b",
          boxShadow: isPaid
            ? "0 0 5px rgba(16,185,129,0.5)"
            : "0 0 5px rgba(245,158,11,0.5)",
        }}
      />
      <span
        className="text-[10px] uppercase"
        style={{
          color: isPaid ? "#10b981" : "#f59e0b",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {status}
      </span>
    </div>
  );
}

function ActionButtons({ worker }: { worker: WorkerNode }) {
  const isPaid = worker.status === "PAID";
  return (
    <div className="flex items-center gap-3">
      {isPaid ? (
        <button
          className="text-[10px] uppercase px-2 py-1 rounded-sm border border-white/10 hover:border-white/25 transition-colors"
          style={{ color: "#d4d4d8", fontFamily: "'Inter', sans-serif" }}
        >
          SPLIT
        </button>
      ) : (
        <button
          className="text-[10px] uppercase px-2 py-1 rounded-sm text-white hover:opacity-90 transition-opacity"
          style={{
            background: "linear-gradient(107.77deg, #FF571A 0%, #FD25EA 100%)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          PAY
        </button>
      )}
      <button
        className="text-[10px] uppercase hover:text-zinc-200 transition-colors"
        style={{ color: "#d4d4d8", fontFamily: "'Inter', sans-serif" }}
      >
        EDIT
      </button>
      <button
        className="text-zinc-600 hover:text-zinc-400 transition-colors"
        aria-label="More actions"
      >
        <MoreVertical className="w-[14px] h-[14px]" />
      </button>
    </div>
  );
}

export function ResourceTable() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered =
    filterStatus === "ALL"
      ? workerNodes
      : workerNodes.filter((w) => w.status === filterStatus);

  return (
    <div
      className="flex flex-col rounded-sm border"
      style={{ background: "#121212", borderColor: "rgba(255,255,255,0.08)" }}
    >
      {/* Table header row */}
      <div
        className="flex items-center justify-between px-6 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex flex-col gap-1">
          <span
            className="text-[16px] leading-tight"
            style={{
              color: "#e5e2e1",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Resource Allocation
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.1em]"
            style={{ color: "#71717a", fontFamily: "'Inter', sans-serif" }}
          >
            ACTIVE WORKER DISTRIBUTION
          </span>
        </div>

        {/* Status filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-sm border text-[10px] uppercase hover:border-white/20 transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.10)",
              color: "#d4d4d8",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <SlidersHorizontal
              className="w-[10px] h-[7px]"
              style={{ color: "#6b7280" }}
            />
            STATUS: {filterStatus}
            <ChevronDown
              className="w-[10px] h-[8px]"
              style={{ color: "#6b7280" }}
            />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-36 rounded-sm border z-50"
              style={{
                background: "#1a1a1d",
                borderColor: "rgba(255,255,255,0.10)",
              }}
            >
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[10px] uppercase hover:bg-white/5 transition-colors"
                  style={{
                    color: filterStatus === status ? "#d946ef" : "#d4d4d8",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {status === "ALL" ? "STATUS: ALL" : status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow
            className="border-b hover:bg-transparent"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            {[
              "WORKER NODE",
              "ROLE",
              "ALLOCATION" /*, "STATUS", "ACTIONS" */,
            ].map((col) => (
              <TableHead
                key={col}
                className="text-[10px] uppercase tracking-[0.1em] font-bold h-12 px-6"
                style={{ color: "#71717a", fontFamily: "'Inter', sans-serif" }}
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered.map((worker) => (
            <TableRow
              key={worker.initials}
              className="border-b hover:bg-white/[0.02] transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              {/* Worker node */}
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-sm shrink-0 flex items-center justify-center text-[10px] font-medium"
                    style={{
                      background: worker.initialsColor,
                      color: "#e879f9",
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    {worker.initials}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-[14px] font-medium leading-tight"
                      style={{
                        color: "#e4e4e7",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {worker.name}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{
                        color: "#71717a",
                        fontFamily: "'Courier New', monospace",
                      }}
                    >
                      {worker.address}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* Role */}
              <TableCell className="px-6 py-4">
                <span
                  className="text-[12px] uppercase px-2 py-1 rounded-sm border"
                  style={{
                    color: "#a1a1aa",
                    borderColor: "rgba(255,255,255,0.12)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {worker.role}
                </span>
              </TableCell>

              {/* Allocation */}
              <TableCell className="px-6 py-4">
                <span
                  className="text-[14px]"
                  style={{
                    color: "#e5e2e1",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {worker.allocation}
                </span>
              </TableCell>

              {/* Status */}
              {/* <TableCell className="px-6 py-4">
                <StatusBadge status={worker.status} />
              </TableCell> */}

              {/* Actions */}
              {/* <TableCell className="px-6 py-4">
                <ActionButtons worker={worker} />
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination footer */}
      <div
        className="flex items-center justify-between px-6 py-3 border-t"
        style={{
          borderColor: "rgba(255,255,255,0.05)",
          background: "rgba(24,24,27,0.20)",
        }}
      >
        <span
          className="text-[10px] uppercase"
          style={{ color: "#52525b", fontFamily: "'Courier New', monospace" }}
        >
          SHOWING {filtered.length} OF 128 ACTIVE NODES
        </span>
        <div className="flex items-center gap-4">
          <button
            className="text-[10px] hover:text-zinc-300 transition-colors"
            style={{ color: "#52525b", fontFamily: "'Courier New', monospace" }}
          >
            Previous
          </button>
          <button
            className="text-[10px] hover:text-zinc-300 transition-colors"
            style={{ color: "#52525b", fontFamily: "'Courier New', monospace" }}
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
}
