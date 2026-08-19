/**
 * Core node types for pptxgenjsx.
 *
 * Provides PptxNode, PptxNodePromise (async component support),
 * and type definitions used by the JSX runtime and rendering engine.
 */
import type PptxGenJS from "pptxgenjs-plus";

// ── Primitive types ───────────────────────────────────────────────

export type PrimitiveChild = string | number | boolean | null | undefined;

export type ComponentProps = object;

/**
 * Props for container components — components that legitimately render
 * their children (Deck, Slide, Section, Master, Placeholder, Text,
 * TextRun, Notes, Table, TableRow, TableCell, Group, ...).
 */
export type ContainerProps = {
  children?: PptxChildren;
};

/**
 * Props for leaf components — components that must NOT render children
 * (shapes, lines, images, media, charts, ...).  Declaring
 * `children?: never` makes the intent explicit and turns any accidental
 * JSX children into a compile-time error.
 */
export type LeafProps = {
  children?: never;
};

// ── PptxNodePromise — deferred component factory wrapper ──────────

/**
 * A deferred component factory wrapper.
 *
 * Unlike the original design (which stored a pre-resolved Promise), this
 * stores a **thunk** — a zero-argument factory function.  The thunk is
 * called **synchronously** when `resolveChild()` processes the promise,
 * which means the factory executes inside whatever rendering context
 * (slide / deck / group) is active at that point.
 *
 * This is critical for `AsyncLocalStorage`-based contexts
 * (`useSlideContext`, `useDeckContext`, `useGroupContext`): if the
 * factory were scheduled via `Promise.resolve().then()`, the promise
 * chain would be created outside the rendering context (during JSX
 * construction), and `AsyncLocalStorage` context would NOT propagate
 * into the `.then()` callback.  By calling the thunk synchronously
 * from `resolveChild()`, the factory inherits the caller's rendering
 * context naturally.
 */
export interface PptxNodePromise {
  readonly $pptxPromise: true;
  /** Factory thunk — called synchronously by resolveChild(). */
  readonly thunk: () => PptxNode | Promise<PptxNode>;
}

export function createPptxNodePromise(thunk: () => PptxNode | Promise<PptxNode>): PptxNodePromise {
  return { $pptxPromise: true, thunk };
}

export function isPptxNodePromise(value: unknown): value is PptxNodePromise {
  return value != null && typeof value === "object" && (value as any).$pptxPromise === true;
}

/**
 * Resolve a PptxNodePromise or plain Promise recursively until a concrete
 * PptxNode (or primitive) is obtained.
 *
 * Resolution strategy:
 * 1. PptxNodePromise → call `.thunk()` synchronously, then re-check
 * 2. Promise (async component) → `await` it, then re-check
 * 3. PptxNode or primitive → return as-is
 *
 * Why recursive?  With deferred component factories (jsx-runtime wraps ALL
 * non-string component calls in PptxNodePromise), an async component like:
 *
 *   async function TitleSlide() {
 *     return (<>...</>);  // jsx(Fragment, ...) returns PptxNodePromise
 *   }
 *
 * produces Promise<PptxNodePromise> — the outer Promise from the `async`
 * keyword, the inner PptxNodePromise from the JSX factory.  We need to
 * unwrap both layers before we get a usable PptxNode.
 */
export async function resolveChild<T>(child: T): Promise<T extends PptxNodePromise ? PptxNode : T> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (isPptxNodePromise(child)) {
      // Call thunk synchronously — the factory needs to run inside
      // whatever AsyncLocalStorage context (slide / deck / group) the
      // caller has set up.
      child = child.thunk() as any;
      continue;
    }
    if (child instanceof Promise) {
      child = (await child) as any;
      continue;
    }
    break;
  }
  return child as any;
}

// ── Child types (supports both sync and async nodes) ──────────────

export type PptxChild = PptxNode | PptxNodePromise | Promise<PptxNode> | PrimitiveChild;

export type PptxChildren = PptxChild | PptxChildren[];

// ── Leaf components ───────────────────────────────────────────────

/**
 * Node types that are terminal rendering operations and therefore cannot
 * contain children. This is the shared source of truth for construction,
 * rendering, and validation.
 */
export const LEAF_NODE_TYPES: ReadonlySet<string> = new Set([
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
  "Line",
  "LineBetween",
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
  "Layout",
  "TableToSlides",
]);

/** Whether a node type is a leaf component. */
export function isLeafNodeType(type: string): boolean {
  return LEAF_NODE_TYPES.has(type);
}

/**
 * Fail when a leaf component receives children. This protects JavaScript,
 * `any`, and hand-built node trees that bypass the TSX `children?: never`
 * constraint.
 */
export function assertLeafHasNoChildren(type: string, children: readonly PptxChild[]): void {
  if (!isLeafNodeType(type) || children.length === 0) return;

  throw new Error(
    `${type} is a leaf component and cannot contain children. ` +
      `Render <${type} /> and <Text> as siblings. Wrap them in <Group> only when ` +
      `relative positioning is needed, or use <Text shape="..."> for a single text box ` +
      `with a shape background.`,
  );
}

// ── ComponentFactory — the key async-friendly type ────────────────

/** A component factory can return a PptxNode synchronously OR a Promise.
 *
 * Children support is **not** added unconditionally anymore: whether a
 * component accepts children is decided by its own props type.  Container
 * components declare `children?: PptxChildren` (or use {@link ContainerProps});
 * leaf components omit it or use {@link LeafProps} (`children?: never`).
 * User-defined components only accept children if their props declare them.
 */
export type ComponentFactory<P extends ComponentProps = ComponentProps> = (
  props: P,
) => PptxNode<string, P> | Promise<PptxNode<string, P>>;

/** Union type for JSX element — accepts both sync and async component results. */
export type PptxElement = PptxNode | PptxNodePromise;

// ── PptxNode class ────────────────────────────────────────────────

export class PptxNode<
  TType extends string = string,
  TProps extends ComponentProps = ComponentProps,
> {
  readonly $$pptxNode = true;
  readonly type: TType;
  readonly props: Readonly<TProps>;
  readonly children: readonly PptxChild[];

  constructor(type: TType, props: TProps & { children?: PptxChildren }) {
    const { children, ...rest } = props;
    const flatChildren = flattenChildren(children);
    assertLeafHasNoChildren(type, flatChildren);
    this.type = type;
    this.props = Object.freeze(rest) as Readonly<TProps>;
    this.children = Object.freeze(flatChildren);
  }

  toJSON(): Record<string, unknown> {
    return {
      type: this.type,
      props: this.props,
      children: this.children
        .filter((c): c is PptxNode | PptxNodePromise | string | number | boolean => isValidChild(c))
        .map((c) => (isPptxNode(c) ? c.toJSON() : c)),
    };
  }
}

// ── Factory helpers ───────────────────────────────────────────────

export function createNode<TType extends string, TProps extends ComponentProps>(
  type: TType,
  props: TProps & { children?: PptxChildren },
): PptxNode<TType, TProps> {
  return new PptxNode(type, props);
}

export function isPptxNode(value: unknown): value is PptxNode {
  return (
    value instanceof PptxNode || !!(value && typeof value === "object" && (value as any).$$pptxNode)
  );
}

export function isValidChild(
  value: unknown,
): value is PptxNode | PptxNodePromise | string | number | boolean {
  return (
    isPptxNode(value) ||
    isPptxNodePromise(value) ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

export function flattenChildren(children: PptxChildren | undefined): PptxChild[] {
  if (children == null || children === false) return [];
  const result: PptxChild[] = [];
  flatten(children, result);
  return result;
}

function flatten(input: PptxChildren, output: PptxChild[]): void {
  if (Array.isArray(input)) {
    for (const item of input) {
      flatten(item, output);
    }
    return;
  }
  if (input != null && input !== false) {
    output.push(input);
  }
}

// ── Fragment ──────────────────────────────────────────────────────

/**
 * Structural fragment — renders its children in place without producing
 * a wrapper element.
 *
 * Defined in the core model (not in the JSX runtime) so the public entry
 * point can re-export it as a **value** (`export { Fragment }`).  The JSX
 * runtime re-exports the same function for TypeScript's `jsxImportSource`
 * automatic import on `<>...</>`.
 */
export function Fragment(props: { children?: PptxChildren }): PptxNode<"Fragment", {}> {
  return createNode("Fragment", {
    children: flattenChildren(props.children),
  });
}

// ── Re-export common pptxgenjs types for convenience ──────────────

export type PptxPresentation = PptxGenJS;
export type PptxSlide = PptxGenJS.PresSlide;
