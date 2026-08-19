/**
 * Rendering engine for pptxgenjsx.
 *
 * All tree-traversal functions are async to support PptxNodePromise resolution.
 * Component factories and type definitions are in `./components.ts`.
 */

import PptxGenJS from "pptxgenjs-plus";
import type PptxGenJSType from "pptxgenjs-plus";

import {
  type PptxNode,
  type PptxElement,
  type PptxPresentation,
  type PptxSlide,
  type PptxChild,
  assertLeafHasNoChildren,
  isLeafNodeType,
  isPptxNode,
  resolveChild,
} from "./node.js";

import {
  type SlideContextInfo,
  type DeckContextInfo,
  type GroupContextInfo,
  useGroupContext,
  withDeckContext,
  withSlideContext,
  withGroupContext,
} from "./context.js";

// ════════════════════════════════════════════════════════════════════
// RENDERING ENGINE
// ════════════════════════════════════════════════════════════════════

// ── EMU (English Metric Unit) ─────────────────────────────
// OOXML uses EMU as its base unit. PptxGenJS stores presLayout
// dimensions in EMU. 1 inch = 914400 EMU.
const EMU_PER_INCH = 914400;

// ── Reserved prop keys (not passed to pptxgenjs) ─────────────────

const RESERVED_PROPS = new Set([
  "children",
  "options",
  "text",
  "runs",
  "data",
  "rows",
  "cells",
  "eleId",
  "render",
  "component",
]);

// ── Shape type sets ───────────────────────────────────────────────

const CHART_TYPES = new Set([
  "Chart",
  "AreaChart",
  "BarChart",
  "Bar3DChart",
  "BubbleChart",
  "DoughnutChart",
  "LineChart",
  "PieChart",
  "RadarChart",
  "ScatterChart",
]);

const SHAPE_TYPES = new Set([
  "Shape",
  "Rect",
  "RoundRect",
  "Ellipse",
  "Oval",
  "Triangle",
  "RightTriangle",
  "Diamond",
  "Pentagon",
  "Hexagon",
  "Star",
  "Star4",
  "Star5",
  "Star6",
  "Star8",
  "Star10",
  "Arc",
  "BlockArc",
  "PieShape",
  "CustomGeometry",
  "LeftArrow",
  "RightArrow",
  "UpArrow",
  "DownArrow",
  "LeftRightArrow",
  "UpDownArrow",
  "Chevron",
  "Cloud",
  "Heart",
  "Donut",
  "Plus",
]);

// ── Public API ────────────────────────────────────────────────────

export interface CreatePptxOptions {
  /** Reuse an existing PptxGenJS instance instead of creating a new one. */
  pptx?: PptxGenJSType;
}

export type RenderPptxOptions = PptxGenJSType.WriteFileProps & CreatePptxOptions;
export type WritePptxOptions = PptxGenJSType.WriteProps & CreatePptxOptions;

/**
 * Create a PptxGenJS instance from a Deck or Slide node tree.
 * Resolves any PptxNodePromise wrappers during traversal.
 */
export async function createPptx(
  root: PptxElement,
  options: CreatePptxOptions = {},
): Promise<PptxGenJSType> {
  const node = await resolveChild(root);
  const pptx = options.pptx ?? new PptxGenJS();

  if (node.type === "Deck") {
    applyDeckProps(pptx, node.props as any);

    const total = await countDeckSlides(node);

    const width = pptx.presLayout.width / EMU_PER_INCH;
    const height = pptx.presLayout.height / EMU_PER_INCH;

    const ctx: SlideRenderContext = {
      pptx,
      slideIndex: 0,
      total,
      width,
      height,
    };

    const deckCtx: DeckContextInfo = { width, height };

    await withDeckContext(deckCtx, () => processDeckChildren(node, ctx));
    return pptx;
  }

  if (node.type === "Slide") {
    const width = pptx.presLayout.width / EMU_PER_INCH;
    const height = pptx.presLayout.height / EMU_PER_INCH;

    const ctx: SlideRenderContext = {
      pptx,
      slideIndex: 0,
      total: 1,
      width,
      height,
    };

    const deckCtx: DeckContextInfo = { width, height };

    await withDeckContext(deckCtx, () => processSlide(node, ctx));
    return pptx;
  }

  throw new Error(`createPptx expected a Deck or Slide root, got ${node.type}.`);
}

// ── Slide counting ────────────────────────────────────────────────

/** Count all `<Slide>` nodes in the node tree recursively.
 *
 * Must resolve PptxNodePromise wrappers since all non-string component
 * factories are deferred (lazy-evaluated during tree traversal).
 * Structural factories (Slide, Fragment, etc.) do not need rendering
 * context, so resolving them here is safe.
 */
async function countDeckSlides(node: PptxNode): Promise<number> {
  if (node.type === "Slide") return 1;

  let count = 0;
  for (const rawChild of node.children) {
    if (isPptxNode(rawChild)) {
      count += await countDeckSlides(rawChild);
    }
    // ── handle PptxNodePromise ────────────────────────────────────
    // Since all non-string component factories now return PptxNodePromise
    // (deferred execution), Slide/Fragment/Raw wrappers at the Deck level
    // are PptxNodePromise instances and must be resolved to count slides.
    else {
      const child = await resolveChild(rawChild);
      if (isPptxNode(child)) {
        count += await countDeckSlides(child);
      }
    }
  }
  return count;
}

/**
 * Render to a .pptx file.
 * Returns the file name (as per PptxGenJS.writeFile).
 */
export async function renderPptx(
  root: PptxElement,
  options: RenderPptxOptions = {},
): Promise<string> {
  const { pptx, ...writeOptions } = options;
  const instance = await createPptx(root, { pptx });
  return instance.writeFile(writeOptions);
}

/**
 * Write to a buffer / ArrayBuffer / Blob.
 */
export async function writePptx(
  root: PptxElement,
  options: WritePptxOptions = {},
): Promise<string | ArrayBuffer | Blob | Uint8Array> {
  const { pptx, ...writeOptions } = options;
  const instance = await createPptx(root, { pptx });
  return instance.write(writeOptions);
}

/** Alias for renderPptx. */
export const render = renderPptx;
/** Alias for writePptx. */
export const write = writePptx;

// ── Deck props ────────────────────────────────────────────────────

function applyDeckProps(pptx: PptxPresentation, props: Record<string, any>): void {
  const {
    layouts,
    sections,
    masters,
    layout,
    title,
    author,
    company,
    subject,
    revision,
    rtlMode,
    theme,
  } = props;

  layouts?.forEach((l: any) => pptx.defineLayout(l));
  sections?.forEach((s: any) => pptx.addSection(s));
  masters?.forEach((m: any) => pptx.defineSlideMaster(m));

  if (typeof layout === "string") {
    pptx.layout = layout;
  } else if (layout) {
    pptx.defineLayout(layout);
    pptx.layout = layout.name;
  }

  setIfDefined(pptx, "title", title);
  setIfDefined(pptx, "author", author);
  setIfDefined(pptx, "company", company);
  setIfDefined(pptx, "subject", subject);
  setIfDefined(pptx, "revision", revision);
  setIfDefined(pptx, "rtlMode", rtlMode);
  setIfDefined(pptx, "theme", theme);
}

// ── Deck children traversal (async) ───────────────────────────────

/** Internal rendering context that carries slide counting state. */
interface SlideRenderContext {
  pptx: PptxPresentation;
  slideIndex: number;
  total: number;
  width: number;
  height: number;
}

async function processDeckChildren(node: PptxNode, ctx: SlideRenderContext): Promise<void> {
  for (const rawChild of node.children) {
    const child = await resolveChild(rawChild);
    if (!isPptxNode(child)) continue;

    // Leaf components (Layout, TableToSlides) at deck level must not carry
    // children either — fail loudly instead of silently ignoring them.
    assertLeafHasNoChildren(child.type, child.children);

    switch (child.type) {
      case "Layout":
        ctx.pptx.defineLayout(child.props as any);
        break;
      case "Master":
        ctx.pptx.defineSlideMaster(buildMaster(child) as any);
        break;
      case "Section":
        await processSection(child, ctx);
        break;
      case "Slide":
        await processSlide(child, ctx);
        break;
      case "TableToSlides":
        processTableToSlides(child, ctx);
        break;
      case "Raw":
        (child.props as any).render({ pptx: ctx.pptx, node: child });
        break;
      case "Fragment":
        await processDeckChildren(child, ctx);
        break;
      default:
        throw new Error(`${child.type} must be inside a Slide, Section, or Master.`);
    }
  }
}

// ── Section ───────────────────────────────────────────────────────

async function processSection(node: PptxNode, ctx: SlideRenderContext): Promise<void> {
  const props = node.props as any;
  ctx.pptx.addSection({ title: props.title, order: props.order });

  for (const rawChild of node.children) {
    const child = await resolveChild(rawChild);
    if (!isPptxNode(child)) continue;

    if (child.type !== "Slide") {
      throw new Error(`Section children must be Slide nodes. Got ${child.type}.`);
    }
    await processSlide(child, ctx, props.title);
  }
}

// ── Slide ─────────────────────────────────────────────────────────

async function processSlide(
  node: PptxNode,
  ctx: SlideRenderContext,
  sectionTitle?: string,
): Promise<void> {
  const props = node.props as any;

  // Increment and capture the 1-based slide index
  ctx.slideIndex += 1;
  const index = ctx.slideIndex;
  const total = ctx.total;

  const resolvedSectionTitle = props.sectionTitle ?? sectionTitle;

  const slide = ctx.pptx.addSlide({
    masterName: props.masterName,
    sectionTitle: resolvedSectionTitle,
  });

  setIfDefined(slide, "background", props.background);
  setIfDefined(slide, "color", props.color);
  setIfDefined(slide, "hidden", props.hidden);
  setIfDefined(slide, "slideNumber", props.slideNumber);

  const slideCtx: SlideContextInfo = {
    index,
    total,
    sectionTitle: resolvedSectionTitle,
  };

  // ── Lazy `component` prop — like React Router's `component={() => import('./path')}` ──
  if (props.component) {
    const module = await props.component();
    const LazyComponent = module.default;

    // IMPORTANT: Both the factory call AND rendering must happen inside
    // withSlideContext so that useSlideContext() / useDeckContext() /
    // useGroupContext() have access to the rendering context throughout
    // the entire slide content evaluation and rendering pipeline.
    await withSlideContext(slideCtx, async () => {
      const lazyNode = await resolveChild(LazyComponent({}));
      await renderSlideElement(lazyNode, { pptx: ctx.pptx, slide });
    });
    return;
  }

  // ── Direct children ──
  // All non-string component factories are now deferred via PptxNodePromise
  // thunks.  resolveChild() calls the thunk synchronously, inside the
  // withSlideContext scope, so useSlideContext() / useDeckContext() /
  // useGroupContext() work correctly.
  await withSlideContext(slideCtx, async () => {
    for (const rawChild of node.children) {
      const child = await resolveChild(rawChild);
      if (!isPptxNode(child)) continue;
      await renderSlideElement(child, { pptx: ctx.pptx, slide });
    }
  });
}

// ── Slide element rendering ───────────────────────────────────────

async function renderSlideElement(
  node: PptxNode,
  ctx: { pptx: PptxPresentation; slide: PptxSlide },
): Promise<void> {
  const { slide } = ctx;
  assertLeafHasNoChildren(node.type, node.children);

  if (CHART_TYPES.has(node.type)) {
    renderChart(node, slide);
    return;
  }

  if (SHAPE_TYPES.has(node.type)) {
    renderShape(node, slide);
    return;
  }

  switch (node.type) {
    case "Text":
      await renderText(node, slide);
      break;
    case "Line":
      renderLine(node, slide);
      break;
    case "LineBetween":
      renderLineBetween(node, slide);
      break;
    case "Image":
      renderImage(node, slide);
      break;
    case "Media":
      renderMedia(node, slide);
      break;
    case "Table":
      await renderTable(node, slide);
      break;
    case "Notes":
      slide.addNotes(getTextContent(node, (node.props as any).text));
      break;
    case "Raw":
      (node.props as any).render({ pptx: ctx.pptx, slide, node });
      break;
    case "Group": {
      const props = node.props as any;
      const parentGroup = useGroupContext(); // deck fallback when not inside another group
      const absX = resolveCoord(props.x, parentGroup.width, 0) + parentGroup.x;
      const absY = resolveCoord(props.y, parentGroup.height, 0) + parentGroup.y;
      const grpW = resolveCoord(props.w, parentGroup.width, parentGroup.width);
      const grpH = resolveCoord(props.h, parentGroup.height, parentGroup.height);

      const groupInfo: GroupContextInfo = { x: absX, y: absY, width: grpW, height: grpH };

      await withGroupContext(groupInfo, async () => {
        for (const rawChild of node.children) {
          const child = await resolveChild(rawChild);
          if (isPptxNode(child)) {
            await renderSlideElement(child, ctx);
          }
        }
      });
      break;
    }
    case "Fragment":
      for (const rawChild of node.children) {
        const child = await resolveChild(rawChild);
        if (isPptxNode(child)) {
          await renderSlideElement(child, ctx);
        }
      }
      break;
    default:
      throw new Error(`${node.type} cannot be rendered directly on a slide.`);
  }
}

// ── Coordinate helpers ─────────────────────────────────────────────

/**
 * Resolve a pptxgenjs Coord (number or `${number}%`) to an absolute
 * number using a reference dimension (e.g. group width for x / w,
 * group height for y / h).
 *
 * - `5`       → 5
 * - `"50%"`   → `0.5 * reference`
 * - `undefined` / `null` → `fallback` (default 0)
 */
function resolveCoord(
  value: number | `${number}%` | undefined | null,
  reference: number,
  fallback: number = 0,
): number {
  if (value == null) return fallback;
  if (typeof value === "number") return value;
  // `${number}%` — e.g. "50%"
  const pct = parseFloat(value);
  if (isNaN(pct)) return fallback;
  if (!isFinite(pct)) return fallback;
  return (pct / 100) * reference;
}

/**
 * Apply the current group's absolute x/y offset to an element's props.
 * Percentage-based Coord values (e.g. `"50%"`) are resolved relative to
 * the group's virtual canvas **before** adding the group offset.
 * When no group is active (i.e., direct slide children), returns the
 * props unchanged — percentages pass through to pptxgenjs natively.
 */
function offsetXY<T extends Record<string, any>>(props: T): T {
  const { x: groupX, y: groupY, width: grpW, height: grpH } = useGroupContext();
  if (
    groupX === 0 &&
    groupY === 0 &&
    typeof props.x !== "string" &&
    typeof props.y !== "string" &&
    typeof props.w !== "string" &&
    typeof props.h !== "string"
  ) {
    return { ...props };
  }
  const resolvedX = resolveCoord(props.x, grpW, 0);
  const resolvedY = resolveCoord(props.y, grpH, 0);
  const resolvedW = resolveCoord(props.w, grpW, props.w);
  const resolvedH = resolveCoord(props.h, grpH, props.h);
  return { ...props, x: resolvedX + groupX, y: resolvedY + groupY, w: resolvedW, h: resolvedH };
}

// ── Individual element renderers ──────────────────────────────────

async function renderText(node: PptxNode, slide: PptxSlide): Promise<void> {
  const props = offsetXY(node.props as any);
  const content = await resolveTextContent(node, props);
  slide.addText(content, mergeOptions(props.options, props));
}

/**
 * Resolve the text content for a `<Text>` node following the documented
 * input priority:
 *
 * 1. child `<TextRun />` nodes (normalized into pptxgenjs `TextProps[]`)
 * 2. the `runs` prop (rich text array)
 * 3. the `text` prop
 * 4. plain-string children
 *
 * Mixing multiple modes drops the lower-priority content by design —
 * prefer a single input mode per `<Text>`.
 */
async function resolveTextContent(node: PptxNode, props: Record<string, any>): Promise<string | any[]> {
  const textRuns = await collectTextRuns(node);
  if (textRuns) return textRuns;
  if (props.runs !== undefined) return deepClone(props.runs);
  if (props.text !== undefined) return deepClone(props.text);
  return getTextContent(node);
}

function renderShape(node: PptxNode, slide: PptxSlide): void {
  const props = offsetXY(node.props as any);
  slide.addShape(props.shape, mergeOptions(props.options, props, ["shape"]));
}

function renderLine(node: PptxNode, slide: PptxSlide): void {
  const props = offsetXY(node.props as any);
  slide.addShape("line", mergeOptions(props.options, props));
}

function renderLineBetween(node: PptxNode, slide: PptxSlide): void {
  const { x: ox, y: oy, width: grpW, height: grpH } = useGroupContext();
  const props = node.props as any;
  const x1 = resolveCoord(props.x1, grpW, 0) + ox;
  const y1 = resolveCoord(props.y1, grpH, 0) + oy;
  const x2 = resolveCoord(props.x2, grpW, 0) + ox;
  const y2 = resolveCoord(props.y2, grpH, 0) + oy;
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1);
  const h = Math.abs(y2 - y1);

  slide.addShape("line", {
    ...mergeOptions(props.options, props, ["x1", "y1", "x2", "y2"]),
    x,
    y,
    w,
    h,
    flipH: x2 < x1,
    flipV: y2 < y1,
  });
}

function renderImage(node: PptxNode, slide: PptxSlide): void {
  const props = offsetXY(node.props as any);
  slide.addImage(mergeOptions(props.options, props, ["shape"]));
}

function renderMedia(node: PptxNode, slide: PptxSlide): void {
  const props = offsetXY(node.props as any);
  slide.addMedia(mergeOptions(props.options, props, ["shape"]) as any);
}

function renderChart(node: PptxNode, slide: PptxSlide): void {
  const props = offsetXY(node.props as any);
  slide.addChart(
    props.type,
    deepClone(props.data),
    mergeOptions(props.options, props, ["type", "data", "shape"]),
  );
}

async function renderTable(node: PptxNode, slide: PptxSlide): Promise<void> {
  const props = offsetXY(node.props as any);
  const rows = props.rows ?? (await resolveTableRows(node));
  slide.addTable(deepClone(rows), mergeOptions(props.options, props, ["shape"]));
}

async function resolveTableRows(node: PptxNode): Promise<any[]> {
  const children = await resolveChildren(node);
  const rows: any[] = [];
  for (const child of children) {
    if (isPptxNode(child) && child.type === "TableRow") {
      rows.push(await extractTableRow(child));
    }
  }
  return rows;
}

function processTableToSlides(node: PptxNode, ctx: { pptx: PptxPresentation }): void {
  const props = node.props as any;
  ctx.pptx.tableToSlides(props.eleId, mergeOptions(props.options, props, ["eleId"]));
}

// ── Table helpers ─────────────────────────────────────────────────

async function extractTableRow(node: PptxNode): Promise<any[]> {
  if (node.type !== "TableRow") {
    throw new Error(`Table children must be TableRow nodes. Got ${node.type}.`);
  }
  const props = node.props as any;
  if (props.cells) return props.cells;

  const children = await resolveChildren(node);
  const cells: any[] = [];
  for (const child of children) {
    if (isPptxNode(child) && child.type === "TableCell") {
      cells.push(extractTableCell(child));
    }
  }
  return cells;
}

function extractTableCell(node: PptxNode): any {
  if (node.type !== "TableCell") {
    throw new Error(`TableRow children must be TableCell nodes. Got ${node.type}.`);
  }
  const props = node.props as any;
  return {
    text: deepClone(props.text ?? getTextContent(node)),
    options: mergeOptions(props.options, props),
  };
}

// ── Master helpers ────────────────────────────────────────────────

function buildMaster(node: PptxNode): Record<string, any> {
  const props = node.props as any;
  const { children, objects = [], ...rest } = props;
  const childObjects = children.filter(isPptxNode).map(extractMasterObject);
  return {
    ...rest,
    objects: deepClone([...objects, ...childObjects]),
  };
}

function extractMasterObject(node: PptxNode): Record<string, any> {
  assertLeafHasNoChildren(node.type, node.children);

  if (SHAPE_TYPES.has(node.type)) {
    const props = node.props as any;
    const opts = mergeOptions(props.options, props, ["shape"]);
    if (props.shape === "rect") return { rect: opts };
    if (props.shape === "line") return { line: opts };
    throw new Error(
      "Master only supports rect and line shape objects directly. Use the objects prop or Raw for other master shapes.",
    );
  }

  switch (node.type) {
    case "Text": {
      const props = node.props as any;
      return {
        text: {
          text: getTextContent(node, typeof props.text === "string" ? props.text : undefined),
          options: mergeOptions(props.options, props),
        },
      };
    }
    case "Image":
      return { image: mergeOptions((node.props as any).options, node.props, ["shape"]) };
    case "Line":
      return { line: mergeOptions((node.props as any).options, node.props, ["shape"]) };
    case "LineBetween": {
      const props = node.props as any;
      const x = Math.min(props.x1, props.x2);
      const y = Math.min(props.y1, props.y2);
      const w = Math.abs(props.x2 - props.x1);
      const h = Math.abs(props.y2 - props.y1);
      return {
        line: {
          ...mergeOptions(props.options, props, ["x1", "y1", "x2", "y2"]),
          x,
          y,
          w,
          h,
          flipH: props.x2 < props.x1,
          flipV: props.y2 < props.y1,
        },
      };
    }
    case "Placeholder": {
      const props = node.props as any;
      return {
        placeholder: {
          options: props.options,
          text: getTextContent(node, props.text),
        },
      };
    }
    default:
      throw new Error(
        `${node.type} is not supported inside Master. Use the objects prop or Raw for advanced master content.`,
      );
  }
}

// ── Text helpers ──────────────────────────────────────────────────

/**
 * Resolve all PptxNodePromise children in a node's children array.
 *
 * With our deferred thunk approach, all non-string component factory calls
 * return PptxNodePromise instances.  Node children arrays may contain a mix
 * of resolved PptxNodes and unresolved PptxNodePromises.  This helper
 * resolves all promises and returns a clean array of resolved PptxNodes
 * (plus primitives).
 *
 * Must be called from an async function WITHIN a rendering context
 * (slide / deck / group) so that thunk factories inherit the correct
 * AsyncLocalStorage context.
 */
async function resolveChildren(node: PptxNode): Promise<readonly PptxChild[]> {
  const resolved: PptxChild[] = [];
  for (const rawChild of node.children) {
    resolved.push(await resolveChild(rawChild));
  }
  return resolved;
}

async function collectTextRuns(node: PptxNode): Promise<any[] | undefined> {
  const children = await resolveChildren(node);

  // Run mode only kicks in when at least one <TextRun> child is present.
  // Plain-string-only children keep the legacy single-string path
  // (getTextContent, priority 4 in resolveTextContent).
  const hasTextRun = children.some((c) => isPptxNode(c) && c.type === "TextRun");
  if (!hasTextRun) return undefined;

  // Build the run list preserving child order: <TextRun> nodes map to
  // formatted runs; plain string/number children become default-style runs
  // so mixed content like <Text>plain<TextRun>styled</TextRun></Text>
  // renders as a normal segment followed by a styled one.
  // Whitespace-only strings (typical JSX multi-line formatting between
  // elements) are skipped so existing multi-line <TextRun> layouts keep
  // rendering identically — attach explicit spaces to a run's text instead.
  const runs: any[] = [];
  for (const child of children) {
    if (isPptxNode(child) && child.type === "TextRun") {
      runs.push(extractTextRun(child));
    } else if (typeof child === "number" || (typeof child === "string" && child.trim() !== "")) {
      runs.push({ text: String(child), options: {} });
    }
  }
  return runs.length > 0 ? runs : undefined;
}

/**
 * Normalize a `<TextRun>` node into a pptxgenjs `TextProps` entry:
 * `{ text, options }`.
 *
 * - `text` comes from the run's `text` prop, falling back to its string
 *   children (`<TextRun options={{...}}>Hello</TextRun>`).
 * - `options` merges the run's `options` object with any top-level
 *   formatting props (`bold`, `fontSize`, `color`, ...).
 */
function extractTextRun(node: PptxNode): Record<string, any> {
  const props = node.props as any;
  const text = props.text !== undefined ? props.text : getTextContent(node);
  const options = mergeOptions(props.options, props);
  // Always emit a `text` key: an empty run renders as an empty string
  // instead of silently producing an option-less TextProps entry.
  return { text: text !== undefined ? text : "", options };
}

function getTextContent(node: PptxNode, fallback?: string): string {
  if (fallback !== undefined) return fallback;
  return node.children
    .filter((c): c is string | number => typeof c === "string" || typeof c === "number")
    .map(String)
    .join("");
}

// ── Props / options utilities ─────────────────────────────────────

/**
 * Merge component top-level props with an `options` object.
 * Top-level props that match pptxgenjs option keys override `options`.
 * Reserved/structural props (children, options, etc.) are excluded.
 */
function mergeOptions(
  options: Record<string, any> | undefined,
  props: Record<string, any>,
  exclude: string[] = [],
): Record<string, any> {
  const result: Record<string, any> = deepClone(options ?? {});
  const skip = new Set(exclude);

  for (const [key, value] of Object.entries(props)) {
    if (!RESERVED_PROPS.has(key) && !skip.has(key) && value !== undefined) {
      result[key] = deepClone(value);
    }
  }

  return result;
}

/**
 * Deep-clone plain objects and arrays.
 * Preserves PptxGenJS class instances and other non-plain objects.
 */
function deepClone<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    if (proto === Object.prototype || proto === null) {
      const result: Record<string, any> = {};
      for (const [key, val] of Object.entries(value as Record<string, any>)) {
        result[key] = deepClone(val);
      }
      return result as T;
    }
  }
  return value;
}

function setIfDefined(obj: any, key: string, value: any): void {
  if (value !== undefined) {
    obj[key] = value;
  }
}

// ════════════════════════════════════════════════════════════════════
// VALIDATION
// ════════════════════════════════════════════════════════════════════

export interface ValidationIssue {
  code: string;
  level: "error" | "warning";
  path: string;
  message: string;
}

// ── Valid child sets ──────────────────────────────────────────────

const DECK_CHILDREN = new Set([
  "Layout",
  "Master",
  "Section",
  "Slide",
  "TableToSlides",
  "Raw",
  "Fragment",
]);

const SECTION_CHILDREN = new Set(["Slide", "Fragment"]);

const SLIDE_CHILDREN = new Set([
  "Group",
  "Text",
  "Shape",
  "Rect",
  "RoundRect",
  "Ellipse",
  "Oval",
  "Triangle",
  "RightTriangle",
  "Diamond",
  "Pentagon",
  "Hexagon",
  "Star",
  "Star4",
  "Star5",
  "Star6",
  "Star8",
  "Star10",
  "Line",
  "LineBetween",
  "Arc",
  "BlockArc",
  "PieShape",
  "CustomGeometry",
  "LeftArrow",
  "RightArrow",
  "UpArrow",
  "DownArrow",
  "LeftRightArrow",
  "UpDownArrow",
  "Chevron",
  "Cloud",
  "Heart",
  "Donut",
  "Plus",
  "Image",
  "Media",
  "Chart",
  "AreaChart",
  "BarChart",
  "Bar3DChart",
  "BubbleChart",
  "DoughnutChart",
  "LineChart",
  "PieChart",
  "RadarChart",
  "ScatterChart",
  "Table",
  "Notes",
  "Raw",
  "Fragment",
]);

const TABLE_CHILDREN = new Set(["TableRow", "Fragment"]);
const TABLE_ROW_CHILDREN = new Set(["TableCell", "Fragment"]);

function getValidChildTypes(type: string): Set<string> | undefined {
  switch (type) {
    case "Deck":
      return DECK_CHILDREN;
    case "Section":
      return SECTION_CHILDREN;
    case "Slide":
      return SLIDE_CHILDREN;
    case "Table":
      return TABLE_CHILDREN;
    case "TableRow":
      return TABLE_ROW_CHILDREN;
    default:
      return undefined;
  }
}

// ── Validation entry point ────────────────────────────────────────

/**
 * Validate a Deck or Slide tree for common mistakes.
 * Returns a list of issues (errors and warnings).
 *
 * Accepts both resolved PptxNode and deferred PptxNodePromise (which is
 * resolved first).  Only resolves **already-resolved** children during
 * traversal — PptxNodePromise (deferred component thunks) are skipped
 * because their factories may require rendering context (slide / deck /
 * group) that is NOT available during validation.
 *
 * This means validation only checks the structural skeleton (Deck → Slide
 * → intrinsic elements like Text, Rect, etc.) and skips any user-defined
 * component boundaries until rendering.
 *
 * Leaf components (shapes, images, charts, ...) are reported as
 * `child.leaf` errors when they carry already-resolved children.  The
 * render pipeline enforces the same rule authoritatively via
 * `assertLeafHasNoChildren()`, so an empty issues array never means the
 * whole tree was fully validated.
 */
export async function validateDeck(root: PptxElement): Promise<ValidationIssue[]> {
  const node = await resolveChild(root);
  const issues: ValidationIssue[] = [];

  if (node.type !== "Deck" && node.type !== "Slide") {
    issues.push({
      code: "root.invalid",
      level: "error",
      path: node.type,
      message: `Root must be Deck or Slide, got ${node.type}.`,
    });
  }

  await walk(node, node.type);
  return issues;

  async function walk(node: PptxNode, path: string): Promise<void> {
    validateLeafChildren(node, path, issues);
    validateNodeProps(node, path, issues);
    for (const rawChild of node.children) {
      // Skip PptxNodePromise — component factories may need rendering
      // context that is not available during validation.  This means the
      // validator only checks the structural skeleton plus already-resolved
      // nodes; for ordinary JSX the render-time leaf assertion is the
      // authoritative guard (see assertLeafHasNoChildren).
      if (!isPptxNode(rawChild)) continue;
      validateChildType(node, rawChild, `${path}/${rawChild.type}`, issues);
      await walk(rawChild, `${path}/${rawChild.type}`);
    }
  }
}

/**
 * Report leaf components that carry children (`child.leaf`).
 *
 * Only **already-resolved** child nodes are checked: deferred
 * PptxNodePromise thunks (which is what ordinary JSX produces) are not
 * executed during validation because their factories may require a
 * rendering context.  The render pipeline always enforces the same rule
 * via `assertLeafHasNoChildren()`.
 */
function validateLeafChildren(parent: PptxNode, path: string, issues: ValidationIssue[]): void {
  if (!isLeafNodeType(parent.type)) return;
  for (const child of parent.children) {
    // Mirrors assertLeafHasNoChildren(): both node children AND smuggled
    // primitives (hand-built trees) are rejected, keeping validation and
    // rendering symmetric.
    if (isPptxNode(child)) {
      issues.push({
        code: "child.leaf",
        level: "error",
        path: `${path}/${child.type}`,
        message: `${child.type} is not a valid child of leaf component ${parent.type}.`,
      });
    } else {
      issues.push({
        code: "child.leaf",
        level: "error",
        path,
        message: `Leaf component ${parent.type} cannot contain text or expression children.`,
      });
    }
  }
}

function validateChildType(
  parent: PptxNode,
  child: PptxNode,
  path: string,
  issues: ValidationIssue[],
): void {
  const validChildren = getValidChildTypes(parent.type);
  if (validChildren && !validChildren.has(child.type)) {
    issues.push({
      code: "child.invalid",
      level: "error",
      path,
      message: `${child.type} is not a valid child of ${parent.type}.`,
    });
  }
}

function validateNodeProps(node: PptxNode, path: string, issues: ValidationIssue[]): void {
  const props = node.props as any;

  if (node.type === "RoundRect" && "angleRange" in props) {
    issues.push({
      code: "shape.prop.invalid",
      level: "warning",
      path,
      message: "RoundRect ignores angleRange; use Arc, PieShape, or BlockArc for angle ranges.",
    });
  }

  if ((node.type === "Arc" || node.type === "PieShape") && "arcThicknessRatio" in props) {
    issues.push({
      code: "shape.prop.invalid",
      level: "warning",
      path,
      message: `${node.type} ignores arcThicknessRatio; use BlockArc for arc thickness.`,
    });
  }

  if (node.type === "Text") {
    const ignored = findIgnoredTextInput(node, props);
    if (ignored.length > 0) {
      issues.push({
        code: "text.input.mixed",
        level: "warning",
        path,
        message:
          `Mixed Text input (${ignored.join(" and ")} ignored): content resolves by ` +
          "priority (<TextRun> children → runs → text → plain children). " +
          "Prefer <TextRun> children for rich text.",
      });
    }
  }

  if (node.type === "LineBetween") {
    for (const key of ["x1", "y1", "x2", "y2"] as const) {
      const val = props[key];
      if (
        val == null ||
        (typeof val !== "number" && typeof val !== "string") ||
        (typeof val === "number" && Number.isNaN(val))
      ) {
        issues.push({
          code: "line.endpoint.invalid",
          level: "error",
          path,
          message: `LineBetween requires ${key} to be a Coord (number or percentage string).`,
        });
      }
    }
  }

  if (
    node.type === "CustomGeometry" &&
    (!Array.isArray(props.points) || props.points.length === 0)
  ) {
    issues.push({
      code: "shape.prop.missing",
      level: "error",
      path,
      message: "CustomGeometry requires a non-empty points array.",
    });
  }

  if (
    (node.type === "Image" || node.type === "Media") &&
    !("path" in props) &&
    !("data" in props) &&
    !("link" in props)
  ) {
    issues.push({
      code: "asset.source.missing",
      level: "warning",
      path,
      message: `${node.type} usually needs path, data, or link.`,
    });
  }
}

/**
 * Detect mixed `<Text>` inputs where a lower-priority source is silently
 * ignored by resolveTextContent().
 *
 * Every input mode is supported (priority: <TextRun> children → runs →
 * text → plain children), so mixing them is not an error — but it is
 * confusing, and <TextRun> children are the recommended way to express
 * rich text. Returns descriptions of the ignored sources (empty array
 * when nothing is ignored).
 *
 * Plain-string children mixed with <TextRun> children are NOT ignored —
 * collectTextRuns() converts them into default-style runs (documented
 * feature), so that combination is not reported.
 */
function findIgnoredTextInput(node: PptxNode, props: Record<string, any>): string[] {
  const ignored: string[] = [];
  const hasRunChildren = node.children.some((c) => isPptxNode(c) && c.type === "TextRun");
  const hasPlainChildren = node.children.some(
    (c) => typeof c === "number" || (typeof c === "string" && c.trim() !== ""),
  );
  const hasRuns = props.runs !== undefined;
  const hasText = props.text !== undefined;

  if (hasRunChildren) {
    if (hasRuns) ignored.push("the `runs` prop");
    if (hasText) ignored.push("the `text` prop");
    return ignored;
  }
  if (hasRuns) {
    if (hasText) ignored.push("the `text` prop");
    if (hasPlainChildren) ignored.push("plain-string children");
    return ignored;
  }
  if (hasText && hasPlainChildren) {
    ignored.push("plain-string children");
  }
  return ignored;
}

/** Alias for backward compatibility. */
export const validatePptxTree = validateDeck;
