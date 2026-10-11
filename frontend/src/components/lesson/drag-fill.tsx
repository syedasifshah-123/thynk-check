"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { playDrop, playPickup, playReturn } from "@/lib/sounds";
import type { AnswerSpec } from "@/lib/math/schema";

type FillQuestion = Pick<Extract<AnswerSpec, { type: "fill" }>, "lines" | "tiles">;

export type SlotMark = "right" | "wrong" | null;

type DragState = {
  tile: number;
  /** Slot the tile was dragged out of, or null for the tray. */
  from: number | null;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
  moved: boolean;
  overSlot: number | null;
};

type DragFillProps = {
  question: FillQuestion;
  /** Tile index placed in each slot, or null. */
  slots: (number | null)[];
  onChange: (slots: (number | null)[]) => void;
  marks: SlotMark[] | null;
  locked: boolean;
};

const DRAG_THRESHOLD = 6;

/** The drop slot under a screen point, if any. */
function slotAt(x: number, y: number) {
  const el = document.elementsFromPoint(x, y).find((node) => node instanceof HTMLElement && node.dataset.slot !== undefined);
  return el instanceof HTMLElement ? Number(el.dataset.slot) : null;
}

// Equation with drop slots + a tray of tiles. Works with mouse and touch (pointer events);
// a plain tap also works: tap a tile to drop it in the next empty slot, tap a slot to send it back.
export function DragFill({ question, slots, onChange, marks, locked }: DragFillProps) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);

  function moveTile(tile: number, from: number | null, to: number | null) {
    const next = slots.slice();
    if (from !== null) next[from] = null;
    if (to !== null) {
      const occupant = next[to];
      next[to] = tile;
      // Dropping onto a filled slot swaps the two tiles (or sends the old one back to the tray).
      if (occupant !== null && from !== null) next[from] = occupant;
    }
    onChange(next);
    if (to === null) playReturn();
    else playDrop();
  }

  function startDrag(event: React.PointerEvent<HTMLElement>, tile: number, from: number | null) {
    if (locked || event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const state: DragState = {
      tile,
      from,
      x: event.clientX,
      y: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      overSlot: null,
    };
    dragRef.current = state;
    setDrag(state);
  }

  const onMove = useEffectEvent((e: PointerEvent) => {
    const current = dragRef.current;
    if (!current) return;
    const moved = current.moved || Math.hypot(e.clientX - current.startX, e.clientY - current.startY) > DRAG_THRESHOLD;
    if (moved && !current.moved) playPickup(); // the moment a tap turns into a drag
    const next = { ...current, x: e.clientX, y: e.clientY, moved, overSlot: moved ? slotAt(e.clientX, e.clientY) : null };
    dragRef.current = next;
    setDrag(next);
  });

  const onUp = useEffectEvent((e: PointerEvent) => {
    const current = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (!current) return;
    if (!current.moved) {
      // Tap: tray → next empty slot, slot → back to tray.
      if (current.from === null) {
        const empty = slots.indexOf(null);
        if (empty !== -1) moveTile(current.tile, null, empty);
      } else {
        moveTile(current.tile, current.from, null);
      }
      return;
    }
    const target = slotAt(e.clientX, e.clientY);
    if (target !== null) moveTile(current.tile, current.from, target);
    else if (current.from !== null) moveTile(current.tile, current.from, null);
  });

  // Listen on window while a drag is active, so the pointer can leave the tile.
  const dragging = drag !== null;
  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => onMove(e);
    const up = (e: PointerEvent) => onUp(e);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging]);

  const isDragging = (tile: number) => drag?.moved && drag.tile === tile;

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8">
      {/* Equation */}
      <div className="w-full rounded-2xl border-2 border-border bg-surface px-3 py-4 shadow-[0_3px_0_var(--border)] sm:px-6 sm:py-6">
        {question.lines.map((line, i) => (
          <div key={i} className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 py-1.5 font-cofo text-lg font-medium sm:text-[1.75rem]">
            {line.map((token, j) => {
              if (typeof token === "object") {
                const placed = slots[token.slot];
                const mark = marks?.[token.slot] ?? null;
                return (
                  <span
                    key={j}
                    data-slot={token.slot}
                    className={`grid h-11 min-w-11 place-items-center rounded-xl border-2 transition-colors sm:h-12 sm:min-w-12 ${
                      mark === "right"
                        ? "border-primary bg-primary/10"
                        : mark === "wrong"
                          ? "border-amber-400 bg-amber-400/10"
                          : drag?.overSlot === token.slot
                            ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]"
                            : placed === null
                              ? "border-dashed border-border-strong"
                              : "border-transparent"
                    }`}
                  >
                    {placed !== null && !isDragging(placed) && (
                      <Tile
                        label={question.tiles[placed]}
                        locked={locked}
                        tone={mark}
                        onPointerDown={(e) => startDrag(e, placed, token.slot)}
                      />
                    )}
                  </span>
                );
              }
              const term = /^(\d*)([a-z])$/.exec(token);
              if (term) {
                // Variable term like "x" or "3s": coefficient + highlighted letter
                return (
                  <span key={j} className="inline-flex items-center gap-0.5">
                    {term[1]}
                    <span className="rounded-md bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] px-1.5 text-[var(--accent)]">{term[2]}</span>
                  </span>
                );
              }
              const word = /^[a-z]{3,}$/i.test(token);
              return (
                <span
                  key={j}
                  className={token === "(" || token === ")" ? "text-[1.15em] font-normal text-muted" : word ? "text-sm text-muted sm:text-lg" : ""}
                >
                  {token}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {/* Tray */}
      <div className="flex flex-wrap justify-center gap-2.5 rounded-2xl bg-foreground/[0.04] p-3 sm:gap-3 sm:p-4">
        {question.tiles.map((label, tile) => {
          const used = slots.includes(tile) || isDragging(tile);
          return used ? (
            <span key={tile} className="h-11 min-w-11 rounded-xl border-2 border-dashed border-border sm:h-12 sm:min-w-12" aria-hidden="true" />
          ) : (
            <Tile key={tile} label={label} locked={locked} onPointerDown={(e) => startDrag(e, tile, null)} />
          );
        })}
      </div>

      {/* Floating tile that follows the pointer */}
      {drag?.moved && (
        <div className="pointer-events-none fixed z-50" style={{ left: drag.x - drag.offsetX, top: drag.y - drag.offsetY }}>
          <Tile label={question.tiles[drag.tile]} locked={false} lifted />
        </div>
      )}
    </div>
  );
}

function Tile({
  label,
  locked,
  tone = null,
  lifted = false,
  onPointerDown,
}: {
  label: string;
  locked: boolean;
  tone?: SlotMark;
  lifted?: boolean;
  onPointerDown?: (e: React.PointerEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      disabled={locked}
      onPointerDown={onPointerDown}
      className={`grid h-11 min-w-11 touch-none select-none place-items-center rounded-xl border-2 bg-surface px-3 font-cofo text-lg font-bold transition-transform sm:h-12 sm:min-w-12 sm:text-xl ${
        tone === "right"
          ? "border-primary text-primary"
          : tone === "wrong"
            ? "border-amber-400 text-amber-500"
            : "border-border-strong text-foreground"
      } ${
        lifted
          ? "scale-110 shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
          : "shadow-[0_3px_0_var(--border-strong)] enabled:cursor-grab enabled:active:cursor-grabbing"
      }`}
    >
      {label}
    </button>
  );
}
