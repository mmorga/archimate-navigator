import { Bounds } from "../../../archimate-model";
import { ViewNode } from "../../../archimate-model";

export function badgeBounds(viewNode: ViewNode): Bounds | undefined {
  return new Bounds(
    viewNode.absolutePosition().right - 25,
    viewNode.absolutePosition().top + 5,
    20,
    20,
  );
}
