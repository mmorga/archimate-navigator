import { ViewNode } from "@/archimate-model";
import { CSSProperties, JSX } from "react";

export function entityLabel() {
  return undefined;
}

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  const center = bounds.center();
  const r = Math.min(bounds.width, bounds.height) / 2;
  return (
    <circle
      cx={center.x}
      cy={center.y}
      r={r}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
}

// export default JunctionViewNode;
