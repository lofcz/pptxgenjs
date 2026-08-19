/**
 * Rendering context for pptxgenjsx.
 *
 * Uses `AsyncLocalStorage` stored via `globalThis[Symbol.for()]` to
 * share context across module instances **and** preserve concurrency
 * safety.
 *
 * ### Why not module-level `AsyncLocalStorage`?
 *
 * When the package is symlinked (e.g. `npm link` during local
 * development), the consumer and the library can resolve to **different
 * copies** of this module.  A module-level `AsyncLocalStorage` would be
 * duplicated — context written by one copy would be invisible to the
 * other.
 *
 * By storing the `AsyncLocalStorage` instance on `globalThis` via a
 * `Symbol.for()` key, all copies share the same underlying store,
 * solving the dual-instance problem.
 *
 * ### Why not plain `globalThis` variables?
 *
 * Plain global variables (`globalThis[key] = value`) are not
 * concurrency-safe — two async rendering processes would overwrite each
 * other's context.  `AsyncLocalStorage` uses Node.js's `AsyncHook` to
 * isolate context per async call chain, making it safe for concurrent
 * usage (e.g. in an HTTP server).
 *
 * @module context
 */

import { AsyncLocalStorage } from "node:async_hooks";

// ════════════════════════════════════════════════════════════════════
// INTERNAL GLOBAL KEY
// ════════════════════════════════════════════════════════════════════

function getGlobalAls<T>(key: symbol): AsyncLocalStorage<T> {
  let als = (globalThis as any)[key] as AsyncLocalStorage<T> | undefined;
  if (!als) {
    als = new AsyncLocalStorage<T>();
    (globalThis as any)[key] = als;
  }
  return als;
}

function getDeckAls(): AsyncLocalStorage<DeckContextInfo> {
  return getGlobalAls(Symbol.for("pptxgenjsx:deckAls"));
}
function getSlideAls(): AsyncLocalStorage<SlideContextInfo> {
  return getGlobalAls(Symbol.for("pptxgenjsx:slideAls"));
}
function getGroupAls(): AsyncLocalStorage<GroupContextInfo> {
  return getGlobalAls(Symbol.for("pptxgenjsx:groupAls"));
}

// ════════════════════════════════════════════════════════════════════
// PUBLIC TYPES
// ════════════════════════════════════════════════════════════════════

/** Deck-level metadata accessible via {@link useDeckContext}. */
export interface DeckContextInfo {
  /** Slide width in inches (set by the presentation layout). */
  readonly width: number;
  /** Slide height in inches (set by the presentation layout). */
  readonly height: number;
}

/** Group-level metadata accessible via {@link useGroupContext}.
 *
 * `x` and `y` are absolute (accumulated from nested parent groups).
 * When called outside a `<Group>`, falls back to the deck's dimensions
 * with `x = 0, y = 0`. */
export interface GroupContextInfo {
  /** Absolute x offset (accumulated from all parent groups). */
  readonly x: number;
  /** Absolute y offset (accumulated from all parent groups). */
  readonly y: number;
  /** Virtual canvas width of the current group (or deck width when outside a group). */
  readonly width: number;
  /** Virtual canvas height of the current group (or deck height when outside a group). */
  readonly height: number;
}

/** Slide-level metadata accessible via {@link useSlideContext}. */
export interface SlideContextInfo {
  /** 1-based slide index within the entire presentation. */
  readonly index: number;
  /** Total number of slides in the presentation. */
  readonly total: number;
  /** Title of the section this slide belongs to, if any. */
  readonly sectionTitle?: string;
}

// ════════════════════════════════════════════════════════════════════
// PUBLIC API
// ════════════════════════════════════════════════════════════════════

/**
 * Retrieve the current deck's context information (width, height).
 *
 * Must be called **during rendering** — i.e., inside a component factory
 * mounted via `<Slide component={...} />` or within any synchronous
 * function called by such a factory.
 *
 * @returns The {@link DeckContextInfo} for the current presentation.
 * @throws if called outside a rendering context.
 */
export function useDeckContext(): DeckContextInfo {
  const ctx = getDeckAls().getStore();
  if (!ctx) {
    throw new Error(
      "useDeckContext() can only be called during slide rendering.\n" +
        "Ensure you are inside a component factory invoked via <Slide component={...} />.",
    );
  }
  return ctx;
}

/**
 * Retrieve the current slide's context information (index, total, sectionTitle).
 *
 * Must be called **during rendering** — i.e., inside a component factory
 * mounted via `<Slide component={...} />` or within any synchronous
 * function called by such a factory.
 *
 * @returns The {@link SlideContextInfo} for the currently rendering slide.
 * @throws if called outside a rendering context.
 *
 * @example
 * ```tsx
 * // slides/title-slide.tsx
 * export default function TitleSlide() {
 *   const { index, total } = useSlideContext();
 *   return (
 *     <Text x={1} y={1} w={10}>
 *       Slide {index} of {total}
 *     </Text>
 *   );
 * }
 * ```
 */
export function useSlideContext(): SlideContextInfo {
  const ctx = getSlideAls().getStore();
  if (!ctx) {
    throw new Error(
      "useSlideContext() can only be called during slide rendering.\n" +
        "Ensure you are inside a component factory invoked via <Slide component={...} />.",
    );
  }
  return ctx;
}

/**
 * Retrieve the current group's context information (absolute x, y and group width, height).
 *
 * When called **outside** a `<Group>` (i.e., directly inside a `<Slide>`),
 * returns the deck's dimensions with `x = 0, y = 0` — so offset behaviour
 * is a no-op and `width` / `height` still reflect the slide canvas.
 *
 * Must be called during rendering — i.e., inside a component factory
 * mounted via `<Slide component={...} />` or within any synchronous
 * function called by such a factory.
 *
 * @returns The {@link GroupContextInfo} for the current group (or deck fallback).
 * @throws if called outside any rendering context.
 *
 * @example
 * ```tsx
 * export default function ProgressBar() {
 *   const { width } = useGroupContext();
 *   return <Rect x={0} y={0} w={width * 0.7} h={0.5} fill="blue" />;
 * }
 * ```
 */
export function useGroupContext(): GroupContextInfo {
  const ctx = getGroupAls().getStore();
  if (ctx) return ctx;
  // Outside any group — use deck dimensions as the virtual canvas
  const deck = useDeckContext();
  return { x: 0, y: 0, width: deck.width, height: deck.height };
}

// ════════════════════════════════════════════════════════════════════
// INTERNAL — used by render.ts only
// ════════════════════════════════════════════════════════════════════

/**
 * @internal
 * Run a function within a deck-level rendering context.
 * Uses `AsyncLocalStorage.run()` to preserve context across async
 * boundaries while maintaining concurrency safety.
 *
 * The return type uses `Awaited<T>` to flatten nested Promises that
 * arise when the callback is async (which is always the case in our
 * rendering pipeline).
 */
export function withDeckContext<T>(info: DeckContextInfo, fn: () => T): Promise<Awaited<T>> {
  return getDeckAls().run(info, fn) as Promise<Awaited<T>>;
}

/**
 * @internal
 * Run a function within a slide-level rendering context.
 * Uses `AsyncLocalStorage.run()` to preserve context across async
 * boundaries while maintaining concurrency safety.
 */
export function withSlideContext<T>(info: SlideContextInfo, fn: () => T): Promise<Awaited<T>> {
  return getSlideAls().run(info, fn) as Promise<Awaited<T>>;
}

/**
 * @internal
 * Run a function within a group-level rendering context.
 * Uses `AsyncLocalStorage.run()` to preserve context across async
 * boundaries while maintaining concurrency safety.
 */
export function withGroupContext<T>(info: GroupContextInfo, fn: () => T): Promise<Awaited<T>> {
  return getGroupAls().run(info, fn) as Promise<Awaited<T>>;
}
