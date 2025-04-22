import { Bounds, IViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";
import * as BaseViewNode from "./base-shape";
import BadgedRectShape from "./badged-rect-shape";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

export function applicationComponentTextBounds(viewNode: IViewNode): Bounds {
  if (viewNode.childType === "1") {
    return BaseViewNode.defaultTextBounds(viewNode);
  } else {
    const bounds = viewNode.absolutePosition();
    const mainBoxX = bounds.left + 21.0 / 2;
    return new Bounds(
      mainBoxX + 21 / 2,
      bounds.top + 1,
      bounds.width - 22,
      bounds.height - 2,
    );
  }
}

const ApplicationComponentShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  if (viewNode.childType === "1") {
    return (
      <BadgedRectShape
        viewNode={viewNode}
        backgroundClass={backgroundClass}
        shapeStyle={shapeStyle}
      />
    );
  } else {
    const bounds = viewNode.absolutePosition();
    const mainBoxX = bounds.left + 21.0 / 2;
    const mainBoxWidth = bounds.width - 21 / 2;
    return (
      <>
        <rect
          x={mainBoxX}
          y={bounds.top}
          width={mainBoxWidth}
          height={bounds.height}
          className={backgroundClass}
          style={shapeStyle}
        />
        <ApplicationComponentDecoration
          left={bounds.left}
          top={bounds.top + 10}
          backgroundClass={backgroundClass}
          shapeStyle={shapeStyle}
        />
        <ApplicationComponentDecoration
          left={bounds.left}
          top={bounds.top + 30}
          backgroundClass={backgroundClass}
          shapeStyle={shapeStyle}
        />
      </>
    );
  }
};

function ApplicationComponentDecoration({
  left,
  top,
  backgroundClass,
  shapeStyle,
}: {
  left: number;
  top: number;
  backgroundClass: string | undefined;
  shapeStyle: CSSProperties | undefined;
}) {
  return (
    <>
      <rect
        x={left}
        y={top}
        width="21"
        height="13"
        className={backgroundClass}
        style={shapeStyle}
      />
      <rect
        x={left}
        y={top}
        width="21"
        height="13"
        className="archimate-decoration"
      />
    </>
  );
}

export default ApplicationComponentShape;
