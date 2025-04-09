import { Bounds } from "@/archimate-model";
import { ViewNode } from "@/archimate-model";
import BadgedRoundedRectShape from "./badged-rounded-rect-shape";
import * as BadgedRect from "./badged-rect-shape";
import * as BaseViewNode from "./base-shape";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const EventShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  if (viewNode.childType === "1") {
    return (
      <EventPath
        viewNode={viewNode}
        backgroundClass={backgroundClass}
        shapeStyle={shapeStyle}
      />
    );
  } else {
    return (
      <BadgedRoundedRectShape
        viewNode={viewNode}
        backgroundClass={backgroundClass}
        shapeStyle={shapeStyle}
      />
    );
  }
};

export function eventBadgeBounds(viewNode: ViewNode): Bounds | undefined {
  if (viewNode.childType === "1") {
    return undefined;
  } else {
    return BadgedRect.badgedRectBadgeBounds(viewNode);
  }
}

export function eventTextBounds(viewNode: ViewNode): Bounds {
  if (viewNode.childType === "1") {
    const textBounds = BaseViewNode.defaultTextBounds(viewNode);
    const notchX = 18;
    return new Bounds(
      textBounds.left + notchX * 0.8,
      textBounds.top,
      textBounds.width - notchX,
      textBounds.height,
    );
  } else {
    return BaseViewNode.defaultTextBounds(viewNode);
  }
}

const EventPath: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  const notchX = 18;
  const notchHeight = bounds.height / 2.0;
  const eventWidth = bounds.width * 0.85;
  const rx = 17;
  const d = [
    "M",
    bounds.left,
    bounds.top,
    "l",
    notchX,
    notchHeight,
    "l",
    -notchX,
    notchHeight,
    "h",
    eventWidth,
    "a",
    rx,
    notchHeight,
    0,
    0,
    0,
    0,
    -bounds.height,
    "z",
  ].join(" ");
  return <path d={d} className={backgroundClass} style={shapeStyle} />;
};

export default EventShape;
